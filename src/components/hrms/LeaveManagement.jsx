import React from "react";
import {
  CalendarCheck2,
  ShieldAlert,
  CheckCircle2,
  Clock3,
} from "lucide-react";

const LeaveManagement = () => {
  const policies = [
    { label: "Annual Leave Balance", value: "14 days" },
    { label: "Sick Leave Balance", value: "6 days" },
    { label: "Carry Forward Limit", value: "5 days" },
    { label: "Approval SLA", value: "24 hours" },
  ];

  const requests = [
    {
      name: "Ava Johnson",
      type: "Annual Leave",
      dates: "Apr 11 - Apr 13",
      status: "Pending",
    },
    {
      name: "Rohan Mehta",
      type: "Sick Leave",
      dates: "Apr 08",
      status: "Approved",
    },
    {
      name: "Maya Patel",
      type: "Maternity Leave",
      dates: "Apr 15 - May 15",
      status: "Pending",
    },
  ];

  return (
    <div style={{ display: "grid", gap: "24px" }}>
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
          <CalendarCheck2 size={18} /> Leave Policy Engine
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          {policies.map((policy) => (
            <div
              key={policy.label}
              style={{
                padding: "16px",
                borderRadius: "12px",
                backgroundColor: "var(--column-bg)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  marginBottom: "8px",
                }}
              >
                {policy.label}
              </div>
              <div style={{ fontSize: "22px", fontWeight: "800" }}>
                {policy.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ padding: "24px" }}>
        <h3
          style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}
        >
          Leave Requests
        </h3>
        <div style={{ display: "grid", gap: "12px" }}>
          {requests.map((request) => (
            <div
              key={request.name}
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
                  {request.name}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {request.type} · {request.dates}
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "12px",
                    color:
                      request.status === "Approved" ? "#10b981" : "#f59e0b",
                  }}
                >
                  {request.status === "Approved" ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <Clock3 size={14} />
                  )}
                  {request.status}
                </div>
                <button
                  className="btn-primary"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <ShieldAlert size={14} /> Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaveManagement;
