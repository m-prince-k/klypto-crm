import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  BadgeCheck,
  CalendarDays,
  Settings,
  ChevronRight,
  Command,
  Package,
  ShieldAlert,
  Wallet,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { motion } from "framer-motion";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { title: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/" },
    { title: "Leads", icon: <Users size={20} />, path: "/leads" },
    { title: "Pipeline", icon: <Briefcase size={20} />, path: "/pipeline" },
    { title: "Recruitment", icon: <Users size={20} />, path: "/recruitment" },
    {
      title: "Grievances",
      icon: <ShieldAlert size={20} />,
      path: "/grievances",
    },
    { title: "Payroll", icon: <Wallet size={20} />, path: "/payroll" },
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
      onClick={() => {
        if (isCollapsed) setIsCollapsed(false);
      }}
      style={{
        width: isCollapsed ? "84px" : "260px",
        backgroundColor: "var(--bg-sidebar)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        padding: "16px 12px",
        height: "100vh",
        position: "sticky",
        top: 0,
        transition: "width 0.25s ease",
      }}
    >
      <div
        className="logo"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
          paddingLeft: isCollapsed ? "0" : "8px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
          {!isCollapsed && (
            <span
              style={{
                fontSize: "20px",
                fontWeight: "700",
                letterSpacing: "-0.5px",
              }}
            >
              Twenty CRM
            </span>
          )}
        </div>
      </div>

      <nav style={{ flex: 1 }}>
        <ul style={{ listStyle: "none" }}>
          {menuItems.map((item) => (
            <li key={item.title} style={{ marginBottom: "4px" }}>
              <NavLink
                to={item.path}
                onClick={(e) => e.stopPropagation()}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: isCollapsed ? "0" : "12px",
                  padding: "12px",
                  borderRadius: "10px",
                  color: isActive ? "var(--text-main)" : "var(--text-muted)",
                  backgroundColor: isActive ? "var(--glass)" : "transparent",
                  transition: "all 0.2s ease",
                  fontSize: "14px",
                  fontWeight: isActive ? "600" : "400",
                  justifyContent: isCollapsed ? "center" : "flex-start",
                })}
                title={isCollapsed ? item.title : undefined}
              >
                {item.icon}
                {!isCollapsed && <span style={{ flex: 1 }}>{item.title}</span>}
                {!isCollapsed && <ChevronRight size={14} opacity={0.5} />}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div
        style={{
          marginTop: "auto",
          padding: isCollapsed ? "12px 4px" : "16px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "flex-start",
          gap: isCollapsed ? "8px" : "12px",
          flexDirection: isCollapsed ? "column" : "row",
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
        {!isCollapsed && (
          <>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "14px", fontWeight: "600" }}>
                John Doe
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                Admin
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsCollapsed((prev) => !prev);
              }}
              className="glass-card"
              style={{
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-muted)",
                flexShrink: 0,
              }}
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
            >
              <PanelLeftClose size={18} />
            </button>
          </>
        )}

        {isCollapsed && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsCollapsed(false);
            }}
            className="glass-card"
            style={{
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
              flexShrink: 0,
            }}
            aria-label="Expand sidebar"
            title="Expand sidebar"
          >
            <PanelLeftOpen size={18} />
          </button>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
