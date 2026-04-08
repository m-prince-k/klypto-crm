import React from "react";
import { Building2, GitBranch, UserCircle2 } from "lucide-react";

const OrgStructure = () => {
  const nodes = [
    { title: "Super Admin", count: 1, color: "#0ea5e9" },
    { title: "HR Admin", count: 3, color: "#8b5cf6" },
    { title: "Department Heads", count: 8, color: "#10b981" },
    { title: "Managers", count: 16, color: "#f59e0b" },
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
          <GitBranch size={18} /> Reporting Structure
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
          }}
        >
          {nodes.map((node) => (
            <div
              key={node.title}
              style={{
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--column-bg)",
              }}
            >
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
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    backgroundColor: `${node.color}15`,
                    color: node.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <UserCircle2 size={18} />
                </div>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {node.count}
                </span>
              </div>
              <div style={{ fontSize: "14px", fontWeight: "700" }}>
                {node.title}
              </div>
            </div>
          ))}
        </div>
      </div>

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
          <Building2 size={18} /> Departments & Designations
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "14px",
          }}
        >
          {[
            {
              dept: "People Operations",
              designation: "HR Manager, HR Executive",
            },
            { dept: "Finance", designation: "Payroll Admin, Accountant" },
            { dept: "Sales", designation: "Sales Manager, SDR, AE" },
            { dept: "Technology", designation: "Engineering Manager, DevOps" },
          ].map((item) => (
            <div
              key={item.dept}
              style={{
                padding: "14px",
                borderRadius: "12px",
                backgroundColor: "var(--column-bg)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  marginBottom: "4px",
                }}
              >
                {item.dept}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  lineHeight: 1.5,
                }}
              >
                {item.designation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrgStructure;
