import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users2,
  CalendarCheck2,
  Clock3,
  Wallet2,
  ShieldCheck,
  BadgeCheck,
  TrendingUp,
  Loader,
} from "lucide-react";
import apiClient from "../../api/apiClient";

const HRMSOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get("/hrms-overview/stats");
        setStats(response.data);
      } catch (err) {
        console.error("Failed to fetch HR overview stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

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

  const statCards = [
    {
      label: "Total Employees",
      value: stats?.totalEmployees || "0",
      trend: "Organization headcount",
      icon: <Users2 size={18} />,
      accent: "#0ea5e9",
    },
    {
      label: "Attendance Rate",
      value: stats?.attendanceRate || "0%",
      trend: "Active staff today",
      icon: <Clock3 size={18} />,
      accent: "#10b981",
    },
    {
      label: "Pending Leaves",
      value: stats?.pendingLeaves || "0",
      trend: "Awaiting approval",
      icon: <CalendarCheck2 size={18} />,
      accent: "#f59e0b",
    },
    {
      label: "Payroll Ready",
      value: stats?.payrollReady || "0%",
      trend: "Salary defined",
      icon: <Wallet2 size={18} />,
      accent: "#8b5cf6",
    },
  ];

  const milestones = [
    {
      title: "Core Infrastructure Active",
      detail: "Backend APIs and Database schemas for HR are fully operational.",
      status: "Ready",
    },
    {
      title: "Real-time Attendance Sync",
      detail: "Live tracking of employee check-ins and check-outs is enabled.",
      status: "Active",
    },
    {
      title: "Payroll & Performance Ready",
      detail:
        "Modules for salary management and performance reviews are integrated.",
      status: "Active",
    },
  ];

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      <div
        className="responsive-grid-4"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {statCards.map((stat, i) => (
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
                  color: "var(--text-muted)",
                }}
              >
                <TrendingUp size={14} /> {stat.trend}
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
        className="hrms-overview-panels"
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
              HR Execution Snapshot
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
            HR Multi-Tenant Focus
          </h3>
          <div style={{ display: "grid", gap: "12px" }}>
            {[
              "Employee Lifecycle & Directory",
              "Dynamic Attendance & Reports",
              "Leave Workflow & Policy Engine",
              "Payroll Processing & Payslips",
              "Performance Review Cycles",
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
