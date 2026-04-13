import React, { useState, useEffect } from "react";
import {
  Network,
  UserSquare2,
  ChevronRight,
  MoreVertical,
  Building2,
  Plus,
  Loader,
  X,
  Target,
  Users,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "../../api/apiClient";

const EntityManagement = () => {
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [branchForm, setBranchForm] = useState({
    name: "",
    type: "Branch",
    headId: "",
  });
  const [deptForm, setDeptForm] = useState({
    name: "",
    branchId: "",
    headId: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [branchRes, deptRes, empRes] = await Promise.all([
        apiClient.get("/entities/branches"),
        apiClient.get("/entities/departments"),
        apiClient.get("/employees"),
      ]);
      setBranches(branchRes.data);
      setDepartments(deptRes.data);
      setEmployees(empRes.data);
    } catch (err) {
      console.error("Failed to fetch entities", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateBranch = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post("/entities/branches", branchForm);
      setShowBranchModal(false);
      setBranchForm({ name: "", type: "Branch", headId: "" });
      fetchData();
    } catch (err) {
      alert("Failed to create branch");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateDept = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post("/entities/departments", deptForm);
      setShowDeptModal(false);
      setDeptForm({ name: "", branchId: "", headId: "" });
      await fetchData();
    } catch (err) {
      alert("Failed to create department");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBranch = async (id) => {
    if (
      !window.confirm(
        "Deleting a branch will affect all its departments and employees. Continue?",
      )
    )
      return;
    setLoading(true);
    try {
      await apiClient.delete(`/entities/branches/${id}`);
      await fetchData();
    } catch (err) {
      alert("Failed to delete branch");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDept = async (id) => {
    if (
      !window.confirm("Delete this department? This will unassign its members.")
    )
      return;
    setLoading(true);
    try {
      await apiClient.delete(`/entities/departments/${id}`);
      await fetchData();
    } catch (err) {
      alert("Failed to delete department");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div
        className="erp-entity-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "800" }}>
            Organization Hierarchy
          </h2>
          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            Manage branches and departmental structures.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => setShowBranchModal(true)}
            className="btn-primary"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <Plus size={18} /> Add Branch
          </button>
          <button
            onClick={() => setShowDeptModal(true)}
            className="btn-secondary"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <Plus size={18} /> Add Department
          </button>
        </div>
      </div>

      <div
        className="responsive-grid-2 erp-entity-grid"
        style={{ display: "grid", gap: "24px" }}
      >
        {/* Branches List */}
        <div
          className="glass-card"
          style={{
            padding: "24px",
            background:
              "linear-gradient(180deg, var(--bg-card), rgba(30, 41, 59, 0.8))",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <h3
              style={{
                fontSize: "17px",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Network size={20} className="text-primary" /> Branches
            </h3>
            <span
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                fontWeight: "600",
              }}
            >
              {branches.length} Total
            </span>
          </div>

          {loading ? (
            <div
              style={{
                height: "100px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Loader className="spinner" size={24} />
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {branches.map((branch) => (
                <div
                  key={branch.id}
                  className="erp-entity-item"
                  style={{
                    padding: "16px",
                    backgroundColor: "rgba(255,255,255,0.03)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    border: "1px solid var(--border)",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.03)")
                  }
                >
                  <div
                    style={{
                      padding: "10px",
                      backgroundColor: "var(--icon-bg)",
                      borderRadius: "8px",
                      color: "var(--primary)",
                    }}
                  >
                    <Building2 size={24} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: "14px", fontWeight: "700" }}>
                      {branch.name}
                    </h4>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "var(--text-muted)",
                        marginTop: "2px",
                      }}
                    >
                      {branch.type} • {branch._count?.departments || 0} Depts •{" "}
                      {branch._count?.employees || 0} Staff
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    {branch.head && (
                      <div style={{ textAlign: "right", paddingRight: "10px" }}>
                        <p
                          style={{
                            fontSize: "10px",
                            color: "var(--text-muted)",
                            textTransform: "uppercase",
                            fontWeight: "700",
                          }}
                        >
                          Head
                        </p>
                        <p style={{ fontSize: "12px", fontWeight: "600" }}>
                          {branch.head.name}
                        </p>
                      </div>
                    )}
                    <button
                      onClick={() => handleDeleteBranch(branch.id)}
                      disabled={loading}
                      title="Delete Branch"
                      style={{ color: "var(--text-muted)", opacity: 0.6 }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#ef4444")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--text-muted)")
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {!loading && branches.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "var(--text-muted)",
                    fontSize: "13px",
                    border: "1px dashed var(--border)",
                    borderRadius: "12px",
                  }}
                >
                  No branches registered yet.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Departments List */}
        <div
          className="glass-card"
          style={{
            padding: "24px",
            background:
              "linear-gradient(180deg, var(--bg-card), rgba(30, 41, 59, 0.8))",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <h3
              style={{
                fontSize: "17px",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <UserSquare2 size={20} style={{ color: "var(--primary)" }} />{" "}
              Departments
            </h3>
            <span
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                fontWeight: "600",
              }}
            >
              {departments.length} Units
            </span>
          </div>

          {loading ? (
            <div
              style={{
                height: "100px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Loader className="spinner" size={24} />
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  className="erp-entity-item"
                  style={{
                    padding: "16px",
                    backgroundColor: "rgba(255,255,255,0.03)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    border: "1px solid var(--border)",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.03)")
                  }
                >
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: "14px", fontWeight: "700" }}>
                      {dept.name}
                    </h4>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "var(--text-muted)",
                        marginTop: "2px",
                      }}
                    >
                      {dept.branch?.name} • {dept._count?.employees || 0}{" "}
                      Members
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ textAlign: "right", minWidth: "100px" }}>
                      <p
                        style={{
                          fontSize: "10px",
                          color: "var(--text-muted)",
                          textTransform: "uppercase",
                          fontWeight: "700",
                        }}
                      >
                        Leader
                      </p>
                      <p style={{ fontSize: "13px", fontWeight: "600" }}>
                        {dept.head?.name || "Unassigned"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteDept(dept.id)}
                      disabled={loading}
                      title="Delete Department"
                      style={{ color: "var(--text-muted)", opacity: 0.6 }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#ef4444")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--text-muted)")
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {!loading && departments.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "var(--text-muted)",
                    fontSize: "13px",
                    border: "1px dashed var(--border)",
                    borderRadius: "12px",
                  }}
                >
                  No departments created yet.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Branch Modal */}
      <AnimatePresence>
        {showBranchModal && (
          <div
            className="modal-overlay"
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "20px",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card"
              style={{ width: "100%", maxWidth: "450px", padding: "32px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "24px",
                }}
              >
                <h2 style={{ fontSize: "18px", fontWeight: "800" }}>
                  New Corporate Branch
                </h2>
                <button onClick={() => setShowBranchModal(false)}>
                  <X size={20} style={{ color: "white" }} />
                </button>
              </div>
              <form
                onSubmit={handleCreateBranch}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      marginBottom: "8px",
                    }}
                  >
                    Branch Name
                  </label>
                  <input
                    required
                    value={branchForm.name}
                    onChange={(e) =>
                      setBranchForm({ ...branchForm, name: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      backgroundColor: "var(--input-bg)",
                      border: "1px solid var(--border)",
                      color: "white",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      marginBottom: "8px",
                    }}
                  >
                    Branch Type
                  </label>
                  <select
                    value={branchForm.type}
                    onChange={(e) =>
                      setBranchForm({ ...branchForm, type: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      backgroundColor: "var(--input-bg)",
                      border: "1px solid var(--border)",
                      color: "white",
                    }}
                  >
                    <option value="Main">Main Headquarters</option>
                    <option value="Branch">Regional Branch</option>
                    <option value="International">International Hub</option>
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      marginBottom: "8px",
                    }}
                  >
                    Branch Head
                  </label>
                  <select
                    value={branchForm.headId}
                    onChange={(e) =>
                      setBranchForm({ ...branchForm, headId: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      backgroundColor: "var(--input-bg)",
                      border: "1px solid var(--border)",
                      color: "white",
                    }}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                  style={{
                    padding: "14px",
                    borderRadius: "10px",
                    marginTop: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  {submitting ? (
                    <Loader size={18} className="spinner" />
                  ) : (
                    "Initialize Branch"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {showDeptModal && (
          <div
            className="modal-overlay"
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "20px",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card"
              style={{ width: "100%", maxWidth: "450px", padding: "32px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "24px",
                }}
              >
                <h2 style={{ fontSize: "18px", fontWeight: "800" }}>
                  New Functional Department
                </h2>
                <button onClick={() => setShowDeptModal(false)}>
                  <X size={20} style={{ color: "white" }} />
                </button>
              </div>
              <form
                onSubmit={handleCreateDept}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      marginBottom: "8px",
                    }}
                  >
                    Department Name
                  </label>
                  <input
                    required
                    value={deptForm.name}
                    onChange={(e) =>
                      setDeptForm({ ...deptForm, name: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      backgroundColor: "var(--input-bg)",
                      border: "1px solid var(--border)",
                      color: "white",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      marginBottom: "8px",
                    }}
                  >
                    Assign to Branch
                  </label>
                  <select
                    required
                    value={deptForm.branchId}
                    onChange={(e) =>
                      setDeptForm({ ...deptForm, branchId: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      backgroundColor: "var(--input-bg)",
                      border: "1px solid var(--border)",
                      color: "white",
                    }}
                  >
                    <option value="">Select Branch</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      marginBottom: "8px",
                    }}
                  >
                    Department Head
                  </label>
                  <select
                    value={deptForm.headId}
                    onChange={(e) =>
                      setDeptForm({ ...deptForm, headId: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      backgroundColor: "var(--input-bg)",
                      border: "1px solid var(--border)",
                      color: "white",
                    }}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                  style={{
                    padding: "14px",
                    borderRadius: "10px",
                    marginTop: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  {submitting ? (
                    <Loader size={18} className="spinner" />
                  ) : (
                    "Create Department"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EntityManagement;
