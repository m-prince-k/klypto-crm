import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Settings from './pages/Settings';
import ERP from './pages/ERP';
import RecruitmentAssessment from './components/erp/RecruitmentAssessment';
import GrievanceManagement from './components/erp/GrievanceManagement';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import './index.css';



function App() {
  useKeyboardShortcuts([
    {
      key: 'k',
      ctrlKey: true,
      action: () => {
        const searchInput = document.querySelector('input[type="text"]');
        if (searchInput) searchInput.focus();
      }
    }
  ]);

  return (

    <Router>
      <div className="app-container" style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--bg-dark)' }}>
        <Sidebar />
        <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Navbar />
          <main style={{ padding: '24px', overflowY: 'auto', overflowX: 'hidden', flex: 1 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/erp" element={<ERP />} />
              <Route path="/recruitment" element={
                <div className="erp-tab-content">
                  <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "24px" }}>Recruitment & Assessment</h2>
                  <RecruitmentAssessment />
                </div>
              } />
              <Route path="/grievances" element={
                <div className="erp-tab-content">
                  <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "24px" }}>Grievance Management</h2>
                  <GrievanceManagement />
                </div>
              } />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
