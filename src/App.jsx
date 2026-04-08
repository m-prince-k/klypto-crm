import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Settings from "./pages/Settings";
import ERP from "./pages/ERP";
import RecruitmentAssessment from "./components/erp/RecruitmentAssessment";
import GrievanceManagement from "./components/erp/GrievanceManagement";
import Payroll from "./components/erp/Payroll";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import HRMS from "./pages/HRMS";
import Leave from "./pages/Leave";
import { useState } from "react";
import "./index.css";

function App() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useKeyboardShortcuts([
    {
      key: "k",
      ctrlKey: true,
      action: () => {
        const searchInput = document.querySelector('input[type="text"]');
        if (searchInput) searchInput.focus();
      },
    },
  ]);

  return (
    <Router>
      <div
        className="app-container"
        style={{
          display: "flex",
          height: "100vh",
          overflow: "hidden",
          backgroundColor: "var(--bg-dark)",
        }}
      >
        {isMobileSidebarOpen && (
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.45)",
              zIndex: 25,
            }}
          />
        )}
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />
        <div
          className="main-content"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Navbar onMenuClick={() => setIsMobileSidebarOpen((prev) => !prev)} />
          <main
            style={{
              padding: "24px",
              overflowY: "auto",
              overflowX: "hidden",
              flex: 1,
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/pipeline" element={<Leads />} />
              <Route path="/erp" element={<ERP />} />
              <Route path="/recruitment" element={<RecruitmentAssessment />} />
              <Route path="/grievances" element={<GrievanceManagement />} />
              <Route path="/payroll" element={<Payroll />} />
              <Route path="/hrms" element={<HRMS />} />
              <Route path="/leave" element={<Leave />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
