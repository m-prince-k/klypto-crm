import React from "react";
import { motion } from "framer-motion";
import {
  Users2,
  CalendarCheck2,
  Clock3,
  Wallet2,
  ShieldCheck,
  BadgeCheck,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const HRMSOverview = () => {
  const stats = [
    {
      label: "Total Employees",
      value: "342",
      trend: "+8 this month",
      up: true,
      icon: <Users2 size={18} />,
      accent: "#0ea5e9",
    },
    {
      label: "Attendance Rate",
      value: "96.4%",
      trend: "+1.2% vs last month",
      up: true,
      icon: <Clock3 size={18} />,
      accent: "#10b981",
    },
    {
      label: "Pending Leave Requests",
      value: "18",
      trend: "6 urgent approvals",
      up: false,
      icon: <CalendarCheck2 size={18} />,
      accent: "#f59e0b",
    },
    {
      label: "Payroll Ready",
      value: "97%",
      trend: "Next run in 4 days",
      up: null,
      icon: <Wallet2 size={18} />,
      accent: "#8b5cf6",
    },
  ];

  const milestones = [
    {
      title: "Employee master synced",
      detail: "All core employee profiles are centralized.",
      status: "Complete",
    },
    {
      title: "Shift calendar published",
      detail: "Monthly shifts and holidays are visible to managers.",
      status: "Active",
    },
    {
      title: "Payroll structure mapped",
      detail: "Earnings, deductions, and approvals are ready.",
      status: "In review",
    },
  ];

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass-card"
            style={{ padding: "20px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  padding: "10px",
                  borderRadius: "10px",
                  backgroundColor: `${stat.accent}15`,
                  color: stat.accent,
                }}
              >
                {stat.icon}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "12px",
                  fontWeight: "700",
                  color:
                    stat.up === null
                      ? "var(--text-muted)"
                      : stat.up
                        ? "#10b981"
                        : "#ef4444",
                }}
              >
                {stat.up === null ? null : stat.up ? (
                  <TrendingUp size={14} />
                ) : (
                  <TrendingDown size={14} />
                )}{" "}
                {stat.trend}
              </div>
            </div>
            <div
              style={{
                fontSize: "13px",
                color: "var(--text-muted)",
                marginBottom: "6px",
              }}
            >
              {stat.label}
            </div>
            <div style={{ fontSize: "28px", fontWeight: "800" }}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: "24px",
        }}
      >
        <div className="glass-card" style={{ padding: "24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "700" }}>
              HRMS Execution Snapshot
            </h3>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                color: "#10b981",
                backgroundColor: "#10b98115",
                padding: "6px 10px",
                borderRadius: "999px",
              }}
            >
              <ShieldCheck size={14} /> RBAC enabled
            </span>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            {milestones.map((item) => (
              <div
                key={item.title}
                style={{
                  display: "flex",
                  gap: "12px",
                  padding: "14px",
                  borderRadius: "12px",
                  backgroundColor: "var(--column-bg)",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    backgroundColor: "var(--icon-bg)",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <BadgeCheck size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "12px",
                      marginBottom: "4px",
                    }}
                  >
                    <h4 style={{ fontSize: "14px", fontWeight: "700" }}>
                      {item.title}
                    </h4>
                    <span
                      style={{ fontSize: "11px", color: "var(--text-muted)" }}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--text-muted)",
                      lineHeight: 1.5,
                    }}
                  >
                    {item.detail}
                  </p>
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
            }}
          >
            HRMS Focus Areas
          </h3>
          <div style={{ display: "grid", gap: "12px" }}>
            {[
              "Employee master & reporting structure",
              "Attendance, shifts, and holiday calendar",
              "Leave policies, balances, and approvals",
              "Payroll structure and approvals",
              "Performance reviews and employee self-service",
            ].map((item) => (
              <div
                key={item}
                style={{
                  padding: "12px 14px",
                  borderRadius: "10px",
                  backgroundColor: "var(--column-bg)",
                  border: "1px solid var(--border)",
                  fontSize: "13px",
                  color: "var(--text-main)",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRMSOverview;
