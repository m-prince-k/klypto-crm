import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, change, icon, isPositive }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-card" 
    style={{ padding: '24px', flex: 1 }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
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
        {icon}
      </div>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '4px',
        color: isPositive ? '#10b981' : '#ef4444',
        fontSize: '14px',
        fontWeight: '600'
      }}>
        {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        {change}
      </div>
    </div>
    <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>{title}</div>
    <div style={{ fontSize: '28px', fontWeight: '700' }}>{value}</div>
  </motion.div>
);

const Dashboard = () => {
  const stats = [
    { title: 'Total Leads', value: '1,284', change: '+12.5%', icon: <Users size={24} />, isPositive: true },
    { title: 'Active Deals', value: '42', change: '+5.2%', icon: <Target size={24} />, isPositive: true },
    { title: 'Total Revenue', value: '$128,430', change: '-2.1%', icon: <DollarSign size={24} />, isPositive: false },
    { title: 'Conversion', value: '14.2%', change: '+1.8%', icon: <TrendingUp size={24} />, isPositive: true },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Executive Dashboard</h1>
        <p style={{ color: 'var(--text-muted)' }}>Welcome back, John. Here's what's happening today.</p>
      </header>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginBottom: '32px' }}>
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} style={{ minWidth: '200px' }} />
        ))}
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '24px' 
      }}>
        <div className="glass-card" style={{ padding: '24px', height: '400px', position: 'relative' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Revenue Performance</h3>
          <div style={{ 
            height: '280px', 
            width: '100%', 
            display: 'flex', 
            alignItems: 'flex-end', 
            gap: '12px',
            paddingBottom: '20px'
          }}>
            {[40, 60, 45, 90, 65, 80, 55, 100, 75, 85].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.1, duration: 1 }}
                style={{
                  flex: 1,
                  background: 'linear-gradient(to top, var(--primary), #8b5cf6)',
                  borderRadius: '6px 6px 0 0',
                  opacity: 0.8
                }}
              />
            ))}
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            color: 'var(--text-muted)',
            fontSize: '12px',
            paddingTop: '12px',
            borderTop: '1px solid var(--border)'
          }}>
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Recent Leads</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { name: 'Sarah Wilson', company: 'TechFlow', value: '$12k', status: 'Negotiation' },
              { name: 'Marcus Chen', company: 'Nova Labs', value: '$8.5k', status: 'Discovery' },
              { name: 'Elena Rodriguez', company: 'Soliaris', value: '$24k', status: 'Proposal' },
              { name: 'David Smith', company: 'Blue Water', value: '$4k', status: 'Initial Contact' },
            ].map((lead, i) => (
              <div key={i} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                paddingBottom: '16px',
                borderBottom: i !== 3 ? '1px solid var(--border)' : 'none'
              }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--avatar-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: 'var(--text-main)' }}>
                  {lead.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>{lead.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{lead.company}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>{lead.value}</div>
                  <div style={{ 
                    fontSize: '10px', 
                    color: 'var(--primary)', 
                    backgroundColor: 'var(--icon-bg)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    marginTop: '2px'
                  }}>{lead.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
