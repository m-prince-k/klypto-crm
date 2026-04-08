import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  BadgeCheck,
  CalendarDays,
  Settings,
  ChevronRight,
  LogOut,
  Command,
  Package,
} from "lucide-react";
import { motion } from "framer-motion";

const Sidebar = () => {
  const menuItems = [
    { title: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/" },
    { title: "Leads", icon: <Users size={20} />, path: "/leads" },
    { title: "Pipeline", icon: <Briefcase size={20} />, path: "/pipeline" },
    { title: "ERP Portal", icon: <Package size={20} />, path: "/erp" },
    { title: "HRMS", icon: <BadgeCheck size={20} />, path: "/hrms" },
    { title: "Leave", icon: <CalendarDays size={20} />, path: "/leave" },
    { title: "Settings", icon: <Settings size={20} />, path: "/settings" },
  ];

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="sidebar"
      style={{
        width: "260px",
        backgroundColor: "var(--bg-sidebar)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        padding: "24px 16px",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      <div
        className="logo"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "40px",
          paddingLeft: "12px",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, var(--primary), #8b5cf6)",
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          <Command size={20} />
        </div>
        <span
          style={{
            fontSize: "20px",
            fontWeight: "700",
            letterSpacing: "-0.5px",
          }}
        >
          Twenty CRM
        </span>
      </div>

      <nav style={{ flex: 1 }}>
        <ul style={{ listStyle: "none" }}>
          {menuItems.map((item) => (
            <li key={item.title} style={{ marginBottom: "4px" }}>
              <NavLink
                to={item.path}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px",
                  borderRadius: "10px",
                  color: isActive ? "var(--text-main)" : "var(--text-muted)",
                  backgroundColor: isActive ? "var(--glass)" : "transparent",
                  transition: "all 0.2s ease",
                  fontSize: "14px",
                  fontWeight: isActive ? "600" : "400",
                })}
              >
                {item.icon}
                <span style={{ flex: 1 }}>{item.title}</span>
                <ChevronRight size={14} opacity={0.5} />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div
        style={{
          marginTop: "auto",
          padding: "16px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: "var(--avatar-bg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            fontWeight: "bold",
            color: "var(--text-main)",
          }}
        >
          JD
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "14px", fontWeight: "600" }}>John Doe</div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            Admin
          </div>
        </div>
        <button style={{ color: "var(--text-muted)" }}>
          <LogOut size={18} />
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
