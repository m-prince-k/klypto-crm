import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  CalendarDays,
  ReceiptText,
  RotateCcw,
  Plus,
  TrendingUp,
  Clock3,
  AlertTriangle,
  ArrowLeft,
  Loader,
  X,
  Check,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import apiClient from "../api/apiClient";

// ── Month names ────────────────────────────────────────────────────────────
const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];

// ── Status badge ────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const colors = {
    Approved:  { bg: "rgba(16,185,129,0.12)", text: "#10b981" },
    Rejected:  { bg: "rgba(239,68,68,0.12)",  text: "#ef4444" },
    Pending:   { bg: "rgba(245,158,11,0.12)", text: "#f59e0b" },
  };
  const c = colors[status] || colors.Pending;
  return (
    <span style={{
      fontSize: "11px", fontWeight: "700", padding: "3px 10px",
      borderRadius: "20px", backgroundColor: c.bg, color: c.text,
    }}>
      {status}
    </span>
  );
}

// ── Tab sub-nav wrapper ─────────────────────────────────────────────────────
const TabContent = ({ title, children, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="erp-tab-content"
  >
    <div style={{
      display: "flex", justifyContent: "space-between",
      alignItems: "center", marginBottom: "24px",
      gap: "16px", flexWrap: "wrap",
    }}>
      <h2 style={{ fontSize: "24px", fontWeight: "700" }}>{title}</h2>
      {action}
    </div>
    {children}
  </motion.div>
);

// ── Main component ──────────────────────────────────────────────────────────
const Leave = () => {
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const isSuperAdmin = user?.access?.isSuperAdmin;
  const canManage = user?.access?.canManageUsers || isSuperAdmin;

  const [activeTab, setActiveTab] = useState("overview");
  const tabNavRef = useRef(null);
  const dragStateRef = useRef({ isDragging: false, startX: 0, scrollLeft: 0 });

  // ── Data state ─────────────────────────────────────────────────────────
  const [stats, setStats]       = useState(null);
  const [requests, setRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [myEmployeeId, setMyEmployeeId] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // ── Apply Leave modal state ────────────────────────────────────────────
  const [showModal, setShowModal]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError]   = useState(null);
  const [formData, setFormData]     = useState({
    type: "Annual", startDate: "", endDate: "", reason: "", employeeId: "",
  });

  // ── Fetch data ─────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, reqRes, empRes, myEmpRes] = await Promise.all([
        apiClient.get("/leaves/stats"),
        apiClient.get("/leaves"),
        apiClient.get("/employees"),
        apiClient.get("/leaves/my-employee-id"),
      ]);
      setStats(statsRes.data);
      setRequests(reqRes.data);
      setEmployees(empRes.data);
      setMyEmployeeId(myEmpRes.data?.employeeId ?? null);
    } catch (e) {
      console.error("Leave fetch failed", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Tab scroll helpers ─────────────────────────────────────────────────
  useEffect(() => {
    tabNavRef.current
      ?.querySelector(`[data-tab="${activeTab}"]`)
      ?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeTab]);

  const handleTabDragStart = (e) => {
    dragStateRef.current = { isDragging: true, startX: e.clientX, scrollLeft: tabNavRef.current.scrollLeft };
    tabNavRef.current?.classList.add("is-dragging");
  };
  const handleTabDragMove = (e) => {
    if (!dragStateRef.current.isDragging) return;
    e.preventDefault();
    tabNavRef.current.scrollLeft = dragStateRef.current.scrollLeft - (e.clientX - dragStateRef.current.startX);
  };
  const handleTabDragEnd = () => {
    dragStateRef.current.isDragging = false;
    tabNavRef.current?.classList.remove("is-dragging");
  };

  // ── Approve / Reject ───────────────────────────────────────────────────
  const handleStatusChange = async (id, status) => {
    setActionLoading(id + status);
    try {
      const res = await apiClient.patch(`/leaves/${id}/status`, { status });
      setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: res.data.status } : r));
      if (stats) {
        setStats((s) => ({
          ...s,
          pending: status === "Pending" ? s.pending : Math.max(0, s.pending - 1),
          approvedThisMonth: status === "Approved" ? s.approvedThisMonth + 1 : s.approvedThisMonth,
        }));
      }
    } catch (e) { console.error("Status update failed", e); }
    finally { setActionLoading(null); }
  };

  // ── Submit leave request ───────────────────────────────────────────────
  const handleSubmitLeave = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    const payload = { ...formData };
    if (!canManage && myEmployeeId) payload.employeeId = myEmployeeId;
    try {
      const res = await apiClient.post("/leaves", payload);
      setRequests((prev) => [res.data, ...prev]);
      setStats((s) => s ? { ...s, total: s.total + 1, pending: s.pending + 1 } : s);
      setShowModal(false);
      setFormData({ type: "Annual", startDate: "", endDate: "", reason: "", employeeId: "" });
      setActiveTab("requests");
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to submit request. Try again.");
    } finally { setSubmitting(false); }
  };

  // ── Computed list helpers ──────────────────────────────────────────────
  const pendingRequests  = requests.filter((r) => r.status === "Pending");
  const approvedRequests = requests.filter((r) => r.status === "Approved");

  // ── Calendar: derive leave days from approved requests in current month ─
  const now = new Date();
  const leaveDays = new Set();
  approvedRequests.forEach((r) => {
    const s = new Date(r.startDate);
    const e = new Date(r.endDate);
    for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
      if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
        leaveDays.add(d.getDate());
      }
    }
  });
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  const tabs = [
    { id: "overview",    label: "Overview",     icon: <BarChart3 size={18} /> },
    { id: "requests",    label: "Requests",     icon: <CheckCircle2 size={18} /> },
    { id: "calendar",    label: "Calendar",     icon: <CalendarDays size={18} /> },
    { id: "balances",    label: "Balances",     icon: <Wallet size={18} /> },
    { id: "policies",    label: "Policies",     icon: <ShieldCheck size={18} /> },
    { id: "encashment",  label: "Encashment",   icon: <ReceiptText size={18} /> },
    { id: "carry",       label: "Carry Forward",icon: <RotateCcw size={18} /> },
  ];

  const LEAVE_TYPES = ["Annual", "Sick", "Casual", "Comp-Off", "Maternity", "Paternity", "Unpaid"];

  return (
    <div className="erp-container leave-module" style={{ width: "100%", maxWidth: "1400px", margin: "0 auto", height: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <header className="module-header" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button onClick={() => navigate(-1)} className="glass-card" style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "4px" }}>Leave Management</h1>
          <p style={{ color: "var(--text-muted)" }}>Manage leave balances, policy workflows, approvals, and carry-forward rules.</p>
        </div>
      </header>

      {/* Tab nav */}
      <div
        ref={tabNavRef}
        className="glass-card module-subnav leave-subnav"
        onPointerDown={handleTabDragStart}
        onPointerMove={handleTabDragMove}
        onPointerUp={handleTabDragEnd}
        onPointerLeave={handleTabDragEnd}
        onPointerCancel={handleTabDragEnd}
        style={{ display: "flex", gap: "4px", flexWrap: "nowrap", justifyContent: "flex-start", alignItems: "stretch", minHeight: "52px", padding: "6px", overflowX: "auto", overflowY: "hidden", width: "100%", scrollBehavior: "smooth", touchAction: "pan-x", scrollbarWidth: "none", cursor: "grab" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            data-tab={tab.id}
            className="module-subnav-item"
            onClick={() => setActiveTab(tab.id)}
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", transition: "all 0.2s ease", color: activeTab === tab.id ? "white" : "var(--text-muted)", backgroundColor: activeTab === tab.id ? "var(--primary)" : "transparent", flex: "0 0 auto", whiteSpace: "nowrap" }}
          >
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      <main style={{ flex: 1, position: "relative" }}>
        <AnimatePresence mode="wait">

          {/* ─ Overview ─ */}
          {activeTab === "overview" && (
            <TabContent key="overview" title="Leave Operations Overview">
              <div style={{ display: "grid", gap: "24px" }}>
                {/* Stats */}
                <div className="responsive-grid-4 leave-overview-stats" style={{ display: "grid", gap: "20px" }}>
                  {[
                    { label: "Open Requests",        value: loading ? "—" : stats?.pending ?? 0,              icon: <AlertTriangle size={16} />, up: false, trend: "awaiting action" },
                    { label: "Approved This Month",   value: loading ? "—" : stats?.approvedThisMonth ?? 0,   icon: <CheckCircle2 size={16} />,  up: true,  trend: "this month" },
                    { label: "Total Requests",        value: loading ? "—" : stats?.total ?? 0,               icon: <BarChart3 size={16} />,     up: true,  trend: "all time"   },
                    { label: "Rejected",              value: loading ? "—" : stats?.rejected ?? 0,            icon: <TrendingUp size={16} />,    up: false, trend: "not approved" },
                  ].map((item) => (
                    <div key={item.label} className="glass-card" style={{ padding: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <div style={{ width: "34px", height: "34px", borderRadius: "10px", backgroundColor: "var(--icon-bg)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {item.icon}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: "700", color: item.up ? "#10b981" : "#f59e0b" }}>
                          {item.up ? <TrendingUp size={14} /> : <Clock3 size={14} />} {item.trend}
                        </div>
                      </div>
                      <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "6px" }}>{item.label}</div>
                      <div style={{ fontSize: "32px", fontWeight: "800" }}>{item.value}</div>
                    </div>
                  ))}
                </div>

                {/* Leave type breakdown */}
                {!loading && stats?.byType?.length > 0 && (
                  <div className="glass-card" style={{ padding: "24px" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>Requests by Leave Type</h3>
                    <div style={{ display: "grid", gap: "12px" }}>
                      {stats.byType.map((t) => {
                        const pct = stats.total > 0 ? Math.round((t.count / stats.total) * 100) : 0;
                        return (
                          <div key={t.type}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                              <span style={{ fontWeight: "600" }}>{t.type}</span>
                              <span style={{ color: "var(--text-muted)" }}>{t.count} ({pct}%)</span>
                            </div>
                            <div style={{ height: "8px", borderRadius: "8px", backgroundColor: "var(--tag-bg)", overflow: "hidden" }}>
                              <div style={{ width: `${pct}%`, height: "100%", borderRadius: "8px", backgroundColor: "var(--primary)", transition: "width 0.6s ease" }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Pending queue */}
                <div className="glass-card" style={{ padding: "24px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>Pending Approval Queue</h3>
                  {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}><Loader size={28} className="spinner" /></div>
                  ) : pendingRequests.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "40px 0" }}>No pending requests 🎉</p>
                  ) : (
                    <div style={{ display: "grid", gap: "12px" }}>
                      {pendingRequests.slice(0, 5).map((r) => (
                        <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", borderRadius: "12px", border: "1px solid var(--border)", backgroundColor: "var(--column-bg)", gap: "12px", flexWrap: "wrap" }}>
                          <div>
                            <div style={{ fontWeight: "700", fontSize: "14px" }}>{r.employee?.name}</div>
                            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{r.type} · {new Date(r.startDate).toLocaleDateString()} – {new Date(r.endDate).toLocaleDateString()}</div>
                            {r.reason && <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{r.reason}</div>}
                          </div>
                          {canManage && (
                            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                              <button
                                onClick={() => handleStatusChange(r.id, "Approved")}
                                disabled={!!actionLoading}
                                style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "8px", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981", fontSize: "12px", fontWeight: "700", backgroundColor: "transparent", cursor: actionLoading ? "not-allowed" : "pointer" }}
                              >
                                {actionLoading === r.id + "Approved" ? <Loader size={14} className="spinner" /> : <Check size={14} />} Approve
                              </button>
                              <button
                                onClick={() => handleStatusChange(r.id, "Rejected")}
                                disabled={!!actionLoading}
                                style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "8px", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", fontSize: "12px", fontWeight: "700", backgroundColor: "transparent", cursor: actionLoading ? "not-allowed" : "pointer" }}
                              >
                                {actionLoading === r.id + "Rejected" ? <Loader size={14} className="spinner" /> : <XCircle size={14} />} Reject
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabContent>
          )}

          {/* ─ Requests ─ */}
          {activeTab === "requests" && (
            <TabContent
              key="requests"
              title="Leave Requests"
              action={
                <button
                  onClick={() => { setShowModal(true); setFormError(null); }}
                  className="btn-primary"
                  style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                >
                  <Plus size={18} /> Apply for Leave
                </button>
              }
            >
              <div style={{ display: "grid", gap: "24px" }}>
                <div className="glass-card" style={{ padding: "24px", overflowX: "auto" }}>
                  {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}><Loader size={32} className="spinner" /></div>
                  ) : requests.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
                      <CalendarDays size={40} style={{ opacity: 0.3, marginBottom: "12px" }} />
                      <p>No leave requests yet. Submit the first one!</p>
                    </div>
                  ) : (
                    <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px" }}>
                      <thead>
                        <tr>
                          {["Employee", "Type", "From", "To", "Reason", "Status", canManage ? "Actions" : ""].filter(Boolean).map((h) => (
                            <th key={h} style={{ padding: "0 14px 8px", color: "var(--text-muted)", fontSize: "11px", fontWeight: "700", textAlign: "left", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {requests.map((r) => (
                          <tr key={r.id} style={{ backgroundColor: "var(--tag-bg)" }}>
                            <td style={{ padding: "14px", borderRadius: "12px 0 0 12px", fontWeight: "600", fontSize: "14px" }}>
                              {r.employee?.name ?? "—"}
                              {r.employee?.department && <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{r.employee.department}</div>}
                            </td>
                            <td style={{ padding: "14px", fontSize: "13px" }}>{r.type}</td>
                            <td style={{ padding: "14px", fontSize: "13px", color: "var(--text-muted)" }}>{new Date(r.startDate).toLocaleDateString()}</td>
                            <td style={{ padding: "14px", fontSize: "13px", color: "var(--text-muted)" }}>{new Date(r.endDate).toLocaleDateString()}</td>
                            <td style={{ padding: "14px", fontSize: "13px", color: "var(--text-muted)", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.reason || "—"}</td>
                            <td style={{ padding: "14px" }}><StatusBadge status={r.status} /></td>
                            {canManage && (
                              <td style={{ padding: "14px", borderRadius: "0 12px 12px 0", textAlign: "right" }}>
                                {r.status === "Pending" && (
                                  <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                                    <button
                                      onClick={() => handleStatusChange(r.id, "Approved")}
                                      disabled={!!actionLoading}
                                      style={{ padding: "5px 10px", borderRadius: "8px", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981", fontSize: "11px", fontWeight: "700", backgroundColor: "transparent", display: "flex", alignItems: "center", gap: "4px" }}
                                    >
                                      {actionLoading === r.id + "Approved" ? <Loader size={12} className="spinner" /> : <Check size={12} />} Approve
                                    </button>
                                    <button
                                      onClick={() => handleStatusChange(r.id, "Rejected")}
                                      disabled={!!actionLoading}
                                      style={{ padding: "5px 10px", borderRadius: "8px", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", fontSize: "11px", fontWeight: "700", backgroundColor: "transparent", display: "flex", alignItems: "center", gap: "4px" }}
                                    >
                                      {actionLoading === r.id + "Rejected" ? <Loader size={12} className="spinner" /> : <XCircle size={12} />} Reject
                                    </button>
                                  </div>
                                )}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </TabContent>
          )}

          {/* ─ Calendar ─ */}
          {activeTab === "calendar" && (
            <TabContent key="calendar" title={`Leave Calendar — ${MONTHS[now.getMonth()]} ${now.getFullYear()}`}>
              <div style={{ display: "grid", gap: "24px" }}>
                <div className="glass-card" style={{ padding: "24px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px", marginBottom: "16px" }}>
                    {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                      <div key={d} style={{ textAlign: "center", fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", padding: "6px 0" }}>{d}</div>
                    ))}
                  </div>
                  <div className="leave-calendar-grid" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px" }}>
                    {/* Empty cells for offset */}
                    {Array.from({ length: new Date(now.getFullYear(), now.getMonth(), 1).getDay() }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                      const isLeave = leaveDays.has(day);
                      const isToday = day === now.getDate();
                      return (
                        <div key={day} style={{ height: "52px", borderRadius: "10px", border: `1px solid ${isToday ? "var(--primary)" : "var(--border)"}`, backgroundColor: isLeave ? "rgba(99,102,241,0.12)" : isToday ? "rgba(99,102,241,0.05)" : "var(--column-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: isToday ? "800" : "600", color: isLeave ? "var(--primary)" : isToday ? "var(--primary)" : "var(--text-main)" }}>
                          {day}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="responsive-grid-2 leave-calendar-panels" style={{ display: "grid", gap: "24px" }}>
                  <div className="glass-card" style={{ padding: "24px" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>Calendar Legend</h3>
                    <div style={{ display: "grid", gap: "10px" }}>
                      {[
                        { name: "On Leave (Approved)", color: "var(--primary)" },
                        { name: "Today", color: "#10b981" },
                        { name: "Public Holiday", color: "#0ea5e9" },
                      ].map((item) => (
                        <div key={item.name} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", border: "1px solid var(--border)", backgroundColor: "var(--column-bg)", fontSize: "13px" }}>
                          <span style={{ width: "10px", height: "10px", borderRadius: "999px", backgroundColor: item.color, flexShrink: 0 }} />
                          {item.name}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="glass-card" style={{ padding: "24px" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>Approved Requests This Month</h3>
                    {approvedRequests.length === 0 ? (
                      <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No approved leaves this month.</p>
                    ) : (
                      <div style={{ display: "grid", gap: "10px" }}>
                        {approvedRequests.slice(0, 5).map((r) => (
                          <div key={r.id} style={{ padding: "12px 14px", borderRadius: "10px", border: "1px solid var(--border)", backgroundColor: "var(--column-bg)", fontSize: "13px" }}>
                            <span style={{ fontWeight: "600" }}>{r.employee?.name}</span> · {r.type}
                            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                              {new Date(r.startDate).toLocaleDateString()} – {new Date(r.endDate).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabContent>
          )}

          {/* ─ Balances ─ */}
          {activeTab === "balances" && (
            <TabContent key="balances" title="Leave Balances">
              <div style={{ display: "grid", gap: "24px" }}>
                <div className="glass-card" style={{ padding: "24px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>Policy-Wise Usage Summary</h3>
                  <div style={{ display: "grid", gap: "12px" }}>
                    {(stats?.byType ?? []).map((t) => {
                      // default annual allocations
                      const allocated = { Annual: 18, Sick: 10, Casual: 8, "Comp-Off": 4 }[t.type] ?? 12;
                      const utilization = Math.min(100, Math.round((t.count / allocated) * 100));
                      return (
                        <div key={t.type} style={{ padding: "14px", borderRadius: "12px", backgroundColor: "var(--column-bg)", border: "1px solid var(--border)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "10px" }}>
                            <span style={{ fontWeight: "700" }}>{t.type}</span>
                            <div style={{ display: "flex", gap: "20px" }}>
                              <span style={{ color: "var(--text-muted)" }}>Requests: {t.count}</span>
                              <span style={{ color: "var(--text-muted)" }}>Allocated: {allocated}</span>
                            </div>
                          </div>
                          <div style={{ height: "8px", borderRadius: "8px", backgroundColor: "var(--tag-bg)", overflow: "hidden" }}>
                            <div style={{ width: `${utilization}%`, height: "100%", borderRadius: "8px", backgroundColor: utilization > 80 ? "#ef4444" : "var(--primary)", transition: "width 0.6s ease" }} />
                          </div>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>{utilization}% utilized</div>
                        </div>
                      );
                    })}
                    {(stats?.byType ?? []).length === 0 && (
                      <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "30px 0" }}>No data yet — submit some leave requests first.</p>
                    )}
                  </div>
                </div>
              </div>
            </TabContent>
          )}

          {/* ─ Policies (static info) ─ */}
          {activeTab === "policies" && (
            <TabContent key="policies" title="Policy Engine">
              <div style={{ display: "grid", gap: "24px" }}>
                <div className="glass-card" style={{ padding: "24px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
                    {[
                      "Leave eligibility by department and grades",
                      "Holiday and weekend auto-calculation rules",
                      "Half-day and sandwich leave conditions",
                      "Approval matrix by reporting hierarchy",
                      "Emergency leave and auto-escalation settings",
                      "Region/branch-specific leave policies",
                    ].map((item) => (
                      <div key={item} style={{ padding: "14px", borderRadius: "12px", border: "1px solid var(--border)", backgroundColor: "var(--column-bg)", fontSize: "13px" }}>{item}</div>
                    ))}
                  </div>
                </div>
                <div className="glass-card" style={{ padding: "24px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>Leave Types Configured</h3>
                  <div style={{ display: "grid", gap: "10px" }}>
                    {LEAVE_TYPES.map((lt) => (
                      <div key={lt} style={{ display: "flex", justifyContent: "space-between", padding: "12px 14px", borderRadius: "10px", border: "1px solid var(--border)", backgroundColor: "var(--column-bg)", fontSize: "13px" }}>
                        <span style={{ fontWeight: "600" }}>{lt}</span>
                        <span style={{ color: "var(--text-muted)" }}>Active</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabContent>
          )}

          {/* ─ Encashment (static) ─ */}
          {activeTab === "encashment" && (
            <TabContent key="encashment" title="Leave Encashment Rules">
              <div style={{ display: "grid", gap: "24px" }}>
                <div className="glass-card" style={{ padding: "24px" }}>
                  <div style={{ display: "grid", gap: "12px" }}>
                    {[
                      "Encashment available for Annual Leave only",
                      "Maximum encashment cap: 10 days per financial year",
                      "Encashment requests require manager + payroll approval",
                      "Auto-map approved encashment into payroll run",
                    ].map((rule) => (
                      <div key={rule} style={{ padding: "14px", borderRadius: "12px", border: "1px solid var(--border)", backgroundColor: "var(--column-bg)", fontSize: "13px" }}>{rule}</div>
                    ))}
                  </div>
                </div>
              </div>
            </TabContent>
          )}

          {/* ─ Carry Forward (static) ─ */}
          {activeTab === "carry" && (
            <TabContent key="carry" title="Carry-Forward Rules">
              <div style={{ display: "grid", gap: "24px" }}>
                <div className="glass-card" style={{ padding: "24px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
                    {[
                      { title: "Annual Leave",  detail: "Up to 5 days can carry to next cycle" },
                      { title: "Sick Leave",    detail: "No carry-forward; reset each cycle" },
                      { title: "Casual Leave",  detail: "Carry-forward disabled by policy" },
                      { title: "Comp-Off",      detail: "Valid for 90 days from allocation" },
                    ].map((item) => (
                      <div key={item.title} style={{ padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", backgroundColor: "var(--column-bg)" }}>
                        <div style={{ fontSize: "14px", fontWeight: "700", marginBottom: "6px" }}>{item.title}</div>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{item.detail}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabContent>
          )}

        </AnimatePresence>
      </main>

      {/* ── Apply Leave Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="glass-card"
              style={{ width: "100%", maxWidth: "500px", padding: "32px" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                <div>
                  <h2 style={{ fontSize: "20px", fontWeight: "800" }}>Apply for Leave</h2>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>Fill in the details below to submit your request.</p>
                </div>
                <button onClick={() => setShowModal(false)} style={{ color: "var(--text-muted)", padding: "4px" }}><X size={22} /></button>
              </div>

              {formError && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", borderRadius: "10px", backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444", fontSize: "13px", marginBottom: "20px" }}>
                  <AlertTriangle size={16} />{formError}
                </div>
              )}

              <form onSubmit={handleSubmitLeave} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                {/* Employee picker (admin only) */}
                {canManage && (
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px" }}>Employee *</label>
                    <select
                      required
                      value={formData.employeeId}
                      onChange={(e) => setFormData((p) => ({ ...p, employeeId: e.target.value }))}
                      style={{ width: "100%", padding: "12px", borderRadius: "10px", backgroundColor: "var(--input-bg)", border: "1px solid var(--border)", color: "var(--text-main)", fontSize: "14px" }}
                    >
                      <option value="">Select employee…</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>{emp.name} ({emp.code})</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Leave type */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px" }}>Leave Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))}
                    style={{ width: "100%", padding: "12px", borderRadius: "10px", backgroundColor: "var(--input-bg)", border: "1px solid var(--border)", color: "var(--text-main)", fontSize: "14px" }}
                  >
                    {LEAVE_TYPES.map((lt) => <option key={lt} value={lt}>{lt}</option>)}
                  </select>
                </div>

                {/* Dates */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px" }}>From *</label>
                    <input
                      required
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData((p) => ({ ...p, startDate: e.target.value }))}
                      style={{ width: "100%", padding: "12px", borderRadius: "10px", backgroundColor: "var(--input-bg)", border: "1px solid var(--border)", color: "var(--text-main)", fontSize: "14px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px" }}>To *</label>
                    <input
                      required
                      type="date"
                      value={formData.endDate}
                      min={formData.startDate}
                      onChange={(e) => setFormData((p) => ({ ...p, endDate: e.target.value }))}
                      style={{ width: "100%", padding: "12px", borderRadius: "10px", backgroundColor: "var(--input-bg)", border: "1px solid var(--border)", color: "var(--text-main)", fontSize: "14px" }}
                    />
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px" }}>Reason</label>
                  <textarea
                    rows={3}
                    value={formData.reason}
                    onChange={(e) => setFormData((p) => ({ ...p, reason: e.target.value }))}
                    placeholder="Optional — briefly describe the reason"
                    style={{ width: "100%", padding: "12px", borderRadius: "10px", backgroundColor: "var(--input-bg)", border: "1px solid var(--border)", color: "var(--text-main)", fontSize: "14px", resize: "vertical" }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "14px", fontSize: "15px", fontWeight: "700", marginTop: "4px" }}
                >
                  {submitting ? <><Loader size={20} className="spinner" /> Submitting…</> : <><CalendarDays size={20} /> Submit Request</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Leave;
