import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCog,
  Plus,
  X,
  Loader,
  Mail,
  Lock,
  User,
  Briefcase,
  Building2,
  Hash,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  Shield,
  ShieldCheck,
  UserRound,
  Eye,
  EyeOff,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import apiClient from "../api/apiClient";

// ── Role definitions ────────────────────────────────────────────────────────
const ROLES = [
  {
    id: "SUPER_ADMIN",
    label: "Super Admin",
    description: "Full system access",
    icon: ShieldCheck,
    color: "#ef4444",
  },
  {
    id: "MANAGER",
    label: "Manager",
    description: "Leads, recruitment & team",
    icon: Briefcase,
    color: "#3b82f6",
  },
  {
    id: "HR",
    label: "HR",
    description: "HR, employees & leave",
    icon: User,
    color: "#10b981",
  },
  {
    id: "EMPLOYEE",
    label: "Employee",
    description: "Core employee features",
    icon: UserRound,
    color: "var(--primary)",
  },
];

const ROLE_MAP = Object.fromEntries(ROLES.map((r) => [r.id, r]));
const ASSIGNABLE_ROLES = ROLES.filter((role) => role.id !== "SUPER_ADMIN");

// ── Utility: generate random password ─────────────────────────────────────
function generatePassword(len = 12) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
  return Array.from({ length: len }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length)),
  ).join("");
}

// ── Role badge ─────────────────────────────────────────────────────────────
function RoleBadge({ role }) {
  const def = ROLE_MAP[role?.toUpperCase()];
  return (
    <span
      style={{
        fontSize: "11px",
        fontWeight: "700",
        padding: "3px 10px",
        borderRadius: "20px",
        backgroundColor: def ? `${def.color}20` : "var(--tag-bg)",
        color: def?.color ?? "var(--text-muted)",
        letterSpacing: "0.3px",
      }}
    >
      {def?.label ?? role}
    </span>
  );
}

