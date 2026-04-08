import React, { useState } from 'react';
import { Search, UserPlus, Filter, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

const PartnerMaster = () => {
  const [activeSubTab, setActiveSubTab] = useState('customers');

  const partners = {
    customers: [
      { id: 'C1', name: 'Global Tech Solutions', contact: 'John Carter', email: 'john@gt-solutions.com', phone: '+1 415 555 0122', status: 'Active', credit: '$50,000' },
      { id: 'C2', name: 'Infinite Media Group', contact: 'Sarah Miller', email: 'sarah@infinite.io', phone: '+1 415 555 0199', status: 'Active', credit: '$25,000' },
      { id: 'C3', name: 'Precision Engineering', contact: 'Mike Ross', email: 'mike@precision.eng', phone: '+1 415 555 0144', status: 'On Hold', credit: '$10,000' },
    ],
    vendors: [
      { id: 'V1', name: 'Cloud Infra Services', contact: 'Tech Support', email: 'billing@cloudinfra.com', phone: '+1 800 555 0100', status: 'Preferred', category: 'Software' },
      { id: 'V2', name: 'Global Logistics Ltd', contact: "James O Brien", email: 'james@global-log.com', phone: '+1 800 555 0111', status: 'Active', category: 'Logistics' },
      { id: 'V3', name: 'Office Supplies Co', contact: 'Reception', email: 'orders@officesupplies.com', phone: '+1 800 555 0222', status: 'Active', category: 'General' },
    ]
  };

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--tag-bg)', padding: '4px', borderRadius: '8px' }}>
          <button 
            onClick={() => setActiveSubTab('customers')}
            style={{ 
              padding: '8px 16px', 
              borderRadius: '6px', 
              fontSize: '14px', 
              fontWeight: '600',
              backgroundColor: activeSubTab === 'customers' ? 'var(--primary)' : 'transparent',
              color: activeSubTab === 'customers' ? 'white' : 'var(--text-muted)'
            }}
          >
            Customers
          </button>
          <button 
            onClick={() => setActiveSubTab('vendors')}
            style={{ 
              padding: '8px 16px', 
              borderRadius: '6px', 
              fontSize: '14px', 
              fontWeight: '600',
              backgroundColor: activeSubTab === 'vendors' ? 'var(--primary)' : 'transparent',
              color: activeSubTab === 'vendors' ? 'white' : 'var(--text-muted)'
            }}
          >
            Vendors
          </button>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder={`Search ${activeSubTab}...`}
              style={{ padding: '8px 12px 8px 36px', backgroundColor: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '14px', outline: 'none', width: '240px' }}
            />
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '14px' }}>
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '500' }}>Name</th>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '500' }}>Contact</th>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '500' }}>Details</th>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '500' }}>Status</th>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '500' }}>{activeSubTab === 'customers' ? 'Credit Limit' : 'Category'}</th>
              <th style={{ padding: '16px' }}></th>
            </tr>
          </thead>
          <tbody>
            {partners[activeSubTab].map((partner) => (
              <tr key={partner.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s', cursor: 'pointer' }}>
                <td style={{ padding: '16px' }}>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>{partner.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ID: {partner.id}</div>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ fontSize: '14px' }}>{partner.contact}</div>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px', color: 'var(--text-muted)' }}>
                    <Mail size={14} /> <Phone size={14} /> <MapPin size={14} />
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '11px', 
                    fontWeight: '700', 
                    backgroundColor: partner.status === 'Active' || partner.status === 'Preferred' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    color: partner.status === 'Active' || partner.status === 'Preferred' ? '#10b981' : '#f59e0b'
                  }}>
                    {partner.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '16px', fontSize: '14px', fontWeight: '500' }}>
                  {activeSubTab === 'customers' ? partner.credit : partner.category}
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button style={{ color: 'var(--text-muted)' }}><ExternalLink size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PartnerMaster;
