import React from "react";
import {
  Network,
  UserSquare2,
  ChevronRight,
  MoreVertical,
  Building2,
} from "lucide-react";

const EntityManagement = () => {
  const branches = [
    {
      id: "1",
      name: "HQ - San Francisco",
      type: "Main",
      head: "Alice Johnson",
      depts: 5,
    },
    { id: "2", name: "NY Office", type: "Branch", head: "Bob Smith", depts: 3 },
    {
      id: "3",
      name: "London Hub",
      type: "International",
      head: "Charlie Brown",
      depts: 4,
    },
  ];

  const departments = [
    {
      id: "D1",
      name: "Engineering",
      branch: "San Francisco",
      head: "David Wilson",
      staff: 45,
    },
    {
      id: "D2",
      name: "Sales & Marketing",
      branch: "San Francisco",
      head: "Elena Rodriguez",
      staff: 20,
    },
    {
      id: "D3",
      name: "Operations",
      branch: "NY Office",
      head: "Frank Miller",
      staff: 15,
    },
  ];

  return (
    <div
      className="responsive-grid-2 erp-entity-grid"
      style={{ display: "grid", gap: "24px" }}
    >
      {/* Branches List */}
      <div className="glass-card" style={{ padding: "24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
            <Network size={20} className="text-primary" /> Branches
          </h3>
          <button
            style={{
              color: "var(--primary)",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            View All
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="erp-entity-item"
              style={{
                padding: "16px",
                backgroundColor: "var(--tag-bg)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                border: "1px solid var(--border)",
              }}
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
                <h4 style={{ fontSize: "15px", fontWeight: "600" }}>
                  {branch.name}
                </h4>
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {branch.type} • {branch.depts} Departments
                </p>
              </div>
              <button style={{ color: "var(--text-muted)" }}>
                <MoreVertical size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Departments List */}
      <div className="glass-card" style={{ padding: "24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
            <UserSquare2 size={20} className="text-primary" /> Departments
          </h3>
          <button
            style={{
              color: "var(--primary)",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            View All
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="erp-entity-item"
              style={{
                padding: "16px",
                backgroundColor: "var(--tag-bg)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                border: "1px solid var(--border)",
              }}
            >
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: "15px", fontWeight: "600" }}>
                  {dept.name}
                </h4>
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {dept.branch} • {dept.staff} Members
                </p>
              </div>
              <div className="erp-entity-meta" style={{ textAlign: "right" }}>
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Head
                </p>
                <p style={{ fontSize: "14px", fontWeight: "500" }}>
                  {dept.head}
                </p>
              </div>
              <ChevronRight size={18} style={{ color: "var(--text-muted)" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EntityManagement;
