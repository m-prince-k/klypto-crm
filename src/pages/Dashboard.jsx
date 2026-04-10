import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Users,
  DollarSign,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Users2,
  CalendarCheck2,
  Clock3,
  Wallet2,
  Loader,
} from "lucide-react";
import {
  DASHBOARD_MODULES,
  getAccessibleModules,
  hasModuleAccess,
} from "../utils/access";
import apiClient from "../api/apiClient";

const StatCard = ({ title, value, change, icon, isPositive, trend }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="glass-card"
    style={{ padding: "24px", flex: 1, minWidth: "240px" }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "12px",
          backgroundColor: "var(--icon-bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--primary)",
        }}
      >
        {icon}
      </div>
      {change && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            color: isPositive ? "#10b981" : "#ef4444",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {change}
        </div>
      )}
    </div>
    <div
      style={{
        fontSize: "14px",
        color: "var(--text-muted)",
        marginBottom: "4px",
      }}
    >
      {title}
    </div>
    <div style={{ fontSize: "28px", fontWeight: "700", marginBottom: "4px" }}>{value}</div>
    {trend && <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{trend}</div>}
  </motion.div>
);

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [hrmsStats, setHrmsStats] = useState(null);
  const [crmStats, setCrmStats] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const access = user?.access;
  const accessibleModules = getAccessibleModules(access);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [hrmsRes, crmRes, recentRes] = await Promise.all([
          apiClient.get("/hrms-overview/stats"),
          apiClient.get("/crm-overview/stats"),
          apiClient.get("/crm-overview/recent"),
        ]);
        setHrmsStats(hrmsRes.data);
        setCrmStats(crmRes.data);
        setRecentLeads(recentRes.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ height: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader className="spinner" size={32} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "8px" }}>Executive Dashboard</h1>
        <p style={{ color: "var(--text-muted)" }}>
          Welcome back, {user?.fullName || "there"}. Your organization is currently powered by live data sync.
        </p>
      </header>

      <div
        className="glass-card"
        style={{ padding: "16px 20px", marginBottom: "24px", display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}
      >
        <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>Modules Online:</span>
        {accessibleModules.map((moduleKey) => {
          const module = DASHBOARD_MODULES.find((item) => item.key === moduleKey);
          return (
            <Link
              key={moduleKey}
              to={module?.route || "/"}
              style={{ padding: "6px 14px", borderRadius: "999px", backgroundColor: "var(--tag-bg)", color: "var(--text-main)", fontSize: "12px", textDecoration: "none", border: "1px solid var(--border)", fontWeight: "600" }}
            >
              {module?.label || moduleKey}
            </Link>
          );
        })}
      </div>

      {/* CRM Pipeline Stats */}
      {(hasModuleAccess(access, "leads") || hasModuleAccess(access, "pipeline")) && (
        <div style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>Sales Pipeline Summary</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
            <StatCard title="Total Leads" value={crmStats?.totalLeads || 0} trend="Total generated" icon={<Users size={24} />} isPositive={true} />
            <StatCard title="Active Deals" value={crmStats?.activeDeals || 0} trend="In mid-pipeline" icon={<Target size={24} />} isPositive={true} />
            <StatCard title="Pipeline Value" value={crmStats?.totalRevenue || "$0"} trend="Estimated potential" icon={<DollarSign size={24} />} isPositive={true} />
            <StatCard title="Conversion" value={crmStats?.conversionRate || "0%"} trend="Rate of Won deals" icon={<TrendingUp size={24} />} isPositive={true} />
          </div>
        </div>
      )}

      {/* HRMS Stats */}
      {(hasModuleAccess(access, "hrms") || hasModuleAccess(access, "employees")) && (
        <div style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>HRMS People Operations</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
            <StatCard title="Total Headcount" value={hrmsStats?.totalEmployees || 0} trend="Active staff roster" icon={<Users2 size={24} />} isPositive={true} />
            <StatCard title="Attendance Rate" value={hrmsStats?.attendanceRate || "0%"} trend="Staff present today" icon={<Clock3 size={24} />} isPositive={true} />
            <StatCard title="Pending Leaves" value={hrmsStats?.pendingLeaves || 0} trend="Urgent approvals needed" icon={<CalendarCheck2 size={24} />} isPositive={false} />
            <StatCard title="Payroll Readiness" value={hrmsStats?.payrollReady || "0%"} trend="Salary templates set" icon={<Wallet2 size={24} />} isPositive={true} />
          </div>
        </div>
      )}

      {/* Dashboard Visuals */}
      <div className="responsive-grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
        <div className="glass-card" style={{ padding: "24px", minHeight: "350px" }}>
          <h3 style={{ marginBottom: "20px", fontSize: "18px", fontWeight: "700" }}>Revenue Flow</h3>
          <div style={{ height: "220px", width: "100%", display: "flex", alignItems: "flex-end", gap: "12px", paddingBottom: "20px" }}>
            {[40, 60, 45, 90, 65, 80, 55, 100, 75, 85].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.1, duration: 1 }}
                style={{ flex: 1, background: "linear-gradient(to top, var(--primary), #8b5cf6)", borderRadius: "6px 6px 0 0", opacity: 0.8 }}
              />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "12px", paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
            <span>Q1 Trend</span><span>Q2 Outlook</span><span>Q3 Estimate</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: "24px" }}>
          <h3 style={{ marginBottom: "20px", fontSize: "18px", fontWeight: "700" }}>Recent Lead Activity</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {recentLeads.length === 0 ? (
              <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>No recent activity to show.</div>
            ) : (
              recentLeads.map((lead, i) => (
                <div key={lead.id} style={{ display: "flex", alignItems: "center", gap: "12px", paddingBottom: "16px", borderBottom: i !== recentLeads.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold", color: "white" }}>
                    {lead.name[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", fontWeight: "600" }}>{lead.name}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{lead.company || "Individual"}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "14px", fontWeight: "600" }}>${lead.value?.toLocaleString() || 0}</div>
                    <div style={{ fontSize: "10px", color: "#10b981", fontWeight: "700" }}>{lead.status}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
