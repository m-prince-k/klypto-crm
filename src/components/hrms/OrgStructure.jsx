import React, { useState, useEffect } from "react";
import { Building2, GitBranch, UserCircle2, Loader } from "lucide-react";
import apiClient from "../../api/apiClient";

const OrgStructure = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await apiClient.get("/employees");
        setEmployees(response.data);
      } catch (err) {
        console.error("Failed to fetch employees", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const colors = [
    "#0ea5e9", // blue
    "#8b5cf6", // purple
    "#10b981", // green
    "#f59e0b", // yellow
    "#ec4899", // pink
    "#14b8a6", // teal
  ];

  const roleCounts = employees.reduce((acc, emp) => {
    const role = emp.role || "Unspecified";
    if (!acc[role]) acc[role] = 0;
    acc[role]++;
    return acc;
  }, {});

  const dynamicNodes = Object.keys(roleCounts).map((role, i) => ({
    title: role,
    count: roleCounts[role],
    color: colors[i % colors.length],
  }));

  const deptMap = employees.reduce((acc, emp) => {
    const dept = emp.department || "Unspecified";
    const role = emp.role || "Unspecified";
    if (!acc[dept]) acc[dept] = new Set();
    acc[dept].add(role);
    return acc;
  }, {});

  const dynamicDepartments = Object.keys(deptMap).map((dept) => ({
    dept,
    designation: Array.from(deptMap[dept]).join(", "),
  }));

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
        }}
      >
        <Loader className="spinner" size={24} color="var(--text-muted)" />
      </div>
    );
  }

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
          <GitBranch size={18} /> Roles & Reporting
        </h3>
        {dynamicNodes.length === 0 ? (
          <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            No roles found. Add employees to populate this section.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "16px",
            }}
          >
            {dynamicNodes.map((node) => (
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
        )}
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
        {dynamicDepartments.length === 0 ? (
          <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            No departments found. Add employees to populate this section.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "14px",
            }}
          >
            {dynamicDepartments.map((item) => (
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
        )}
      </div>
    </div>
  );
};

export default OrgStructure;
