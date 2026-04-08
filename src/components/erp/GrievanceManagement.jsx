import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ShieldAlert,
  Clock,
  CheckCircle2,
  UserX,
  History,
  MessageSquare,
  Flag,
  MoreVertical,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Search,
  Filter,
  Eye,
  Send,
  ArrowLeft,
} from "lucide-react";

const GrievanceManagement = () => {
  const [view, setView] = useState("dashboard");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const navigate = useNavigate();
  const tabNavRef = useRef(null);
  const dragStateRef = useRef({ isDragging: false, startX: 0, scrollLeft: 0 });

  const grievances = [
    {
      id: "GRV-001",
      subject: "Hardware Issue in Office",
      cat: "Facilities",
      severity: "Medium",
      status: "In Review",
      dept: "IT",
      time: "2h ago",
      anonymous: false,
    },
    {
      id: "GRV-002",
      subject: "Unfair Treatment Report",
      cat: "Ethics",
      severity: "Critical",
      status: "Escalated",
      dept: "HR",
      time: "5h ago",
      anonymous: true,
    },
    {
      id: "GRV-003",
      subject: "Payroll Discrepancy",
      cat: "Finance",
      severity: "High",
      status: "Resolved",
      dept: "Finance",
      time: "1d ago",
      anonymous: false,
    },
  ];

  const getSeverityColor = (sev) => {
    switch (sev) {
      case "Critical":
        return "#ef4444";
      case "High":
        return "#f59e0b";
      case "Medium":
        return "var(--primary)";
      default:
        return "var(--text-muted)";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "#10b981";
      case "Escalated":
        return "#ef4444";
      case "In Review":
        return "#3b82f6";
      default:
        return "var(--text-muted)";
    }
  };

  useEffect(() => {
    const activeButton = tabNavRef.current?.querySelector(
      `[data-grievance-tab="${view}"]`,
    );

    activeButton?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [view]);

  const handleTabDragStart = (event) => {
    if (!tabNavRef.current) return;

    dragStateRef.current = {
      isDragging: true,
      startX: event.clientX,
      scrollLeft: tabNavRef.current.scrollLeft,
    };

    tabNavRef.current.classList.add("is-dragging");
  };

  const handleTabDragMove = (event) => {
    if (!dragStateRef.current.isDragging || !tabNavRef.current) return;

    event.preventDefault();
    const deltaX = event.clientX - dragStateRef.current.startX;
    tabNavRef.current.scrollLeft = dragStateRef.current.scrollLeft - deltaX;
  };

  const handleTabDragEnd = () => {
    dragStateRef.current.isDragging = false;
    tabNavRef.current?.classList.remove("is-dragging");
  };

  const renderView = () => {
    switch (view) {
      case "dashboard":
        return (
          <div
            className="grievance-dashboard"
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {/* Stats */}
            <div
              className="responsive-grid-4"
              style={{
                display: "grid",
                gap: "20px",
              }}
            >
              {[
                {
                  label: "Total Grievances",
                  val: 42,
                  icon: <MessageSquare size={18} />,
                  color: "var(--primary)",
                },
                {
                  label: "Unresolved",
                  val: 12,
                  icon: <Clock size={18} />,
                  color: "#f59e0b",
                },
                {
                  label: "Critical / High",
                  val: 5,
                  icon: <AlertTriangle size={18} />,
                  color: "#ef4444",
                },
                {
                  label: "Resolved (MTD)",
                  val: 25,
                  icon: <CheckCircle2 size={18} />,
                  color: "#10b981",
                },
              ].map((stat, i) => (
                <div key={i} className="glass-card" style={{ padding: "20px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        padding: "8px",
                        borderRadius: "8px",
                        backgroundColor: "var(--tag-bg)",
                        color: stat.color,
                      }}
                    >
                      {stat.icon}
                    </div>
                    <ArrowUpRight size={16} color="var(--text-muted)" />
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: "800" }}>
                    {stat.val}
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card" style={{ padding: "24px" }}>
              <div
                className="grievance-recent-panel"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                  marginBottom: "20px",
                }}
              >
                <h3 style={{ fontWeight: "700" }}>Recent Grievances</h3>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    className="btn-primary"
                    onClick={() => setView("submit")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Plus size={18} /> New Complaint
                  </button>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {grievances.map((grv) => (
                  <div
                    key={grv.id}
                    className="grievance-list-item"
                    style={{
                      padding: "16px",
                      borderRadius: "12px",
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--tag-bg)",
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "10px",
                        backgroundColor: "var(--input-bg)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: getSeverityColor(grv.severity),
                      }}
                    >
                      {grv.anonymous ? (
                        <UserX size={20} />
                      ) : (
                        <ShieldAlert size={20} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "4px",
                        }}
                      >
                        <span style={{ fontWeight: "700" }}>{grv.subject}</span>
                        {grv.anonymous && (
                          <span
                            style={{
                              fontSize: "10px",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              backgroundColor: "rgba(239, 68, 68, 0.1)",
                              color: "#ef4444",
                              fontWeight: "800",
                            }}
                          >
                            ANONYMOUS
                          </span>
                        )}
                      </div>
                      <div
                        style={{ fontSize: "12px", color: "var(--text-muted)" }}
                      >
                        ID: {grv.id} • {grv.dept} • {grv.cat} • {grv.time}
                      </div>
                    </div>
                    <div
                      className="grievance-list-meta"
                      style={{ textAlign: "right", minWidth: "120px" }}
                    >
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: "700",
                          color: getStatusColor(grv.status),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          gap: "4px",
                        }}
                      >
                        {grv.status === "Resolved" && <ShieldCheck size={12} />}
                        {grv.status.toUpperCase()}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "var(--text-muted)",
                          marginTop: "4px",
                        }}
                      >
                        Severity:{" "}
                        <span style={{ color: getSeverityColor(grv.severity) }}>
                          {grv.severity}
                        </span>
                      </div>
                    </div>
                    <button style={{ color: "var(--text-muted)" }}>
                      <MoreVertical size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "submit":
        return (
          <div
            className="glass-card grievance-submit-card"
            style={{ maxWidth: "700px", margin: "0 auto", padding: "32px" }}
          >
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "800",
                marginBottom: "8px",
              }}
            >
              Submit a Grievance
            </h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "32px" }}>
              We take your concerns seriously. Please provide details below.
            </p>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              <div
                className="grievance-anonymous-toggle"
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  backgroundColor: "var(--input-bg)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor: isAnonymous
                        ? "#ef4444"
                        : "var(--primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    {isAnonymous ? (
                      <UserX size={20} />
                    ) : (
                      <ShieldCheck size={20} />
                    )}
                  </div>
                  <div>
                    <div style={{ fontWeight: "600" }}>
                      Anonymous Submission
                    </div>
                    <div
                      style={{ fontSize: "12px", color: "var(--text-muted)" }}
                    >
                      Your identity will be hidden from the reviewer.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  style={{
                    width: "50px",
                    height: "24px",
                    borderRadius: "12px",
                    backgroundColor: isAnonymous ? "#ef4444" : "var(--border)",
                    position: "relative",
                    transition: "all 0.3s",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: isAnonymous ? "28px" : "4px",
                      top: "4px",
                      width: "16px",
                      height: "16px",
                      backgroundColor: "white",
                      borderRadius: "50%",
                      transition: "all 0.3s",
                    }}
                  ></div>
                </button>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "600",
                    marginBottom: "8px",
                  }}
                >
                  Reason / Subject
                </label>
                <input
                  type="text"
                  placeholder="Brief summary of the issue"
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "8px",
                    backgroundColor: "var(--input-bg)",
                    border: "1px solid var(--border)",
                    color: "white",
                  }}
                />
              </div>

              <div
                className="grievance-submit-two-col"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      marginBottom: "8px",
                    }}
                  >
                    Category
                  </label>
                  <select
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: "8px",
                      backgroundColor: "var(--input-bg)",
                      border: "1px solid var(--border)",
                      color: "white",
                    }}
                  >
                    <option>General</option>
                    <option>Workplace Harassment</option>
                    <option>Policy Violation</option>
                    <option>Management Issue</option>
                    <option>Infrastructure / Facilities</option>
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      marginBottom: "8px",
                    }}
                  >
                    Severity
                  </label>
                  <select
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: "8px",
                      backgroundColor: "var(--input-bg)",
                      border: "1px solid var(--border)",
                      color: "white",
                    }}
                  >
                    <option>Low - Minor Inconvenience</option>
                    <option>Medium - Process Impact</option>
                    <option>High - Urgent Attention</option>
                    <option>Critical - Immediate Action</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "600",
                    marginBottom: "8px",
                  }}
                >
                  Description
                </label>
                <textarea
                  rows={5}
                  placeholder="Provide detailed information about the grievance..."
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "8px",
                    backgroundColor: "var(--input-bg)",
                    border: "1px solid var(--border)",
                    color: "white",
                  }}
                ></textarea>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => setView("dashboard")}
                  style={{
                    flex: 1,
                    padding: "14px",
                    borderRadius: "10px",
                    border: "1px solid var(--border)",
                    fontWeight: "600",
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  style={{
                    flex: 2,
                    padding: "14px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <Send size={18} /> Submit Grievance
                </button>
              </div>
            </div>
          </div>
        );

      case "sla":
        return (
          <div
            className="glass-card grievance-sla-card"
            style={{ padding: "24px" }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "800",
                marginBottom: "20px",
              }}
            >
              SLA & Escalation Matrix
            </h3>
            <div
              className="responsive-grid-3"
              style={{
                display: "grid",
                gap: "20px",
              }}
            >
              {[
                { level: "Level 1: Dept Head", time: "24h", total: 8 },
                { level: "Level 2: Ops Manager", time: "48h", total: 3 },
                { level: "Level 3: Executive Board", time: "72h", total: 1 },
              ].map((mx, i) => (
                <div
                  key={i}
                  className="grievance-sla-item"
                  style={{
                    padding: "20px",
                    borderRadius: "12px",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--tag-bg)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "16px",
                    }}
                  >
                    <Flag
                      size={20}
                      color={i === 2 ? "#ef4444" : "var(--primary)"}
                    />
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "800",
                        color: "var(--text-muted)",
                      }}
                    >
                      SLA: {mx.time}
                    </span>
                  </div>
                  <div style={{ fontWeight: "700", marginBottom: "4px" }}>
                    {mx.level}
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: "800" }}>
                    {mx.total}{" "}
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "400",
                        color: "var(--text-muted)",
                      }}
                    >
                      Pending Cases
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "32px" }}>
              <h4 style={{ fontWeight: "700", marginBottom: "16px" }}>
                Upcoming SLA Breaches
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {[
                  {
                    id: "GRV-002",
                    subject: "Unfair Treatment Report",
                    expires: "2h 15m",
                    progress: 85,
                  },
                  {
                    id: "GRV-005",
                    subject: "Late Salary Payment",
                    expires: "8h 40m",
                    progress: 40,
                  },
                ].map((task, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "16px",
                      backgroundColor: "rgba(239, 68, 68, 0.05)",
                      borderRadius: "10px",
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                      }}
                    >
                      <span style={{ fontWeight: "600" }}>{task.subject}</span>
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#ef4444",
                          fontWeight: "700",
                        }}
                      >
                        Escalating in {task.expires}
                      </span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "6px",
                        backgroundColor: "var(--border)",
                        borderRadius: "3px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${task.progress}%`,
                          height: "100%",
                          backgroundColor: "#ef4444",
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "audit":
        return (
          <div
            className="glass-card grievance-audit-card"
            style={{ padding: "24px" }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "800",
                marginBottom: "24px",
              }}
            >
              System Audit Trail
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {[
                {
                  action: "Grievance Resolved",
                  id: "GRV-003",
                  user: "Admin User",
                  time: "10:45 AM",
                  color: "#10b981",
                },
                {
                  action: "Status Changed to In Review",
                  id: "GRV-001",
                  user: "HR System",
                  time: "09:20 AM",
                  color: "var(--primary)",
                },
                {
                  action: "Grievance Auto-Escalated",
                  id: "GRV-002",
                  user: "System Bot",
                  time: "Yesterday",
                  color: "#ef4444",
                },
                {
                  action: "New Grievance Submitted",
                  id: "GRV-002",
                  user: "Anonymous",
                  time: "Yesterday",
                  color: "var(--text-muted)",
                },
              ].map((log, i) => (
                <div
                  key={i}
                  className="grievance-audit-row"
                  style={{
                    display: "flex",
                    gap: "24px",
                    padding: "16px 0",
                    borderBottom: "1px solid var(--border)",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      minWidth: "100px",
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      fontWeight: "600",
                    }}
                  >
                    {log.time}
                  </div>
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: log.color,
                        marginBottom: "8px",
                      }}
                    ></div>
                    {i !== 3 && (
                      <div
                        style={{
                          position: "absolute",
                          top: "12px",
                          left: "5.5px",
                          width: "1px",
                          height: "100%",
                          backgroundColor: "var(--border)",
                        }}
                      ></div>
                    )}
                  </div>
                  <div className="grievance-audit-content" style={{ flex: 1 }}>
                    <div style={{ fontWeight: "700", fontSize: "14px" }}>
                      {log.action}
                    </div>
                    <div
                      style={{ fontSize: "12px", color: "var(--text-muted)" }}
                    >
                      Target: {log.id} • Performed by: {log.user}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <header
        className="module-header"
        style={{ display: "flex", alignItems: "center", gap: "16px" }}
      >
        <button
          onClick={() => navigate(-1)}
          className="glass-card"
          style={{
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted)",
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 style={{ fontSize: "24px", fontWeight: "800" }}>
            Grievance Management
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Submit and track workplace concerns securely.
          </p>
        </div>
      </header>

      <div
        ref={tabNavRef}
        className="glass-card module-subnav grievance-subnav"
        onPointerDown={handleTabDragStart}
        onPointerMove={handleTabDragMove}
        onPointerUp={handleTabDragEnd}
        onPointerLeave={handleTabDragEnd}
        onPointerCancel={handleTabDragEnd}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "4px",
            alignContent: "center",
            flexWrap: "nowrap",
            justifyContent: "flex-start",
            alignItems: "stretch",
            minHeight: "52px",
            padding: "6px",
            width: "100%",
            maxWidth: "100%",
            overflowX: "auto",
            overflowY: "hidden",
            scrollBehavior: "smooth",
            touchAction: "pan-x",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            cursor: "grab",
          }}
        >
          {[
            {
              id: "dashboard",
              label: "Monitor",
              icon: <MessageSquare size={16} />,
            },
            { id: "sla", label: "SLA Matrix", icon: <Clock size={16} /> },
            { id: "audit", label: "Audit Log", icon: <History size={16} /> },
          ].map((t) => (
            <button
              key={t.id}
              data-grievance-tab={t.id}
              className="recruitment-subnav-item"
              onClick={() => setView(t.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                transition: "all 0.2s ease",
                color: view === t.id ? "white" : "var(--text-muted)",
                backgroundColor:
                  view === t.id ? "var(--primary)" : "transparent",
                flex: "0 0 auto",
                whiteSpace: "nowrap",
                scrollSnapAlign: "center",
              }}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main style={{ flex: 1 }}>{renderView()}</main>
    </div>
  );
};

export default GrievanceManagement;
