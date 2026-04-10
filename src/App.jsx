import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Settings from "./pages/Settings";
import RolesAccess from "./pages/RolesAccess";
import ERP from "./pages/ERP";
import RecruitmentAssessment from "./components/erp/RecruitmentAssessment";
import GrievanceManagement from "./components/erp/GrievanceManagement";
import Payroll from "./components/erp/Payroll";
import HRMS from "./pages/HRMS";
import Leave from "./pages/Leave";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { usePageSEO } from "./hooks/usePageSEO";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { restoreAuth } from "./store/auth/authSlice";
import { useState } from "react";
import "./index.css";

const SEOHelper = () => {
  usePageSEO();
  return null;
};

/**
 * Main App Layout Component
 * Only shown when user is authenticated
 */
function AppLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const EmployeesModule = () => <HRMS initialTab="employees" />;

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
            <Route
              path="/"
              element={
                <ProtectedRoute
                  Component={Dashboard}
                  requiredModules={["dashboard"]}
                />
              }
            />
            <Route
              path="/leads"
              element={
                <ProtectedRoute Component={Leads} requiredModules={["leads"]} />
              }
            />
            <Route
              path="/pipeline"
              element={
                <ProtectedRoute
                  Component={Leads}
                  requiredModules={["pipeline"]}
                />
              }
            />
            <Route
              path="/erp"
              element={
                <ProtectedRoute Component={ERP} requiredModules={["erp"]} />
              }
            />
            <Route
              path="/recruitment"
              element={
                <ProtectedRoute
                  Component={RecruitmentAssessment}
                  requiredModules={["recruitment"]}
                />
              }
            />
            <Route
              path="/grievances"
              element={
                <ProtectedRoute
                  Component={GrievanceManagement}
                  requiredModules={["grievances"]}
                />
              }
            />
            <Route
              path="/payroll"
              element={
                <ProtectedRoute
                  Component={Payroll}
                  requiredModules={["payroll"]}
                />
              }
            />
            <Route
              path="/hrms"
              element={
                <ProtectedRoute Component={HRMS} requiredModules={["hrms"]} />
              }
            />
            <Route
              path="/employees"
              element={
                <ProtectedRoute
                  Component={EmployeesModule}
                  requiredModules={["employees"]}
                />
              }
            />
            <Route
              path="/leave"
              element={
                <ProtectedRoute Component={Leave} requiredModules={["leave"]} />
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute
                  Component={Settings}
                  requiredModules={["settings"]}
                />
              }
            />
            <Route
              path="/roles-access"
              element={
                <ProtectedRoute
                  Component={RolesAccess}
                  requiredModules={["roles-access"]}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

/**
 * Main App Component
 * Handles routing between auth pages and protected app
 */
function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, accessToken } = useSelector((state) => state.auth);

  // Restore authentication on app load
  useEffect(() => {
    dispatch(restoreAuth());
  }, [dispatch]);

  return (
    <Router>
      <SEOHelper />
      <Routes>
        {/* Auth Routes - not protected */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected App Routes */}
        {isAuthenticated && accessToken ? (
          <Route path="/*" element={<AppLayout />} />
        ) : (
          <>
            {/* Redirect to login if not authenticated */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
