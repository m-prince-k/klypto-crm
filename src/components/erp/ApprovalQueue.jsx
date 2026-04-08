import React from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";

const ApprovalQueue = () => {
  const approvals = [
    {
      id: "APP-101",
      type: "Purchase Order",
      requester: "Elena Rodriguez",
      amount: "$4,200",
      date: "2h ago",
      priority: "High",
      description: "Monthly Cloud Infrastructure bill for AWS.",
    },
    {
      id: "APP-102",
      type: "New Vendor",
      requester: "Alice Johnson",
      amount: "-",
      date: "5h ago",
      priority: "Medium",
      description: 'Request to onboard "Global Logistics Ltd" for shipping.',
    },
    {
      id: "APP-103",
      type: "Asset Disposal",
      requester: "Frank Miller",
      amount: "$1,200",
      date: "1d ago",
      priority: "Low",
      description: "End-of-life disposal of 5 old workstation PCs.",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="glass-card" style={{ padding: "24px" }}>
        <div
          className="erp-approval-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <ShieldAlert size={20} className="text-primary" /> Pending Approvals
          </h3>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            {approvals.length} pending requests
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {approvals.map((req) => (
            <div
              key={req.id}
              className="erp-approval-item"
              style={{
                padding: "20px",
                backgroundColor: "var(--tag-bg)",
                borderRadius: "16px",
                border: "1px solid var(--border)",
              }}
            >
              <div
                className="erp-approval-top"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                  flexWrap: "wrap",
                  marginBottom: "12px",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "4px",
                    }}
                  >
                    <span style={{ fontWeight: "700", fontSize: "15px" }}>
                      {req.type}
                    </span>
                    <span
                      style={{ fontSize: "12px", color: "var(--text-muted)" }}
                    >
                      #{req.id}
                    </span>
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                    Requested by{" "}
                    <span
                      style={{ color: "var(--text-main)", fontWeight: "500" }}
                    >
                      {req.requester}
                    </span>{" "}
                    • {req.date}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontWeight: "700",
                      fontSize: "16px",
                      color: "var(--text-main)",
                    }}
                  >
                    {req.amount !== "-" ? req.amount : ""}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: "800",
                      color: req.priority === "High" ? "#ef4444" : "#f59e0b",
                    }}
                  >
                    {req.priority.toUpperCase()} PRIORITY
                  </div>
                </div>
              </div>

              <p
                style={{
                  fontSize: "14px",
                  color: "var(--text-muted)",
                  marginBottom: "20px",
                  lineHeight: "1.5",
                }}
              >
                {req.description}
              </p>

              <div
                className="erp-approval-actions"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    color: "var(--primary)",
                    fontWeight: "600",
                  }}
                >
                  <ExternalLink size={14} /> View Full Details
                </button>
                <div
                  className="erp-approval-action-buttons"
                  style={{ display: "flex", gap: "12px" }}
                >
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      backgroundColor: "rgba(239, 68, 68, 0.1)",
                      color: "#ef4444",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    <XCircle size={16} /> Reject
                  </button>
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      backgroundColor: "#10b981",
                      color: "white",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    <CheckCircle size={16} /> Approve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApprovalQueue;
