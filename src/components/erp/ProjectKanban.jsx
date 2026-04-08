import React from 'react';
import { MoreHorizontal, Plus, Calendar, User } from 'lucide-react';

const ProjectKanban = () => {
  const columns = [
    {
      id: 'todo',
      title: 'To Do',
      tasks: [
        { id: 'T-1', title: 'Q1 Inventory Audit', priority: 'High', date: 'Apr 15', user: 'AW' },
        { id: 'T-2', title: 'Vendor Onboarding-Cloud', priority: 'Medium', date: 'Apr 20', user: 'SM' },
      ]
    },
    {
      id: 'inprogress',
      title: 'In Progress',
      tasks: [
        { id: 'T-3', title: 'Invoice Automation Sync', priority: 'Critical', date: 'Apr 10', user: 'RD' },
      ]
    },
    {
      id: 'review',
      title: 'Review',
      tasks: [
        { id: 'T-4', title: 'Asset Depreciation Run', priority: 'Medium', date: 'Apr 05', user: 'JC' },
      ]
    },
    {
      id: 'done',
      title: 'Done',
      tasks: [
        { id: 'T-5', title: 'FY23 Tax Filing', priority: 'High', date: 'Mar 31', user: 'AW' },
      ]
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return '#ef4444';
      case 'High': return '#f59e0b';
      case 'Medium': return '#3b82f6';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', height: 'fit-content' }}>
      {columns.map(column => (
        <div key={column.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: '700', fontSize: '14px' }}>{column.title}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', backgroundColor: 'var(--tag-bg)', padding: '2px 8px', borderRadius: '10px' }}>{column.tasks.length}</span>
            </div>
            <button style={{ color: 'var(--text-muted)' }}><Plus size={18} /></button>
          </div>

          <div 
            style={{ 
              backgroundColor: 'var(--column-bg)', 
              borderRadius: '12px', 
              padding: '12px', 
              minHeight: '200px',
              border: '1px solid var(--border)'
            }}
          >
            {column.tasks.map(task => (
              <div 
                key={task.id} 
                className="glass-card" 
                style={{ 
                  padding: '16px', 
                  marginBottom: '12px', 
                  cursor: 'grab'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ 
                    fontSize: '10px', 
                    fontWeight: '800', 
                    color: getPriorityColor(task.priority),
                    backgroundColor: `${getPriorityColor(task.priority)}15`,
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    {task.priority.toUpperCase()}
                  </span>
                  <button style={{ color: 'var(--text-muted)' }}><MoreHorizontal size={14} /></button>
                </div>
                <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>{task.title}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <Calendar size={12} /> {task.date}
                  </div>
                  <div style={{ 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--avatar-bg)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: '700'
                  }}>
                    {task.user}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectKanban;
