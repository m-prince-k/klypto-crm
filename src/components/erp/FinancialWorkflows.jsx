import React, { useState } from 'react';
import { ShoppingCart, FileText, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const FinancialWorkflows = () => {
  const [view, setView] = useState('purchases');

  const data = {
    purchases: [
      { id: 'PO-2024-001', vendor: 'Cloud Infra Services', amount: '$4,200', date: '2024-03-25', status: 'Pending', items: 3 },
      { id: 'PO-2024-002', vendor: 'Office Supplies Co', amount: '$850', date: '2024-03-24', status: 'Approved', items: 12 },
      { id: 'PO-2024-003', vendor: 'Global Logistics Ltd', amount: '$1,500', date: '2024-03-22', status: 'Fulfilled', items: 1 },
    ],
    invoices: [
      { id: 'INV-2024-88', customer: 'Global Tech Solutions', amount: '$12,400', date: '2024-03-26', status: 'Draft', due: '2024-04-26' },
      { id: 'INV-2024-87', customer: 'Infinite Media Group', amount: '$3,500', date: '2024-03-20', status: 'Paid', due: '2024-04-20' },
      { id: 'INV-2024-86', customer: 'Precision Engineering', amount: '$8,200', date: '2024-03-15', status: 'Overdue', due: '2024-03-30' },
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
      case 'Paid':
      case 'Fulfilled':
        return '#10b981';
      case 'Pending':
      case 'Draft':
        return '#f59e0b';
      case 'Overdue':
      case 'Rejected':
        return '#ef4444';
      default:
        return 'var(--text-muted)';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <button 
          onClick={() => setView('purchases')}
          className="glass-card" 
          style={{ 
            padding: '24px', 
            textAlign: 'left',
            border: view === 'purchases' ? '1px solid var(--primary)' : '1px solid var(--border)',
            backgroundColor: view === 'purchases' ? 'var(--icon-bg)' : 'var(--bg-card)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ padding: '8px', backgroundColor: 'var(--primary)', borderRadius: '8px', color: 'white' }}>
              <ShoppingCart size={20} />
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: '600' }}>Purchase Orders</h4>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Manage procurement and vendor payments.</p>
        </button>

        <button 
          onClick={() => setView('invoices')}
          className="glass-card" 
          style={{ 
            padding: '24px', 
            textAlign: 'left',
            border: view === 'invoices' ? '1px solid var(--primary)' : '1px solid var(--border)',
            backgroundColor: view === 'invoices' ? 'var(--icon-bg)' : 'var(--bg-card)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ padding: '8px', backgroundColor: '#8b5cf6', borderRadius: '8px', color: 'white' }}>
              <FileText size={20} />
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: '600' }}>Sales Invoices</h4>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Track client billing and receivables.</p>
        </button>
      </div>

      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
          Recent {view === 'purchases' ? 'Purchase Orders' : 'Invoices'}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {data[view].map((item) => (
            <div 
              key={item.id} 
              style={{ 
                padding: '16px', 
                backgroundColor: 'var(--tag-bg)', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                border: '1px solid var(--border)'
              }}
            >
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '10px', 
                backgroundColor: 'var(--input-bg)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: view === 'purchases' ? 'var(--primary)' : '#8b5cf6'
              }}>
                {view === 'purchases' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <span style={{ fontWeight: '600', fontSize: '15px' }}>{item.id}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>• {item.date}</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  {view === 'purchases' ? item.vendor : item.customer}
                </div>
              </div>

              <div style={{ textAlign: 'right', minWidth: '100px' }}>
                <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>{item.amount}</div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px', 
                  fontSize: '11px', 
                  fontWeight: '700',
                  color: getStatusColor(item.status),
                  justifyContent: 'flex-end'
                }}>
                  {item.status === 'Approved' || item.status === 'Paid' ? <CheckCircle2 size={12} /> : 
                   item.status === 'Overdue' ? <AlertCircle size={12} /> : <Clock size={12} />}
                  {item.status.toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinancialWorkflows;
