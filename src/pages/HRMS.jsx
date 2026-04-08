import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Users2,
  GitBranch,
  Clock3,
  CalendarCheck2,
  Wallet2,
  Award,
  Laptop2,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import HRMSOverview from "../components/hrms/HRMSOverview";
import EmployeeMaster from "../components/hrms/EmployeeMaster";
import OrgStructure from "../components/hrms/OrgStructure";
import Attendance from "../components/hrms/Attendance";
import LeaveManagement from "../components/hrms/LeaveManagement";
import PayrollStructure from "../components/hrms/PayrollStructure";
import PerformanceReviews from "../components/hrms/PerformanceReviews";
import EmployeeSelfService from "../components/hrms/EmployeeSelfService";

const TabContent = ({ title, children, showAdd = true }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="erp-tab-content"
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
        gap: "16px",
        flexWrap: "wrap",
      }}
    >
      <h2 style={{ fontSize: "24px", fontWeight: "700" }}>{title}</h2>
      {showAdd && (
        <button
          className="btn-primary"
          style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
        >
          <Plus size={18} /> Add New
        </button>
      )}
    </div>
    {children}
  </motion.div>
);

const HRMS = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: <BarChart3 size={18} /> },
    { id: "employees", label: "Employees", icon: <Users2 size={18} /> },
    { id: "structure", label: "Structure", icon: <GitBranch size={18} /> },
    { id: "attendance", label: "Attendance", icon: <Clock3 size={18} /> },
    { id: "leave", label: "Leave", icon: <CalendarCheck2 size={18} /> },
    { id: "payroll", label: "Payroll", icon: <Wallet2 size={18} /> },
    { id: "performance", label: "Performance", icon: <Award size={18} /> },
    { id: "selfservice", label: "Portal", icon: <Laptop2 size={18} /> },
  ];

  return (
    <div
      className="erp-container"
      style={{
        width: "100%",
        maxWidth: "1400px",
        margin: "0 auto",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <button
          onClick={() => navigate("/erp")}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            border: "1px solid var(--border)",
            backgroundColor: "var(--glass)",
            color: "var(--text-main)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--border)";
            e.currentTarget.style.transform = "translateX(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--glass)";
            e.currentTarget.style.transform = "translateX(0)";
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "4px" }}>
            HRMS Portal
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            Manage people operations, attendance, leave, payroll, and employee
            self-service.
          </p>
        </div>
      </header>

      <div
        className="glass-card"
        style={{
          display: "flex",
          gap: "4px",
          alignContent: "center",
          flexWrap: "nowrap",
          justifyContent: "flex-start",
          alignItems: "stretch",
          minHeight: "52px",
          padding: "6px",
          overflowX: "auto",
          overflowY: "hidden",
          width: "100%",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              transition: "all 0.2s ease",
              color: activeTab === tab.id ? "white" : "var(--text-muted)",
              backgroundColor:
                activeTab === tab.id ? "var(--primary)" : "transparent",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <main style={{ flex: 1, position: "relative" }}>
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <TabContent
              key="overview"
              title="People Operations Overview"
              showAdd={false}
            >
              <HRMSOverview />
            </TabContent>
          )}

          {activeTab === "employees" && (
            <TabContent key="employees" title="Employee Master">
              <EmployeeMaster />
            </TabContent>
          )}

          {activeTab === "structure" && (
            <TabContent
              key="structure"
              title="Organization Structure"
              showAdd={false}
            >
              <OrgStructure />
            </TabContent>
          )}

          {activeTab === "attendance" && (
            <TabContent
              key="attendance"
              title="Attendance Tracking"
              showAdd={false}
            >
              <Attendance />
            </TabContent>
          )}

          {activeTab === "leave" && (
            <TabContent key="leave" title="Leave Management" showAdd={false}>
              <LeaveManagement />
            </TabContent>
          )}

          {activeTab === "payroll" && (
            <TabContent key="payroll" title="Payroll Structure" showAdd={false}>
              <PayrollStructure />
            </TabContent>
          )}

          {activeTab === "performance" && (
            <TabContent
              key="performance"
              title="Performance Reviews"
              showAdd={false}
            >
              <PerformanceReviews />
            </TabContent>
          )}

          {activeTab === "selfservice" && (
            <TabContent
              key="selfservice"
              title="Employee Self-Service"
              showAdd={false}
            >
              <EmployeeSelfService />
            </TabContent>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default HRMS;
