import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Users2,
  PackageSearch,
  Receipt,
  BarChart3,
  ClipboardList,
  CheckCircle2,
  Box,
  Plus,
} from "lucide-react";

import OrgSetup from "../components/erp/OrgSetup";
import EntityManagement from "../components/erp/EntityManagement";
import PartnerMaster from "../components/erp/PartnerMaster";
import FinancialWorkflows from "../components/erp/FinancialWorkflows";
import AssetTracker from "../components/erp/AssetTracker";
import ProjectKanban from "../components/erp/ProjectKanban";
import ApprovalQueue from "../components/erp/ApprovalQueue";
import ERPAnalytics from "../components/erp/ERPAnalytics";

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
      }}
    >
      <h2 style={{ fontSize: "24px", fontWeight: "700" }}>{title}</h2>
      {showAdd && (
        <button
          className="btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <Plus size={18} /> Add New
        </button>
      )}
    </div>
    {children}
  </motion.div>
);

const ERP = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: <BarChart3 size={18} /> },
    { id: "org", label: "Organization", icon: <Building2 size={18} /> },
    { id: "entities", label: "Entities", icon: <Box size={18} /> },
    { id: "partners", label: "Partners", icon: <Users2 size={18} /> },
    { id: "assets", label: "Assets", icon: <PackageSearch size={18} /> },
    { id: "transactions", label: "Transactions", icon: <Receipt size={18} /> },
    { id: "projects", label: "Projects", icon: <ClipboardList size={18} /> },
    { id: "approvals", label: "Approvals", icon: <CheckCircle2 size={18} /> },
  ];

  return (
    <div
      className="erp-container"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <header>
        <h1
          style={{ fontSize: "32px", fontWeight: "800", marginBottom: "8px" }}
        >
          ERP Portal
        </h1>
        <p style={{ color: "var(--text-muted)" }}>
          Manage your organization's core operations and resources.
        </p>
      </header>

      {/* Tab Navigation */}
      <div
        className="glass-card"
        style={{
          display: "flex",
          gap: "4px",
          alignContent: "center",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          alignItems: "stretch",
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
              title="Business Overview"
              showAdd={false}
            >
              <ERPAnalytics />
            </TabContent>
          )}

          {activeTab === "org" && (
            <TabContent key="org" title="Organization Setup">
              <OrgSetup />
            </TabContent>
          )}

          {activeTab === "entities" && (
            <TabContent key="entities" title="Branches & Departments">
              <EntityManagement />
            </TabContent>
          )}

          {activeTab === "partners" && (
            <TabContent key="partners" title="Vendors & Customers">
              <PartnerMaster />
            </TabContent>
          )}

          {activeTab === "assets" && (
            <TabContent key="assets" title="Asset Management">
              <AssetTracker />
            </TabContent>
          )}

          {activeTab === "transactions" && (
            <TabContent key="transactions" title="Transactions Workflow">
              <FinancialWorkflows />
            </TabContent>
          )}

          {activeTab === "projects" && (
            <TabContent key="projects" title="Project Tracking">
              <ProjectKanban />
            </TabContent>
          )}

          {activeTab === "approvals" && (
            <TabContent
              key="approvals"
              title="Workflow Approvals"
              showAdd={false}
            >
              <ApprovalQueue />
            </TabContent>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ERP;
