import React from "react";
import { CalendarDays, Clock3, CheckCircle2, XCircle } from "lucide-react";

const Attendance = () => {
  const rows = [
    {
      name: "Ava Johnson",
      checkIn: "09:02 AM",
      checkOut: "06:11 PM",
      status: "Present",
    },
    {
      name: "Rohan Mehta",
      checkIn: "09:18 AM",
      checkOut: "06:03 PM",
      status: "Present",
    },
    { name: "Maya Patel", checkIn: "-", checkOut: "-", status: "Leave" },
    {
      name: "Noah Garcia",
      checkIn: "09:00 AM",
      checkOut: "05:57 PM",
      status: "Present",
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
          <Clock3 size={18} /> Attendance Summary
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          {[
            {
              label: "Present Today",
              value: "318",
              icon: <CheckCircle2 size={16} />,
              color: "#10b981",
            },
            {
              label: "On Leave",
              value: "18",
              icon: <CalendarDays size={16} />,
              color: "#f59e0b",
            },
            {
              label: "Late Check-ins",
              value: "6",
              icon: <Clock3 size={16} />,
              color: "#0ea5e9",
            },
            {
              label: "Absent",
              value: "4",
              icon: <XCircle size={16} />,
              color: "#ef4444",
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                padding: "16px",
                borderRadius: "12px",
                backgroundColor: "var(--column-bg)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <div style={{ color: item.color }}>{item.icon}</div>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Today
                </span>
              </div>
              <div style={{ fontSize: "26px", fontWeight: "800" }}>
                {item.value}
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ padding: "24px" }}>
        <h3
          style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}
        >
          Daily Attendance Log
        </h3>
        <div style={{ display: "grid", gap: "12px" }}>
          {rows.map((row) => (
            <div
              key={row.name}
              className="hrms-attendance-row"
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 0.8fr",
                gap: "12px",
                alignItems: "center",
                padding: "14px",
                borderRadius: "12px",
                backgroundColor: "var(--column-bg)",
                border: "1px solid var(--border)",
                fontSize: "13px",
              }}
            >
              <div style={{ fontWeight: "600" }}>{row.name}</div>
              <div style={{ color: "var(--text-muted)" }}>
                In: {row.checkIn}
              </div>
              <div style={{ color: "var(--text-muted)" }}>
                Out: {row.checkOut}
              </div>
              <div
                style={{
                  textAlign: "right",
                  fontWeight: "700",
                  color: row.status === "Present" ? "#10b981" : "#f59e0b",
                }}
              >
                {row.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
