import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  ChevronDown,
  Loader,
  Pencil,
  PlusCircle,
  Shield,
  Trash2,
  X,
} from "lucide-react";
import apiClient from "../api/apiClient";
import { fetchUserProfile } from "../store/auth/authSlice";

const getErrorMessage = (error) => {
  if (!error) return "Something went wrong";
  if (typeof error === "string") return error;
  if (Array.isArray(error?.message)) return error.message.join(", ");
  if (typeof error?.message === "string") return error.message;
  return "Something went wrong";
};

const RolesAccess = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, accessToken, loading: authLoading } = useSelector(
    (state) => state.auth,
  );

  const [rbacUsers, setRbacUsers] = useState([]);
  const [rbacRoles, setRbacRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});
  const [openRolePickerUserId, setOpenRolePickerUserId] = useState(null);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [createRoleLoading, setCreateRoleLoading] = useState(false);
  const [deleteRoleLoadingById, setDeleteRoleLoadingById] = useState({});
  const [updateRoleLoadingById, setUpdateRoleLoadingById] = useState({});
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [editingRoleName, setEditingRoleName] = useState("");
  const [editingRoleDescription, setEditingRoleDescription] = useState("");
  const [rbacLoading, setRbacLoading] = useState(false);
  const [assignLoadingByUser, setAssignLoadingByUser] = useState({});
  const [rbacError, setRbacError] = useState(null);
  const [rbacSuccess, setRbacSuccess] = useState(null);
  const [isProfileBootstrapping, setIsProfileBootstrapping] = useState(false);

  const canManageRbac = !!user?.access?.canManageRbac;

  useEffect(() => {
    if (!isAuthenticated || !accessToken || user) {
      return;
    }

    setIsProfileBootstrapping(true);
    dispatch(fetchUserProfile())
      .finally(() => {
        setIsProfileBootstrapping(false);
      });
  }, [dispatch, isAuthenticated, accessToken, user]);

  const userAccessLabel = useMemo(() => {
    return (rbacUser) => {
      if (!rbacUser?.access) return "No access";
      const labels = [];
      if (rbacUser.access.canManageRbac) labels.push("Manage RBAC");
      if (rbacUser.access.canManageUsers) labels.push("Manage Users");
      if (rbacUser.access.canViewDashboard) labels.push("Dashboard");
      return labels.length ? labels.join(" · ") : "Standard";
    };
  }, []);

  const selectedRoleLabel = useMemo(() => {
    return (userId) => {
      const roleName = selectedRoles[userId];
      if (!roleName) return "Select role";
      const found = rbacRoles.find((role) => role.name === roleName);
      return found?.name || roleName;
    };
  }, [selectedRoles, rbacRoles]);

  const loadRbacData = async () => {
    if (!canManageRbac) return;
    setRbacLoading(true);
    setRbacError(null);

    try {
      const [rolesResponse, usersResponse] = await Promise.all([
        apiClient.get("/rbac/roles"),
        apiClient.get("/rbac/users"),
      ]);

      const rolesData = rolesResponse?.data || [];
      const usersData = usersResponse?.data || [];

      setRbacRoles(rolesData);
      setRbacUsers(usersData);
      setSelectedRoles((prev) => {
        const next = { ...prev };
        usersData.forEach((rbacUser) => {
          if (!next[rbacUser.id] && rbacUser.roles?.length) {
            next[rbacUser.id] = rbacUser.roles[0];
          }
        });
        return next;
      });
    } catch (rbacFetchError) {
      setRbacError(getErrorMessage(rbacFetchError));
    } finally {
      setRbacLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && accessToken && canManageRbac) {
      loadRbacData();
    }
  }, [isAuthenticated, accessToken, canManageRbac]);

  useEffect(() => {
    if (!openRolePickerUserId) {
      return;
    }

    const handleClickOutside = (event) => {
      const target = event.target;
      if (target instanceof Element) {
        const insideRolePicker = target.closest('[data-role-picker="true"]');
        if (insideRolePicker) {
          return;
        }
      }

      setOpenRolePickerUserId(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openRolePickerUserId]);

  const handleAssignRole = async (targetUserId) => {
    const roleName = selectedRoles[targetUserId];
    if (!roleName) {
      setRbacError("Please select a role before assigning.");
      return;
    }

    setAssignLoadingByUser((prev) => ({ ...prev, [targetUserId]: true }));
    setRbacError(null);
    setRbacSuccess(null);

    try {
      await apiClient.post("/rbac/roles/assign", {
        userId: targetUserId,
        roleName,
      });

      setRbacSuccess(`Assigned ${roleName} successfully.`);
      await loadRbacData();

      if (targetUserId === user?.id) {
        dispatch(fetchUserProfile());
      }
    } catch (assignError) {
      setRbacError(getErrorMessage(assignError));
    } finally {
      setAssignLoadingByUser((prev) => ({ ...prev, [targetUserId]: false }));
      setOpenRolePickerUserId(null);
    }
  };

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) {
      setRbacError("Role name is required.");
      return;
    }

    setCreateRoleLoading(true);
    setRbacError(null);
    setRbacSuccess(null);

    try {
      await apiClient.post("/rbac/roles", {
        name: newRoleName.trim(),
        description: newRoleDescription.trim() || undefined,
      });

      setRbacSuccess(`Role ${newRoleName.trim().toUpperCase()} created successfully.`);
      setNewRoleName("");
      setNewRoleDescription("");
      await loadRbacData();
    } catch (createRoleError) {
      setRbacError(getErrorMessage(createRoleError));
    } finally {
      setCreateRoleLoading(false);
    }
  };

  const startEditRole = (role) => {
    setEditingRoleId(role.id);
    setEditingRoleName(role.name || "");
    setEditingRoleDescription(role.description || "");
    setRbacError(null);
    setRbacSuccess(null);
  };

  const cancelEditRole = () => {
    setEditingRoleId(null);
    setEditingRoleName("");
    setEditingRoleDescription("");
  };

  const handleUpdateRole = async (roleId) => {
    if (!editingRoleName.trim()) {
      setRbacError("Role name is required.");
      return;
    }

    setUpdateRoleLoadingById((prev) => ({ ...prev, [roleId]: true }));
    setRbacError(null);
    setRbacSuccess(null);

    try {
      await apiClient.patch(`/rbac/roles/${roleId}`, {
        name: editingRoleName.trim(),
        description: editingRoleDescription.trim(),
      });

      setRbacSuccess(`Role ${editingRoleName.trim().toUpperCase()} updated successfully.`);
      cancelEditRole();
      await loadRbacData();
    } catch (updateRoleError) {
      setRbacError(getErrorMessage(updateRoleError));
    } finally {
      setUpdateRoleLoadingById((prev) => ({ ...prev, [roleId]: false }));
    }
  };

  const handleDeleteRole = async (role) => {
    if (role.isSystem || role.assignedUsersCount > 0) {
      setRbacError("Only custom unassigned roles can be deleted.");
      return;
    }

    setDeleteRoleLoadingById((prev) => ({ ...prev, [role.id]: true }));
    setRbacError(null);
    setRbacSuccess(null);

    try {
      await apiClient.delete(`/rbac/roles/${role.id}`);
      setRbacSuccess(`Role ${role.name} deleted successfully.`);
      if (editingRoleId === role.id) {
        cancelEditRole();
      }
      await loadRbacData();
    } catch (deleteRoleError) {
      setRbacError(getErrorMessage(deleteRoleError));
    } finally {
      setDeleteRoleLoadingById((prev) => ({ ...prev, [role.id]: false }));
    }
  };

  if (!isAuthenticated || !accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (isProfileBootstrapping || (!user && authLoading)) {
    return (
      <div
        style={{
          minHeight: "220px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          color: "var(--text-muted)",
        }}
      >
        <Loader size={18} className="spinner" />
        <span>Loading access profile...</span>
      </div>
    );
  }

  if (user && !canManageRbac) {
    return <Navigate to="/settings" replace />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ maxWidth: "980px", margin: "0 auto", width: "100%" }}
    >
      <header style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "8px" }}>
          Roles & Access
        </h1>
        <p style={{ color: "var(--text-muted)" }}>
          Manage user roles and verify effective access permissions.
        </p>
      </header>

      <div className="glass-card" style={{ padding: "24px" }}>
        <div
          style={{
            borderBottom: "1px solid var(--border)",
            marginBottom: "16px",
            paddingBottom: "16px",
          }}
        >
          <h2 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "10px" }}>
            Create New Role
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr auto",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              placeholder="Role name (e.g. SALES_MANAGER)"
              value={newRoleName}
              onChange={(event) => setNewRoleName(event.target.value)}
              style={{
                backgroundColor: "var(--input-bg)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--text-main)",
                padding: "10px 12px",
                fontSize: "14px",
                minWidth: 0,
              }}
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newRoleDescription}
              onChange={(event) => setNewRoleDescription(event.target.value)}
              style={{
                backgroundColor: "var(--input-bg)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--text-main)",
                padding: "10px 12px",
                fontSize: "14px",
                minWidth: 0,
              }}
            />
            <button
              type="button"
              onClick={handleCreateRole}
              disabled={createRoleLoading}
              style={{
                backgroundColor: "var(--primary)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "10px 14px",
                fontSize: "13px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: createRoleLoading ? "not-allowed" : "pointer",
                opacity: createRoleLoading ? 0.7 : 1,
              }}
            >
              <PlusCircle size={14} />
              {createRoleLoading ? "Creating..." : "Create Role"}
            </button>
          </div>
        </div>

        <div
          style={{
            borderBottom: "1px solid var(--border)",
            marginBottom: "16px",
            paddingBottom: "16px",
          }}
        >
          <h2 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "10px" }}>
            Existing Roles
          </h2>
          <div style={{ display: "grid", gap: "8px" }}>
            {rbacRoles.map((role) => {
              const isEditing = editingRoleId === role.id;
              const isDeleteDisabled = role.isSystem || role.assignedUsersCount > 0;

              return (
                <div
                  key={role.id}
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    padding: "10px",
                    display: "grid",
                    gap: "8px",
                  }}
                >
                  {!isEditing ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "10px",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "14px" }}>{role.name}</div>
                        <div style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                          {role.description || "No description"}
                        </div>
                        <div style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                          {role.assignedUsersCount} assigned · {role.isSystem ? "System role" : "Custom role"}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          type="button"
                          onClick={() => startEditRole(role)}
                          disabled={role.isSystem}
                          style={{
                            backgroundColor: "var(--input-bg)",
                            border: "1px solid var(--border)",
                            color: "var(--text-main)",
                            borderRadius: "8px",
                            padding: "8px 10px",
                            fontSize: "12px",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            cursor: role.isSystem ? "not-allowed" : "pointer",
                            opacity: role.isSystem ? 0.6 : 1,
                          }}
                        >
                          <Pencil size={12} />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRole(role)}
                          disabled={isDeleteDisabled || !!deleteRoleLoadingById[role.id]}
                          style={{
                            backgroundColor: "rgba(239, 68, 68, 0.12)",
                            border: "1px solid rgba(239, 68, 68, 0.4)",
                            color: "#fca5a5",
                            borderRadius: "8px",
                            padding: "8px 10px",
                            fontSize: "12px",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            cursor: isDeleteDisabled ? "not-allowed" : "pointer",
                            opacity: isDeleteDisabled ? 0.6 : 1,
                          }}
                        >
                          <Trash2 size={12} />
                          {deleteRoleLoadingById[role.id] ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "grid", gap: "8px" }}>
                      <input
                        type="text"
                        value={editingRoleName}
                        onChange={(event) => setEditingRoleName(event.target.value)}
                        style={{
                          backgroundColor: "var(--input-bg)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          color: "var(--text-main)",
                          padding: "8px 10px",
                          fontSize: "13px",
                        }}
                      />
                      <input
                        type="text"
                        value={editingRoleDescription}
                        onChange={(event) =>
                          setEditingRoleDescription(event.target.value)
                        }
                        style={{
                          backgroundColor: "var(--input-bg)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          color: "var(--text-main)",
                          padding: "8px 10px",
                          fontSize: "13px",
                        }}
                      />
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          type="button"
                          onClick={() => handleUpdateRole(role.id)}
                          disabled={!!updateRoleLoadingById[role.id]}
                          style={{
                            backgroundColor: "var(--primary)",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            padding: "8px 12px",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: updateRoleLoadingById[role.id]
                              ? "not-allowed"
                              : "pointer",
                            opacity: updateRoleLoadingById[role.id] ? 0.7 : 1,
                          }}
                        >
                          {updateRoleLoadingById[role.id] ? "Saving..." : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditRole}
                          style={{
                            backgroundColor: "var(--input-bg)",
                            border: "1px solid var(--border)",
                            color: "var(--text-main)",
                            borderRadius: "8px",
                            padding: "8px 12px",
                            fontSize: "12px",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <X size={12} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {!rbacRoles.length && (
              <div style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                No roles available.
              </div>
            )}
          </div>
        </div>

        {rbacError ? (
          <div
            style={{
              padding: "10px 12px",
              marginBottom: "14px",
              borderRadius: "8px",
              border: "1px solid rgba(239,68,68,0.4)",
              backgroundColor: "rgba(239,68,68,0.12)",
              color: "#fca5a5",
              fontSize: "13px",
            }}
          >
            {String(rbacError)}
          </div>
        ) : null}

        {rbacSuccess ? (
          <div
            style={{
              padding: "10px 12px",
              marginBottom: "14px",
              borderRadius: "8px",
              border: "1px solid rgba(34,197,94,0.4)",
              backgroundColor: "rgba(34,197,94,0.12)",
              color: "#86efac",
              fontSize: "13px",
            }}
          >
            {rbacSuccess}
          </div>
        ) : null}

        {rbacLoading ? (
          <div
            style={{
              minHeight: "180px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              color: "var(--text-muted)",
            }}
          >
            <Loader size={18} className="spinner" />
            <span>Loading roles and users...</span>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {rbacUsers.map((rbacUser) => (
              <div
                key={rbacUser.id}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  padding: "14px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{rbacUser.fullName}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                      {rbacUser.email}
                    </div>
                    <div style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "3px" }}>
                      Roles: {rbacUser.roles?.length ? rbacUser.roles.join(", ") : "No roles"}
                    </div>
                    <div style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                      Access: {userAccessLabel(rbacUser)}
                    </div>
                  </div>

                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <div style={{ position: "relative" }} data-role-picker="true">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenRolePickerUserId((prev) =>
                            prev === rbacUser.id ? null : rbacUser.id,
                          )
                        }
                        style={{
                          backgroundColor: "var(--input-bg)",
                          border: "1px solid var(--border)",
                          color: "var(--text-main)",
                          borderRadius: "8px",
                          padding: "0 10px",
                          minWidth: "220px",
                          height: "40px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "10px",
                          cursor: "pointer",
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <Shield size={14} color="var(--text-muted)" />
                          <span>{selectedRoleLabel(rbacUser.id)}</span>
                        </span>
                        <ChevronDown size={16} color="var(--text-muted)" />
                      </button>

                      {openRolePickerUserId === rbacUser.id && (
                        <div
                          style={{
                            position: "absolute",
                            top: "44px",
                            left: 0,
                            width: "100%",
                            backgroundColor: "var(--bg-card)",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                            zIndex: 40,
                            overflow: "hidden",
                            boxShadow: "var(--shadow)",
                            maxHeight: "220px",
                            overflowY: "auto",
                          }}
                        >
                          {rbacRoles.map((role) => {
                            const isSelected = selectedRoles[rbacUser.id] === role.name;
                            return (
                              <button
                                key={role.id}
                                type="button"
                                onClick={() => {
                                  setSelectedRoles((prev) => ({
                                    ...prev,
                                    [rbacUser.id]: role.name,
                                  }));
                                  setOpenRolePickerUserId(null);
                                }}
                                style={{
                                  width: "100%",
                                  textAlign: "left",
                                  border: "none",
                                  background: isSelected
                                    ? "var(--primary)"
                                    : "var(--bg-card)",
                                  color: isSelected ? "white" : "var(--text-main)",
                                  padding: "10px 12px",
                                  fontSize: "13px",
                                  cursor: "pointer",
                                }}
                              >
                                {role.name}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAssignRole(rbacUser.id)}
                      disabled={!!assignLoadingByUser[rbacUser.id]}
                      style={{
                        backgroundColor: "var(--primary)",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px 14px",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: assignLoadingByUser[rbacUser.id] ? "not-allowed" : "pointer",
                        opacity: assignLoadingByUser[rbacUser.id] ? 0.7 : 1,
                        height: "40px",
                      }}
                    >
                      {assignLoadingByUser[rbacUser.id] ? "Assigning..." : "Assign Role"}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {!rbacUsers.length && (
              <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                No users found.
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RolesAccess;