// ── Credential card shown after user creation ──────────────────────────────
function CredentialCard({ credentials, onClose }) {
  const [copiedField, setCopiedField] = useState(null);

  const copy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{
        background:
          "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(99,102,241,0.08))",
        border: "1px solid rgba(16,185,129,0.3)",
        borderRadius: "16px",
        padding: "24px",
        marginTop: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "16px",
        }}
      >
        <CheckCircle2 size={22} color="#10b981" />
        <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#10b981" }}>
          Account Created Successfully
        </h4>
      </div>
      <p
        style={{
          fontSize: "13px",
          color: "var(--text-muted)",
          marginBottom: "16px",
        }}
      >
        Share these credentials with <strong>{credentials.fullName}</strong>.
        They will use them to sign in.
      </p>

      {[
        { label: "Email", value: credentials.email, field: "email" },
        { label: "Password", value: credentials.password, field: "password" },
        {
          label: "Employee Code",
          value: credentials.employeeCode,
          field: "code",
        },
      ].map((row) => (
        <div
          key={row.field}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 14px",
            backgroundColor: "var(--input-bg)",
            borderRadius: "10px",
            marginBottom: "8px",
            gap: "12px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "10px",
                color: "var(--text-muted)",
                fontWeight: "700",
                marginBottom: "2px",
              }}
            >
              {row.label.toUpperCase()}
            </div>
            <div
              style={{
                fontSize: "14px",
                fontFamily: "monospace",
                fontWeight: "600",
              }}
            >
              {row.value}
            </div>
          </div>
          <button
            onClick={() => copy(row.value, row.field)}
            style={{
              padding: "6px",
              borderRadius: "8px",
              backgroundColor: "var(--glass)",
              color:
                copiedField === row.field ? "#10b981" : "var(--text-muted)",
              transition: "all 0.2s",
            }}
          >
            {copiedField === row.field ? (
              <Check size={16} />
            ) : (
              <Copy size={16} />
            )}
          </button>
        </div>
      ))}

      <button
        onClick={onClose}
        className="btn-primary"
        style={{
          width: "100%",
          marginTop: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        <CheckCircle2 size={18} /> Done
      </button>
    </motion.div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
const UserManagement = () => {
  const { user } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
    department: "",
    jobTitle: "",
    employeeCode: "",
  });

  const normalizedRoles = (user?.roles || []).map((role) =>
    String(role).toUpperCase(),
  );
  const canCreatePrivilegedRoles =
    normalizedRoles.includes("SUPER_ADMIN") ||
    normalizedRoles.includes("ADMIN");
  const roleOptions = canCreatePrivilegedRoles
    ? ASSIGNABLE_ROLES
    : ASSIGNABLE_ROLES.filter((role) => role.id === "EMPLOYEE");

  useEffect(() => {
    if (!roleOptions.some((option) => option.id === formData.role)) {
      setFormData((prev) => ({ ...prev, role: "EMPLOYEE" }));
    }
  }, [formData.role, roleOptions]);

  // ── Fetch users ────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/auth/users");
      setUsers(res.data);
    } catch (e) {
      console.error("Failed to fetch users", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ── Handle form field changes ──────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const autoGenPassword = () => {
    const pwd = generatePassword();
    setFormData((prev) => ({ ...prev, password: pwd }));
    setShowPassword(true);
    toast.info("Password generated");
  };

  // ── Create user ────────────────────────────────────────────────────────────
  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const plainPassword = formData.password;
    try {
      const res = await apiClient.post("/auth/invite-user", formData);
      setCreatedCredentials({
        fullName: formData.fullName,
        email: formData.email,
        password: plainPassword,
        employeeCode: res.data.employeeCode,
      });
      setFormData({
        fullName: "",
        email: "",
        password: "",
        role: "EMPLOYEE",
        department: "",
        jobTitle: "",
        employeeCode: "",
      });
      fetchUsers();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Failed to create user. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Toggle user active/inactive ────────────────────────────────────────────
  const handleToggleStatus = async (userId) => {
    setActionLoading(userId);
    try {
      const res = await apiClient.patch(`/auth/users/${userId}/toggle-status`);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, isActive: res.data.isActive } : u,
        ),
      );
    } catch (e) {
      console.error("Toggle failed", e);
    } finally {
      setActionLoading(null);
    }
  };

  // ── Stats ──────────────────────────────────────────────────────────────────
  const activeCount = users.filter((u) => u.isActive).length;
  const inactiveCount = users.length - activeCount;
  const availableRoles = [
    "All",
    ...new Set((users || []).flatMap((u) => u.roles || [])),
  ];
  const filteredUsers = users.filter((listedUser) => {
    const statusMatch =
      statusFilter === "All" ||
      (statusFilter === "Active" ? listedUser.isActive : !listedUser.isActive);
    const roleMatch =
      roleFilter === "All" || (listedUser.roles || []).includes(roleFilter);
    return statusMatch && roleMatch;
  });
  const hasActiveFilters = statusFilter !== "All" || roleFilter !== "All";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* ── Page header ───────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "800",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                padding: "8px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, var(--primary), #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <UserCog size={22} color="white" />
            </div>
            User Management
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "14px",
              marginTop: "6px",
            }}
          >
            Provision employee accounts, assign roles and manage access.
          </p>
        </div>
        <button
          onClick={() => {
            setShowModal(true);
            setCreatedCredentials(null);
            setError(null);
          }}
          className="btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <Plus size={18} /> Add Employee
        </button>
      </div>

      {/* ── Stats row ─────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
        }}
      >
        {[
          {
            label: "Total Users",
            value: users.length,
            color: "var(--primary)",
          },
          { label: "Active", value: activeCount, color: "#10b981" },
          { label: "Inactive", value: inactiveCount, color: "#ef4444" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="glass-card"
            style={{ padding: "20px" }}
          >
            <div
              style={{
                fontSize: "28px",
                fontWeight: "800",
                color: stat.color,
              }}
            >
              {loading ? "—" : stat.value}
            </div>
            <div
              style={{
                fontSize: "13px",
                color: "var(--text-muted)",
                marginTop: "4px",
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── User table ────────────────────────────────────────────────────── */}
      <div
        className="glass-card"
        style={{ padding: "24px", overflowX: "auto" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          <h3
            style={{ fontSize: "16px", fontWeight: "700", marginBottom: "0" }}
          >
            All Users ({filteredUsers.length}/{users.length})
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              minWidth: "280px",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                alignItems: "flex-end",
              }}
            >
              <div
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <label
                  style={{
                    fontSize: "11px",
                    color: "var(--text-muted)",
                    fontWeight: "700",
                    letterSpacing: "0.4px",
                  }}
                >
                  FILTER BY STATUS
                </label>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: "8px",
                    backgroundColor: "var(--input-bg)",
                    border: "1px solid var(--border)",
                    color: "var(--text-main)",
                    fontSize: "12px",
                    fontWeight: "600",
                    minWidth: "160px",
                  }}
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active Only</option>
                  <option value="Inactive">Inactive Only</option>
                </select>
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <label
                  style={{
                    fontSize: "11px",
                    color: "var(--text-muted)",
                    fontWeight: "700",
                    letterSpacing: "0.4px",
                  }}
                >
                  FILTER BY ROLE
                </label>
                <select
                  value={roleFilter}
                  onChange={(event) => setRoleFilter(event.target.value)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: "8px",
                    backgroundColor: "var(--input-bg)",
                    border: "1px solid var(--border)",
                    color: "var(--text-main)",
                    fontSize: "12px",
                    fontWeight: "600",
                    minWidth: "160px",
                  }}
                >
                  {availableRoles.map((roleOption) => (
                    <option key={roleOption} value={roleOption}>
                      {roleOption === "All" ? "All Roles" : roleOption}
                    </option>
                  ))}
                </select>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    setStatusFilter("All");
                    setRoleFilter("All");
                  }}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    backgroundColor: "transparent",
                    color: "var(--text-muted)",
                    fontSize: "12px",
                    fontWeight: "700",
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              Showing:{" "}
              <strong>
                {statusFilter === "All" ? "All Statuses" : statusFilter}
              </strong>{" "}
              ·{" "}
              <strong>{roleFilter === "All" ? "All Roles" : roleFilter}</strong>
            </div>
          </div>
        </div>

        {loading ? (
          <div
            style={{
              height: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Loader size={32} className="spinner" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "var(--text-muted)",
            }}
          >
            <UserCog size={40} style={{ opacity: 0.3, marginBottom: "12px" }} />
            <p>No users found for selected filters.</p>
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: "0 8px",
            }}
          >
            <thead>
              <tr>
                {[
                  "Name",
                  "Email",
                  "Role",
                  "Department",
                  "Employee Code",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "0 16px 8px",
                      color: "var(--text-muted)",
                      fontSize: "11px",
                      fontWeight: "700",
                      textAlign: "left",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    backgroundColor: "var(--tag-bg)",
                    transition: "all 0.2s",
                    opacity: user.isActive ? 1 : 0.55,
                  }}
                >
                  <td
                    style={{
                      padding: "14px 16px",
                      borderRadius: "12px 0 0 12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "34px",
                          height: "34px",
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, var(--primary), #8b5cf6)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "13px",
                          fontWeight: "700",
                          color: "var(--text-main)",
                          flexShrink: 0,
                        }}
                      >
                        {user.fullName?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <span style={{ fontWeight: "600", fontSize: "14px" }}>
                        {user.fullName}
                      </span>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      fontSize: "13px",
                      color: "var(--text-muted)",
                    }}
                  >
                    {user.email}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                      }}
                    >
                      {user.roles?.map((r) => (
                        <RoleBadge key={r} role={r} />
                      ))}
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      fontSize: "13px",
                      color: "var(--text-muted)",
                    }}
                  >
                    {user.department || "—"}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      fontSize: "13px",
                      fontFamily: "monospace",
                    }}
                  >
                    {user.employeeCode || "—"}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        backgroundColor: user.isActive
                          ? "rgba(16,185,129,0.1)"
                          : "rgba(239,68,68,0.1)",
                        color: user.isActive ? "#10b981" : "#ef4444",
                      }}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      borderRadius: "0 12px 12px 0",
                      textAlign: "right",
                    }}
                  >
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      disabled={actionLoading === user.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "12px",
                        fontWeight: "600",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        border: `1px solid ${user.isActive ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"}`,
                        color: user.isActive ? "#ef4444" : "#10b981",
                        backgroundColor: "transparent",
                        cursor:
                          actionLoading === user.id ? "not-allowed" : "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {actionLoading === user.id ? (
                        <Loader size={14} className="spinner" />
                      ) : user.isActive ? (
                        <XCircle size={14} />
                      ) : (
                        <CheckCircle2 size={14} />
                      )}
                      {user.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Create User Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "20px",
            }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="glass-card"
              style={{
                width: "100%",
                maxWidth: "580px",
                maxHeight: "90vh",
                overflowY: "auto",
                padding: "32px",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "28px",
                }}
              >
                <div>
                  <h2 style={{ fontSize: "20px", fontWeight: "800" }}>
                    Create Employee Account
                  </h2>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--text-muted)",
                      marginTop: "4px",
                    }}
                  >
                    The employee will use these credentials to sign in.
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  style={{ color: "var(--text-muted)", padding: "4px" }}
                >
                  <X size={22} />
                </button>
              </div>

              {/* Credential card on success */}
              <AnimatePresence>
                {createdCredentials && (
                  <CredentialCard
                    credentials={createdCredentials}
                    onClose={() => {
                      setCreatedCredentials(null);
                      setShowModal(false);
                    }}
                  />
                )}
              </AnimatePresence>

              {!createdCredentials && (
                <form
                  onSubmit={handleCreate}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  {/* Error */}
                  {error && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "12px 16px",
                        borderRadius: "10px",
                        backgroundColor: "rgba(239,68,68,0.08)",
                        border: "1px solid rgba(239,68,68,0.25)",
                        color: "#ef4444",
                        fontSize: "13px",
                      }}
                    >
                      <AlertTriangle size={16} />
                      {error}
                    </div>
                  )}

                  {/* Full Name */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        color: "var(--text-muted)",
                        marginBottom: "8px",
                        fontWeight: "600",
                      }}
                    >
                      Full Name *
                    </label>
                    <div style={{ position: "relative" }}>
                      <User
                        size={16}
                        style={{
                          position: "absolute",
                          left: "14px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "var(--text-muted)",
                        }}
                      />
                      <input
                        required
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Jane Doe"
                        style={{
                          width: "100%",
                          padding: "12px 12px 12px 40px",
                          borderRadius: "10px",
                          backgroundColor: "var(--input-bg)",
                          border: "1px solid var(--border)",
                          color: "var(--text-main)",
                          fontSize: "14px",
                        }}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        color: "var(--text-muted)",
                        marginBottom: "8px",
                        fontWeight: "600",
                      }}
                    >
                      Email Address *
                    </label>
                    <div style={{ position: "relative" }}>
                      <Mail
                        size={16}
                        style={{
                          position: "absolute",
                          left: "14px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "var(--text-muted)",
                        }}
                      />
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="jane.doe@company.com"
                        style={{
                          width: "100%",
                          padding: "12px 12px 12px 40px",
                          borderRadius: "10px",
                          backgroundColor: "var(--input-bg)",
                          border: "1px solid var(--border)",
                          color: "var(--text-main)",
                          fontSize: "14px",
                        }}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        color: "var(--text-muted)",
                        marginBottom: "8px",
                        fontWeight: "600",
                      }}
                    >
                      Password *
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <div style={{ position: "relative", flex: 1 }}>
                        <Lock
                          size={16}
                          style={{
                            position: "absolute",
                            left: "14px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "var(--text-muted)",
                          }}
                        />
                        <input
                          required
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          minLength={6}
                          placeholder="Min. 6 characters"
                          style={{
                            width: "100%",
                            padding: "12px 40px 12px 40px",
                            borderRadius: "10px",
                            backgroundColor: "var(--input-bg)",
                            border: "1px solid var(--border)",
                            color: "var(--text-main)",
                            fontSize: "14px",
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((p) => !p)}
                          style={{
                            position: "absolute",
                            right: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "var(--text-muted)",
                          }}
                        >
                          {showPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={autoGenPassword}
                        title="Generate secure password"
                        style={{
                          padding: "0 14px",
                          borderRadius: "10px",
                          backgroundColor: "var(--glass)",
                          border: "1px solid var(--border)",
                          color: "var(--text-muted)",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "12px",
                          fontWeight: "600",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <RefreshCw size={14} /> Auto
                      </button>
                    </div>
                  </div>

                  {/* Role picker */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        color: "var(--text-muted)",
                        marginBottom: "10px",
                        fontWeight: "600",
                      }}
                    >
                      Role *
                    </label>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(150px, 1fr))",
                        gap: "8px",
                      }}
                    >
                      {roleOptions.map((role) => {
                        const RoleIcon = role.icon;
                        const isSelected = formData.role === role.id;
                        return (
                          <button
                            key={role.id}
                            type="button"
                            onClick={() =>
                              setFormData((p) => ({ ...p, role: role.id }))
                            }
                            style={{
                              padding: "12px",
                              borderRadius: "12px",
                              border: `2px solid ${
                                isSelected ? role.color : "var(--border)"
                              }`,
                              backgroundColor: isSelected
                                ? `${role.color}12`
                                : "var(--input-bg)",
                              textAlign: "left",
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginBottom: "4px",
                              }}
                            >
                              <RoleIcon
                                size={16}
                                color={
                                  isSelected ? role.color : "var(--text-muted)"
                                }
                              />
                              <span
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "700",
                                  color: isSelected
                                    ? role.color
                                    : "var(--text-main)",
                                }}
                              >
                                {role.label}
                              </span>
                            </div>
                            <p
                              style={{
                                fontSize: "11px",
                                color: "var(--text-muted)",
                                lineHeight: 1.4,
                              }}
                            >
                              {role.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Optional fields */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "12px",
                          color: "var(--text-muted)",
                          marginBottom: "8px",
                          fontWeight: "600",
                        }}
                      >
                        Job Title
                      </label>
                      <div style={{ position: "relative" }}>
                        <Briefcase
                          size={16}
                          style={{
                            position: "absolute",
                            left: "14px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "var(--text-muted)",
                          }}
                        />
                        <input
                          name="jobTitle"
                          value={formData.jobTitle}
                          onChange={handleChange}
                          placeholder="HR Manager"
                          style={{
                            width: "100%",
                            padding: "12px 12px 12px 40px",
                            borderRadius: "10px",
                            backgroundColor: "var(--input-bg)",
                            border: "1px solid var(--border)",
                            color: "var(--text-main)",
                            fontSize: "14px",
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "12px",
                          color: "var(--text-muted)",
                          marginBottom: "8px",
                          fontWeight: "600",
                        }}
                      >
                        Department
                      </label>
                      <div style={{ position: "relative" }}>
                        <Building2
                          size={16}
                          style={{
                            position: "absolute",
                            left: "14px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "var(--text-muted)",
                          }}
                        />
                        <input
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                          placeholder="Human Resources"
                          style={{
                            width: "100%",
                            padding: "12px 12px 12px 40px",
                            borderRadius: "10px",
                            backgroundColor: "var(--input-bg)",
                            border: "1px solid var(--border)",
                            color: "var(--text-main)",
                            fontSize: "14px",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Employee Code */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        color: "var(--text-muted)",
                        marginBottom: "8px",
                        fontWeight: "600",
                      }}
                    >
                      Employee Code{" "}
                      <span style={{ fontWeight: "400" }}>
                        (auto-generated if empty)
                      </span>
                    </label>
                    <div style={{ position: "relative" }}>
                      <Hash
                        size={16}
                        style={{
                          position: "absolute",
                          left: "14px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "var(--text-muted)",
                        }}
                      />
                      <input
                        name="employeeCode"
                        value={formData.employeeCode}
                        onChange={handleChange}
                        placeholder="EMP-001"
                        style={{
                          width: "100%",
                          padding: "12px 12px 12px 40px",
                          borderRadius: "10px",
                          backgroundColor: "var(--input-bg)",
                          border: "1px solid var(--border)",
                          color: "var(--text-main)",
                          fontSize: "14px",
                        }}
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={submitting}
                    style={{
                      marginTop: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      padding: "14px",
                      fontSize: "15px",
                      fontWeight: "700",
                    }}
                  >
                    {submitting ? (
                      <>
                        <Loader size={20} className="spinner" /> Creating
                        Account…
                      </>
                    ) : (
                      <>
                        <Plus size={20} /> Create Employee Account
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;
