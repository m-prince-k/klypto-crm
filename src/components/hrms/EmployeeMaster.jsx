import React, { useState, useEffect } from "react";
import {
  Users2,
  Mail,
  Phone,
  Building2,
  UserCheck,
  Pencil,
  Trash2,
  PlusCircle,
  X,
  Loader,
  Clock,
  UserMinus,
} from "lucide-react";
import apiClient from "../../api/apiClient";

const EmployeeMaster = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    role: "",
    department: "",
    status: "Active",
  });

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get("/employees");
      setEmployees(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to load employees",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleOpenModal = (employee = null) => {
    if (employee) {
      setEditingId(employee.id);
      setFormData({
        name: employee.name,
        code: employee.code,
        role: employee.role,
        department: employee.department,
        status: employee.status,
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        code: "",
        role: "",
        department: "",
        status: "Active",
      });
    }
    setIsModalOpen(true);
    setError(null);
    setSuccess(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: "",
      code: "",
      role: "",
      department: "",
      status: "Active",
    });
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code || !formData.role || !formData.department) {
      setError("Please fill out all required fields.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      if (editingId) {
        await apiClient.patch(`/employees/${editingId}`, formData);
        setSuccess("Employee updated successfully.");
      } else {
        await apiClient.post("/employees", formData);
        setSuccess("Employee added successfully.");
      }
      handleCloseModal();
      fetchEmployees();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to save employee",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    setError(null);
    setSuccess(null);
    try {
      await apiClient.delete(`/employees/${id}`);
      setSuccess(`${name} deleted successfully.`);
      fetchEmployees();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to delete employee",
      );
    }
  };

  return (
    <div style={{ display: "grid", gap: "24px", position: "relative" }}>
      <div className="glass-card" style={{ padding: "24px" }}>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "700",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Users2 size={18} /> Employee Master Summary
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          {(() => {
            const activeCount = employees.filter(e => e.status === "Active").length;
            const onboardingCount = employees.filter(e => e.status === "Onboarding").length;
            const inactiveCount = employees.filter(e => e.status === "Inactive").length;

            return [
              {
                label: "Total Employees",
                value: employees.length.toString(),
                icon: <Users2 size={16} />,
              },
              {
                label: "Active Employees",
                value: activeCount.toString(),
                icon: <UserCheck size={16} />,
              },
              {
                label: "Onboarding",
                value: onboardingCount.toString(),
                icon: <Clock size={16} />,
              },
              {
                label: "Inactive",
                value: inactiveCount.toString(),
                icon: <UserMinus size={16} />,
              },
            ].map((field) => (
            <div
              key={field.label}
              style={{
                padding: "14px",
                borderRadius: "12px",
                backgroundColor: "var(--column-bg)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  marginBottom: "6px",
                }}
              >
                {field.icon}
                {field.label}
              </div>
              <div style={{ fontSize: "14px", fontWeight: "600" }}>
                {field.value}
              </div>
            </div>
          ))})}
        </div>
      </div>

      <div className="glass-card" style={{ padding: "24px" }}>
        {error && !isModalOpen && (
          <div
            style={{
              padding: "10px 12px",
              marginBottom: "16px",
              borderRadius: "8px",
              border: "1px solid rgba(239,68,68,0.4)",
              backgroundColor: "rgba(239,68,68,0.12)",
              color: "#fca5a5",
              fontSize: "13px",
            }}
          >
            {error}
          </div>
        )}
        {success && !isModalOpen && (
          <div
            style={{
              padding: "10px 12px",
              marginBottom: "16px",
              borderRadius: "8px",
              border: "1px solid rgba(34,197,94,0.4)",
              backgroundColor: "rgba(34,197,94,0.12)",
              color: "#86efac",
              fontSize: "13px",
            }}
          >
            {success}
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h3 style={{ fontSize: "18px", fontWeight: "700" }}>
            Employee Directory
          </h3>
          <button className="btn-primary" onClick={() => handleOpenModal()}>
            <PlusCircle size={14} style={{ marginRight: "6px" }} /> Add Employee
          </button>
        </div>

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "40px",
              color: "var(--text-muted)",
            }}
          >
            <Loader className="spinner" size={24} />
          </div>
        ) : employees.length === 0 ? (
          <div
            style={{
              padding: "30px",
              textAlign: "center",
              color: "var(--text-muted)",
              fontStyle: "italic",
            }}
          >
            No employees found. Add some to get started.
          </div>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {employees.map((employee) => (
              <div
                key={employee.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "16px",
                  alignItems: "center",
                  padding: "14px",
                  borderRadius: "12px",
                  backgroundColor: "var(--column-bg)",
                  border: "1px solid var(--border)",
                }}
              >
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "700" }}>
                    {employee.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {employee.code} · {employee.role}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "24px",
                  }}
                >
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "13px", fontWeight: "600" }}>
                      {employee.department}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color:
                          employee.status === "Active" ? "#10b981" : "#f59e0b",
                      }}
                    >
                      {employee.status}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleOpenModal(employee)}
                      style={{
                        background: "var(--input-bg)",
                        border: "1px solid var(--border)",
                        color: "var(--text-main)",
                        padding: "6px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                      title="Edit Employee"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(employee.id, employee.name)}
                      style={{
                        background: "rgba(239, 68, 68, 0.12)",
                        border: "1px solid rgba(239, 68, 68, 0.4)",
                        color: "#fca5a5",
                        padding: "6px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                      title="Delete Employee"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="glass-card"
            style={{
              width: "100%",
              maxWidth: "400px",
              padding: "24px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: "700" }}>
                {editingId ? "Edit Employee" : "Add Employee"}
              </h3>
              <button
                onClick={handleCloseModal}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div
                style={{
                  padding: "10px",
                  marginBottom: "16px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(239,68,68,0.12)",
                  border: "1px solid rgba(239,68,68,0.4)",
                  color: "#fca5a5",
                  fontSize: "13px",
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSave} style={{ display: "grid", gap: "16px" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    marginBottom: "6px",
                    color: "var(--text-muted)",
                  }}
                >
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    backgroundColor: "var(--input-bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--text-main)",
                    padding: "10px 12px",
                    fontSize: "14px",
                  }}
                  placeholder="e.g. John Doe"
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    marginBottom: "6px",
                    color: "var(--text-muted)",
                  }}
                >
                  Code *
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    backgroundColor: "var(--input-bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--text-main)",
                    padding: "10px 12px",
                    fontSize: "14px",
                  }}
                  placeholder="e.g. EMP-001"
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    marginBottom: "6px",
                    color: "var(--text-muted)",
                  }}
                >
                  Role *
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    backgroundColor: "var(--input-bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--text-main)",
                    padding: "10px 12px",
                    fontSize: "14px",
                  }}
                  placeholder="e.g. Software Engineer"
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    marginBottom: "6px",
                    color: "var(--text-muted)",
                  }}
                >
                  Department *
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    backgroundColor: "var(--input-bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--text-main)",
                    padding: "10px 12px",
                    fontSize: "14px",
                  }}
                  placeholder="e.g. Technology"
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    marginBottom: "6px",
                    color: "var(--text-muted)",
                  }}
                >
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    backgroundColor: "var(--input-bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--text-main)",
                    padding: "10px 12px",
                    fontSize: "14px",
                  }}
                >
                  <option value="Active" style={{ backgroundColor: "var(--bg-dark)", color: "var(--text-main)" }}>Active</option>
                  <option value="Onboarding" style={{ backgroundColor: "var(--bg-dark)", color: "var(--text-main)" }}>Onboarding</option>
                  <option value="Inactive" style={{ backgroundColor: "var(--bg-dark)", color: "var(--text-main)" }}>Inactive</option>
                </select>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                  marginTop: "8px",
                }}
              >
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    backgroundColor: "transparent",
                    color: "var(--text-main)",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "8px",
                    backgroundColor: "var(--primary)",
                    color: "white",
                    border: "none",
                    cursor: saving ? "not-allowed" : "pointer",
                    fontWeight: "600",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {saving ? (
                    <>
                      <Loader size={16} className="spinner" /> Saving...
                    </>
                  ) : (
                    "Save Employee"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeMaster;
