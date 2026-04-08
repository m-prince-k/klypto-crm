import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Banknote, 
  Wallet, 
  Receipt, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  ArrowLeft,
  Calendar,
  Download,
  BarChart3,
  Scale,
  DollarSign,
  PieChart,
  UserCheck,
  Building
} from 'lucide-react';

const Payroll = () => {
  const [activeTab, setActiveTab] = useState('summary');
  const navigate = useNavigate();

  const salaryStructures = [
    { title: 'Standard Tech A', basic: '50%', hra: '20%', lta: '10%', special: '20%', employees: 42 },
    { title: 'Operations Level 1', basic: '60%', hra: '25%', lta: '5%', special: '10%', employees: 12 },
    { title: 'Sales Commission Base', basic: '40%', hra: '15%', lta: '5%', special: '40%', employees: 25 },
  ];

  const recentPayslips = [
    { id: 'PS-MAR-001', employee: 'John Doe', month: 'March 2024', net: '$4,200', status: 'Generated' },
    { id: 'PS-MAR-002', employee: 'Sarah Smith', month: 'March 2024', net: '$3,850', status: 'Pending' },
    { id: 'PS-MAR-003', employee: 'Michael Brown', month: 'March 2024', net: '$5,100', status: 'Generated' },
  ];

  const renderView = () => {
    switch (activeTab) {
      case 'summary':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
              {[
                { label: 'Total Payroll (March)', val: '$142,500', icon: <DollarSign size={18} />, color: 'var(--primary)' },
                { label: 'Total Employees', val: '124', icon: <UserCheck size={18} />, color: '#10b981' },
                { label: 'Tax Deductions', val: '$18,200', icon: <Scale size={18} />, color: '#f59e0b' },
                { label: 'Net Payable', val: '$124,300', icon: <Wallet size={18} />, color: '#8b5cf6' },
              ].map((stat, i) => (
                <div key={i} className="glass-card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'var(--tag-bg)', color: stat.color }}>{stat.icon}</div>
                    <BarChart3 size={16} color="var(--text-muted)" />
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '800' }}>{stat.val}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ fontWeight: '700', marginBottom: '20px' }}>Salary Structure Breakdown</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {salaryStructures.map((struct, i) => (
                    <div key={i} style={{ padding: '20px', backgroundColor: 'var(--tag-bg)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ fontWeight: '600' }}>{struct.title}</h4>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{struct.employees} Employees</span>
                      </div>
                      <div style={{ display: 'flex', gap: '4px', height: '12px', borderRadius: '6px', overflow: 'hidden', marginBottom: '12px' }}>
                        <div style={{ width: struct.basic, backgroundColor: 'var(--primary)' }} title="Basic"></div>
                        <div style={{ width: struct.hra, backgroundColor: '#10b981' }} title="HRA"></div>
                        <div style={{ width: struct.lta, backgroundColor: '#f59e0b' }} title="LTA"></div>
                        <div style={{ width: struct.special, backgroundColor: '#8b5cf6' }} title="Special Allowances"></div>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                        {[
                          { l: 'Basic', v: struct.basic, c: 'var(--primary)' },
                          { l: 'HRA', v: struct.hra, c: '#10b981' },
                          { l: 'LTA', v: struct.lta, c: '#f59e0b' },
                          { l: 'Special', v: struct.special, c: '#8b5cf6' },
                        ].map((item, j) => (
                          <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.c }}></div>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.l}: {item.v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ fontWeight: '700', marginBottom: '20px' }}>Recent Payslips</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {recentPayslips.map(ps => (
                    <div key={ps.id} style={{ padding: '16px', backgroundColor: 'var(--input-bg)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border)' }}>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '14px' }}>{ps.employee}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{ps.id} • {ps.month}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '700', color: ps.status === 'Generated' ? '#10b981' : 'var(--text-muted)' }}>{ps.net}</div>
                        <button style={{ color: 'var(--primary)', fontSize: '11px', fontWeight: '700', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Download size={12} /> View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn-primary" style={{ width: '100%', marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                   Generate Bulk Payslips
                </button>
              </div>
            </div>
          </div>
        );

      case 'compliance':
        return (
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontWeight: '700', marginBottom: '24px' }}>Tax & Statutory Compliance</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {[
                { title: 'TDS Management', desc: 'Auto-calculated Tax Deducted at Source based on income slabs.', icon: <Scale size={20} /> },
                { title: 'PF / ESI Support', desc: 'Provident Fund and Employee State Insurance contributions.', icon: <Building size={20} /> },
                { title: 'Professional Tax', desc: 'State-wise Professional Tax (PT) deduction rules.', icon: <PieChart size={20} /> },
              ].map((comp, i) => (
                <div key={i} style={{ padding: '24px', backgroundColor: 'var(--tag-bg)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                   <div style={{ padding: '10px', width: 'fit-content', backgroundColor: 'var(--icon-bg)', borderRadius: '10px', color: 'var(--primary)', marginBottom: '16px' }}>{comp.icon}</div>
                   <h4 style={{ fontWeight: '700', marginBottom: '10px' }}>{comp.title}</h4>
                   <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{comp.desc}</p>
                   <button style={{ marginTop: '16px', color: 'var(--primary)', fontSize: '13px', fontWeight: '600' }}>Configure Rules →</button>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: '32px', padding: '24px', backgroundColor: 'rgba(245, 158, 11, 0.05)', border: '1px dashed #f59e0b', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#f59e0b', marginBottom: '10px' }}>
                <AlertCircle size={20} />
                <h4 style={{ fontWeight: '700' }}>Tax Filing Reminder</h4>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>The quarterly TDS return (Form 24Q) is due in 12 days. Please ensure all payroll approvals for March are finalized.</p>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontWeight: '700' }}>Payroll Analytics & Reports</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                 <button style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '13px' }}>Export PDF</button>
                 <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <Download size={16} /> Export CSV
                 </button>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { name: 'Monthly Salary Register', type: 'Financial', size: '2.4 MB', updated: 'Today' },
                { name: 'Tax Deduction Summary', type: 'Compliance', size: '1.2 MB', updated: '2 days ago' },
                { name: 'Employee Reimbursement Log', type: 'Claims', size: '850 KB', updated: '1 week ago' },
                { name: 'PF Contribution Statement', type: 'Statutory', size: '3.1 MB', updated: 'Mar 15' },
              ].map((rep, i) => (
                <div key={i} style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--input-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    <FileText size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600' }}>{rep.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{rep.type} • {rep.size}</div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '11px', color: 'var(--text-muted)' }}>
                    Updated: {rep.updated}
                  </div>
                  <button style={{ color: 'var(--text-muted)' }}><Download size={18} /></button>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          onClick={() => navigate(-1)} 
          className="glass-card" 
          style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Payroll Management</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Manage employee compensations, taxes, and reports.</p>
        </div>
      </header>

      <div style={{ 
        display: 'flex', 
        gap: '4px', 
        padding: '4px', 
        backgroundColor: 'var(--input-bg)', 
        borderRadius: '10px',
        width: 'fit-content'
      }}>
        {[
          { id: 'summary', label: 'Overview', icon: <PieChart size={16} /> },
          { id: 'compliance', label: 'Compliance', icon: <Scale size={16} /> },
          { id: 'reports', label: 'Financial Reports', icon: <BarChart3 size={16} /> },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              color: activeTab === t.id ? 'white' : 'var(--text-muted)',
              backgroundColor: activeTab === t.id ? 'var(--primary)' : 'transparent',
            }}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      <main>
        {renderView()}
      </main>
    </div>
  );
};

export default Payroll;
