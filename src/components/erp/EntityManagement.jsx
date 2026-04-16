import React, { useState, useEffect } from "react";
import {
  Network,
  UserSquare2,
  Building2,
  Plus,
  Loader,
  X,
  Users,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "../../api/apiClient";

const getErrorMessage = (error, fallback) => {
  const payload = error?.response?.data;
  if (Array.isArray(payload?.message)) return payload.message.join(", ");
  if (typeof payload?.message === "string") return payload.message;
  if (typeof payload?.error === "string") return payload.error;
  return fallback;
};

const EntityManagement = () => {
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [formError, setFormError] = useState("");
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState(null);
  const [editingDeptId, setEditingDeptId] = useState(null);
  const [assignmentModal, setAssignmentModal] = useState(null);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
  const [assignmentSaving, setAssignmentSaving] = useState(false);

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

  const fetchData = async ({ withLoader = true } = {}) => {
    if (withLoader) {
      setLoading(true);
    }

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
      if (withLoader) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openBranchModal = (branch = null) => {
    setFormError("");
    if (branch) {
      setEditingBranchId(branch.id);
      setBranchForm({
        name: branch.name || "",
        type: branch.type || "Branch",
        headId: branch.headId || branch.head?.id || "",
      });
    } else {
      setEditingBranchId(null);
      setBranchForm({ name: "", type: "Branch", headId: "" });
    }
    setShowBranchModal(true);
  };

  const openDeptModal = (dept = null) => {
    setFormError("");
    if (dept) {
      setEditingDeptId(dept.id);
      setDeptForm({
        name: dept.name || "",
        branchId: dept.branchId || "",
        headId: dept.headId || dept.head?.id || "",
      });
    } else {
      setEditingDeptId(null);
      setDeptForm({ name: "", branchId: "", headId: "" });
    }
    setShowDeptModal(true);
  };

  const handleCreateBranch = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      const payload = {
        ...branchForm,
        headId: branchForm.headId || undefined,
      };

      if (editingBranchId) {
        await apiClient.patch(`/entities/branches/${editingBranchId}`, payload);
      } else {
        await apiClient.post("/entities/branches", payload);
      }

      setShowBranchModal(false);
      setEditingBranchId(null);
      setBranchForm({ name: "", type: "Branch", headId: "" });
      await fetchData({ withLoader: false });
    } catch (err) {
      setFormError(
        getErrorMessage(
          err,
          editingBranchId
            ? "Failed to update branch"
            : "Failed to create branch",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateDept = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      const payload = {
        ...deptForm,
        headId: deptForm.headId || undefined,
      };

      if (editingDeptId) {
        await apiClient.patch(
          `/entities/departments/${editingDeptId}`,
          payload,
        );
      } else {
        await apiClient.post("/entities/departments", payload);
      }

      setShowDeptModal(false);
      setEditingDeptId(null);
      setDeptForm({ name: "", branchId: "", headId: "" });
      await fetchData({ withLoader: false });
    } catch (err) {
      setFormError(
        getErrorMessage(
          err,
          editingDeptId
            ? "Failed to update department"
            : "Failed to create department",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBranch = async (id) => {
    setActionLoading(`branch:${id}`);
    try {
      await apiClient.delete(`/entities/branches/${id}`);
      await fetchData({ withLoader: false });
    } catch (err) {
      setFormError(getErrorMessage(err, "Failed to delete branch"));
    } finally {
      setActionLoading(null);
      setConfirmDelete(null);
    }
  };

  const handleDeleteDept = async (id) => {
    setActionLoading(`department:${id}`);
    try {
      await apiClient.delete(`/entities/departments/${id}`);
      await fetchData({ withLoader: false });
    } catch (err) {
      setFormError(getErrorMessage(err, "Failed to delete department"));
    } finally {
      setActionLoading(null);
      setConfirmDelete(null);
    }
  };

  const openAssignmentModal = (type, entity) => {
    const preSelected = employees
      .filter((employee) =>
        type === "branch"
          ? employee.branchId === entity.id
          : employee.departmentId === entity.id,
      )
      .map((employee) => employee.id);

    setSelectedEmployeeIds(preSelected);
    setFormError("");
    setAssignmentModal({
      type,
      id: entity.id,
      name: entity.name,
      branchId: type === "department" ? entity.branchId : null,
    });
  };

  const toggleEmployeeSelection = (employeeId) => {
    setSelectedEmployeeIds((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId],
    );
  };

  const saveAssignments = async () => {
    if (!assignmentModal) return;

    const isBranch = assignmentModal.type === "branch";
    const selectedSet = new Set(selectedEmployeeIds);
    const currentlyLinked = employees.filter((employee) =>
      isBranch
        ? employee.branchId === assignmentModal.id
        : employee.departmentId === assignmentModal.id,
    );

    const currentlyLinkedIds = new Set(
      currentlyLinked.map((employee) => employee.id),
    );
    const toAssign = employees.filter(
      (employee) =>
        selectedSet.has(employee.id) && !currentlyLinkedIds.has(employee.id),
    );
    const toUnassign = currentlyLinked.filter(
      (employee) => !selectedSet.has(employee.id),
    );

    setAssignmentSaving(true);
    setFormError("");
    try {
      await Promise.all([
        ...toAssign.map((employee) => {
          if (isBranch) {
            return apiClient.patch(`/employees/${employee.id}`, {
              branchId: assignmentModal.id,
            });
          }

          return apiClient.patch(`/employees/${employee.id}`, {
            branchId: assignmentModal.branchId,
            departmentId: assignmentModal.id,
            department: assignmentModal.name,
          });
        }),
        ...toUnassign.map((employee) =>
          apiClient.patch(`/employees/${employee.id}`, {
            ...(isBranch
              ? { branchId: null, departmentId: null }
              : { departmentId: null }),
          }),
        ),
      ]);

      setAssignmentModal(null);
      setSelectedEmployeeIds([]);
      await fetchData({ withLoader: false });
    } catch (err) {
      setFormError(getErrorMessage(err, "Failed to update assignments"));
    } finally {
      setAssignmentSaving(false);
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
            onClick={() => openBranchModal()}
            className="btn-primary"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <Plus size={18} /> Add Branch
          </button>
          <button
            onClick={() => openDeptModal()}
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
                      onClick={() => openBranchModal(branch)}
                      disabled={Boolean(actionLoading)}
                      title="Edit Branch"
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "11px",
                        fontWeight: "700",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        padding: "4px 8px",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openAssignmentModal("branch", branch)}
                      disabled={Boolean(actionLoading)}
                      title="Manage Branch Staff"
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "11px",
                        fontWeight: "700",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        padding: "4px 8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Users size={12} /> Staff
                    </button>
                    <button
                      onClick={() =>
                        setConfirmDelete({
                          type: "branch",
                          id: branch.id,
                          title: "Delete branch?",
                          message:
                            "Deleting a branch may affect linked departments and employees.",
                        })
                      }
                      disabled={Boolean(actionLoading)}
                      title="Delete Branch"
                      style={{ color: "var(--text-muted)", opacity: 0.6 }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#ef4444")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--text-muted)")
                      }
                    >
                      {actionLoading === `branch:${branch.id}` ? (
                        <Loader size={14} className="spinner" />
                      ) : (
                        <Trash2 size={16} />
                      )}
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
                      onClick={() => openDeptModal(dept)}
                      disabled={Boolean(actionLoading)}
                      title="Edit Department"
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "11px",
                        fontWeight: "700",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        padding: "4px 8px",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openAssignmentModal("department", dept)}
                      disabled={Boolean(actionLoading)}
                      title="Manage Department Members"
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "11px",
                        fontWeight: "700",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        padding: "4px 8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Users size={12} /> Members
                    </button>
                    <button
                      onClick={() =>
                        setConfirmDelete({
                          type: "department",
                          id: dept.id,
                          title: "Delete department?",
                          message:
                            "Deleting a department will unassign related members.",
                        })
                      }
                      disabled={Boolean(actionLoading)}
                      title="Delete Department"
                      style={{ color: "var(--text-muted)", opacity: 0.6 }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#ef4444")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--text-muted)")
                      }
                    >
                      {actionLoading === `department:${dept.id}` ? (
                        <Loader size={14} className="spinner" />
                      ) : (
                        <Trash2 size={16} />
                      )}
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
                  {editingBranchId
                    ? "Edit Corporate Branch"
                    : "New Corporate Branch"}
                </h2>
                <button
                  onClick={() => {
                    setShowBranchModal(false);
                    setEditingBranchId(null);
                    setFormError("");
                  }}
                >
                  <X size={20} style={{ color: "var(--text-main)" }} />
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
                {formError && (
                  <div
                    style={{
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid rgba(239, 68, 68, 0.5)",
                      color: "#fda4af",
                      backgroundColor: "rgba(239, 68, 68, 0.1)",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {formError}
                  </div>
                )}
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
                      color: "var(--text-main)",
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
                      color: "var(--text-main)",
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
                      color: "var(--text-main)",
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
                  ) : editingBranchId ? (
                    "Save Branch Changes"
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
                  {editingDeptId
                    ? "Edit Functional Department"
                    : "New Functional Department"}
                </h2>
                <button
                  onClick={() => {
                    setShowDeptModal(false);
                    setEditingDeptId(null);
                    setFormError("");
                  }}
                >
                  <X size={20} style={{ color: "var(--text-main)" }} />
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
                {formError && (
                  <div
                    style={{
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid rgba(239, 68, 68, 0.5)",
                      color: "#fda4af",
                      backgroundColor: "rgba(239, 68, 68, 0.1)",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {formError}
                  </div>
                )}
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
                      color: "var(--text-main)",
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
                      color: "var(--text-main)",
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
                      color: "var(--text-main)",
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
                  ) : editingDeptId ? (
                    "Save Department Changes"
                  ) : (
                    "Create Department"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {assignmentModal && (
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
              style={{ width: "100%", maxWidth: "520px", padding: "28px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "18px",
                }}
              >
                <div>
                  <h2 style={{ fontSize: "18px", fontWeight: "800" }}>
                    Manage{" "}
                    {assignmentModal.type === "branch" ? "Staff" : "Members"}
                  </h2>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      marginTop: "4px",
                    }}
                  >
                    {assignmentModal.name}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setAssignmentModal(null);
                    setSelectedEmployeeIds([]);
                    setFormError("");
                  }}
                >
                  <X size={20} style={{ color: "var(--text-main)" }} />
                </button>
              </div>

              {formError && (
                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid rgba(239, 68, 68, 0.5)",
                    color: "#fda4af",
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    fontSize: "12px",
                    fontWeight: "600",
                    marginBottom: "12px",
                  }}
                >
                  {formError}
                </div>
              )}

              <div
                style={{
                  maxHeight: "320px",
                  overflowY: "auto",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                }}
              >
                {employees.length === 0 ? (
                  <div
                    style={{
                      padding: "18px",
                      textAlign: "center",
                      color: "var(--text-muted)",
                      fontSize: "12px",
                    }}
                  >
                    No employees found. Add employees first from HRMS.
                  </div>
                ) : (
                  employees.map((employee) => {
                    const checked = selectedEmployeeIds.includes(employee.id);
                    return (
                      <label
                        key={employee.id}
                        style={{
                          display: "flex",
                          gap: "10px",
                          alignItems: "center",
                          padding: "12px 14px",
                          borderBottom: "1px solid var(--border)",
                          cursor: "pointer",
                          backgroundColor: checked
                            ? "rgba(59, 130, 246, 0.1)"
                            : "transparent",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleEmployeeSelection(employee.id)}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "13px", fontWeight: "700" }}>
                            {employee.name}
                          </div>
                          <div
                            style={{
                              fontSize: "11px",
                              color: "var(--text-muted)",
                            }}
                          >
                            {employee.code} • {employee.role}
                          </div>
                        </div>
                      </label>
                    );
                  })
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "14px",
                }}
              >
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {selectedEmployeeIds.length} selected
                </span>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setAssignmentModal(null);
                      setSelectedEmployeeIds([]);
                      setFormError("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    disabled={assignmentSaving}
                    onClick={saveAssignments}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {assignmentSaving ? (
                      <>
                        <Loader size={14} className="spinner" /> Saving...
                      </>
                    ) : (
                      "Save Assignments"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {confirmDelete && (
          <div
            className="modal-overlay"
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1100,
              padding: "20px",
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card"
              style={{ width: "100%", maxWidth: "420px", padding: "24px" }}
            >
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "800",
                  marginBottom: "10px",
                }}
              >
                {confirmDelete.title}
              </h3>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "13px",
                  marginBottom: "18px",
                }}
              >
                {confirmDelete.message}
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  className="btn-secondary"
                  onClick={() => setConfirmDelete(null)}
                  disabled={Boolean(actionLoading)}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  onClick={() =>
                    confirmDelete.type === "branch"
                      ? handleDeleteBranch(confirmDelete.id)
                      : handleDeleteDept(confirmDelete.id)
                  }
                  disabled={Boolean(actionLoading)}
                >
                  {actionLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EntityManagement;
