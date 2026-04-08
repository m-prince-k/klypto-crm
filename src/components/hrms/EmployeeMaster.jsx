import React from "react";
import { Users2, Mail, Phone, Building2, UserCheck } from "lucide-react";

const EmployeeMaster = () => {
  const employees = [
    {
      name: "Ava Johnson",
      code: "EMP-001",
      role: "HR Manager",
      department: "People Ops",
      status: "Active",
    },
    {
      name: "Rohan Mehta",
      code: "EMP-002",
      role: "Sales Executive",
      department: "Sales",
      status: "Active",
    },
    {
      name: "Maya Patel",
      code: "EMP-003",
      role: "Payroll Admin",
      department: "Finance",
      status: "Onboarding",
    },
    {
      name: "Noah Garcia",
      code: "EMP-004",
      role: "Software Engineer",
      department: "Technology",
      status: "Active",
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
          <Users2 size={18} /> Employee Master
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          {[
            {
              label: "Work Email",
              value: "hrms@klypto.com",
              icon: <Mail size={16} />,
            },
            {
              label: "Emergency Contact",
              value: "+1 (555) 778-9911",
              icon: <Phone size={16} />,
            },
            {
              label: "Employment Type",
              value: "Permanent",
              icon: <UserCheck size={16} />,
            },
            {
              label: "Reporting Branch",
              value: "HQ - San Francisco",
              icon: <Building2 size={16} />,
            },
          ].map((field) => (
            <div
              key={field.label}
              style={{
                padding: "14px",
                borderRadius: "12px",
                backgroundColor: "var(--column-bg)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  marginBottom: "6px",
                }}
              >
                {field.icon}
                {field.label}
              </div>
              <div style={{ fontSize: "14px", fontWeight: "600" }}>
                {field.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ padding: "24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h3 style={{ fontSize: "18px", fontWeight: "700" }}>
            Employee Directory
          </h3>
          <button className="btn-primary">Add Employee</button>
        </div>
        <div style={{ display: "grid", gap: "12px" }}>
          {employees.map((employee) => (
            <div
              key={employee.code}
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
                  {employee.name}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {employee.code} · {employee.role}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "13px", fontWeight: "600" }}>
                  {employee.department}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: employee.status === "Active" ? "#10b981" : "#f59e0b",
                  }}
                >
                  {employee.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeMaster;
