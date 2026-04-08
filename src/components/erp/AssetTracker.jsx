import React from 'react';
import { Box, MapPin, Calendar, DollarSign, Tag, Info } from 'lucide-react';

const AssetTracker = () => {
  const assets = [
    { id: 'AS-001', name: 'MacBook Pro M3 Max', category: 'IT Electronics', location: 'HQ - San Francisco', value: '$3,500', status: 'In Use', user: 'David W.' },
    { id: 'AS-002', name: 'Ergonomic Desk White', category: 'Furniture', location: 'NY Office', value: '$850', status: 'In Use', user: 'Sarah M.' },
    { id: 'AS-003', name: 'Dell UltraSharp 32"', category: 'IT Electronics', location: 'HQ - San Francisco', value: '$1,200', status: 'In Storage', user: '-' },
    { id: 'AS-004', name: 'Conference Table 10-Seater', category: 'Furniture', location: 'London Hub', value: '$4,500', status: 'Maintenance', user: '-' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {assets.map((asset) => (
          <div key={asset.id} className="glass-card" style={{ padding: '20px', display: 'flex', gap: '16px' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '12px', 
              backgroundColor: 'var(--icon-bg)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--primary)'
            }}>
              <Box size={24} />
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '700' }}>{asset.name}</h4>
                <span style={{ 
                  fontSize: '10px', 
                  fontWeight: '800', 
                  padding: '2px 6px', 
                  borderRadius: '4px',
                  backgroundColor: asset.status === 'In Use' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: asset.status === 'In Use' ? '#10b981' : '#ef4444'
                }}>
                  {asset.status.toUpperCase()}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>ID: {asset.id} • {asset.category}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <MapPin size={12} /> {asset.location.split(' - ')[0]}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <DollarSign size={12} /> {asset.value}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <Tag size={12} /> {asset.user}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--primary)', cursor: 'pointer' }}>
                  <Info size={12} /> Details
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetTracker;
