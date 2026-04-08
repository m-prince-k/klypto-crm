import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Settings from './pages/Settings';
import ERP from './pages/ERP';
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
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
