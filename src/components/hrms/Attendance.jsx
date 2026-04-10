import React, { useState, useEffect } from "react";
import { CalendarDays, Clock3, CheckCircle2, XCircle, Loader } from "lucide-react";
import apiClient from "../../api/apiClient";

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // format: "employeeId_type"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, attRes] = await Promise.all([
          apiClient.get("/employees"),
          apiClient.get("/attendance"),
        ]);
        setEmployees(empRes.data);
        setAttendance(attRes.data);
      } catch (err) {
        console.error("Error fetching attendance data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeEmployees = employees.filter(
    (e) => e.status === "Active" || e.status === "Onboarding"
  );

  const rows = activeEmployees.map((emp) => {
    const record = attendance.find((a) => a.employeeId === emp.id);

    let checkIn = "-";
    let checkOut = "-";
    let status = "Absent";
    let statusColor = "#ef4444";

    if (record) {
      status = record.status;
      if (record.checkIn) {
        checkIn = new Date(record.checkIn).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      if (record.checkOut) {
        checkOut = new Date(record.checkOut).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      }

      if (status === "Present") statusColor = "#10b981";
      else if (status === "Leave") statusColor = "#f59e0b";
      else if (status === "Late") statusColor = "#0ea5e9";
    }

    return {
      id: emp.id,
      name: emp.name,
      checkIn,
      checkOut,
      status,
      statusColor,
      hasRecord: !!record,
    };
  });

  const handleAction = async (employeeId, type) => {
    const actionKey = `${employeeId}_${type}`;
    setActionLoading(actionKey);
    try {
      const now = new Date().toISOString();
      const payload = { employeeId };

      if (type === "check-in") {
        payload.status = "Present";
        payload.checkIn = now;
      } else if (type === "check-out") {
        payload.checkOut = now;
      }

      await apiClient.post("/attendance", payload);

      // Refresh just the attendance payload
      const attRes = await apiClient.get("/attendance");
      setAttendance(attRes.data);
    } catch (err) {
      console.error("Failed to commit attendance", err);
      alert("Failed to save attendance.");
    } finally {
      setActionLoading(null);
    }
  };

  const presentCount = rows.filter((r) => r.status === "Present").length;
  const leaveCount = rows.filter((r) => r.status === "Leave").length;
  const lateCount = rows.filter((r) => r.status === "Late").length;
  const absentCount = rows.filter((r) => r.status === "Absent").length;

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
              value: presentCount.toString(),
              icon: <CheckCircle2 size={16} />,
              color: "#10b981",
            },
            {
              label: "On Leave",
              value: leaveCount.toString(),
              icon: <CalendarDays size={16} />,
              color: "#f59e0b",
            },
            {
              label: "Late Check-ins",
              value: lateCount.toString(),
              icon: <Clock3 size={16} />,
              color: "#0ea5e9",
            },
            {
              label: "Absent",
              value: absentCount.toString(),
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
        {rows.length === 0 ? (
          <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            No active employees available to track.
          </div>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {rows.map((row) => (
              <div
                key={row.id}
                className="hrms-attendance-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
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
                    color: row.statusColor,
                  }}
                >
                  {row.status}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "8px",
                  }}
                >
                  <button
                    onClick={() => handleAction(row.id, "check-in")}
                    className="btn-primary"
                    style={{ padding: "4px 8px", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px", minWidth: "75px", justifyContent: "center" }}
                    disabled={(row.hasRecord && row.checkIn !== "-") || actionLoading === `${row.id}_check-in`}
                  >
                    {actionLoading === `${row.id}_check-in` ? <Loader size={12} className="spinner" /> : "Check-in"}
                  </button>
                  <button
                    onClick={() => handleAction(row.id, "check-out")}
                    className="btn-primary"
                    style={{ padding: "4px 8px", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px", minWidth: "85px", justifyContent: "center" }}
                    disabled={(!row.hasRecord || row.checkOut !== "-" || row.checkIn === "-") || actionLoading === `${row.id}_check-out`}
                  >
                    {actionLoading === `${row.id}_check-out` ? <Loader size={12} className="spinner" /> : "Check-out"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
