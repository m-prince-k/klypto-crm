import React from "react";
import { Laptop2, FileText, BellRing, MessageSquareMore } from "lucide-react";

const EmployeeSelfService = () => {
  const shortcuts = [
    {
      title: "Payslips",
      detail: "Download current and historical payslips",
      icon: <FileText size={18} />,
    },
    {
      title: "Leave Portal",
      detail: "Apply, track, and cancel leave requests",
      icon: <Laptop2 size={18} />,
    },
    {
      title: "Notifications",
      detail: "Policy updates, approvals, and reminders",
      icon: <BellRing size={18} />,
    },
    {
      title: "Grievance Inbox",
      detail: "Raise issues with anonymous support",
      icon: <MessageSquareMore size={18} />,
    },
  ];

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      <div className="glass-card" style={{ padding: "24px" }}>
        <h3
          style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}
        >
          Employee Self-Service Portal
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          {shortcuts.map((item) => (
            <div
              key={item.title}
              style={{
                padding: "16px",
                borderRadius: "12px",
                backgroundColor: "var(--column-bg)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: "var(--icon-bg)",
                  color: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "12px",
                }}
              >
                {item.icon}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  marginBottom: "6px",
                }}
              >
                {item.title}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "var(--text-muted)",
                  lineHeight: 1.5,
                }}
              >
                {item.detail}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ padding: "24px" }}>
        <h3
          style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}
        >
          Self-Service Highlights
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "14px",
          }}
        >
          {[
            "Update personal profile and contact details",
            "View attendance history and leave balances",
            "Receive manager approvals and alerts",
            "Access policy documents and announcements",
          ].map((item) => (
            <div
              key={item}
              style={{
                padding: "14px",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--column-bg)",
                fontSize: "13px",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeSelfService;
