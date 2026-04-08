import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreVertical, Calendar, MessageSquare, Tag, X, Send, User, Mail, Building, Phone } from 'lucide-react';


const KanbanCard = ({ lead, onClick }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.02 }}
    onClick={() => onClick(lead)}
    className="glass-card"
    style={{ 
      padding: '16px', 
      marginBottom: '12px', 
      cursor: 'pointer',
      background: 'var(--card-hover)'
    }}
  >

    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
      <span style={{ 
        fontSize: '10px', 
        fontWeight: 'bold', 
        textTransform: 'uppercase', 
        color: lead.priority === 'High' ? '#ef4444' : '#f59e0b'
      }}>
        {lead.priority}
      </span>
      <MoreVertical size={14} style={{ color: 'var(--text-muted)' }} />
    </div>
    <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>{lead.name}</div>
    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>{lead.company}</div>
    
    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
      {lead.tags.map(tag => (
        <span key={tag} style={{ 
          fontSize: '10px', 
          backgroundColor: 'var(--tag-bg)', 
          padding: '2px 6px', 
          borderRadius: '4px',
          color: 'var(--text-muted)',
          border: '1px solid var(--border)'
        }}>{tag}</span>
      ))}
    </div>

    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      paddingTop: '12px',
      borderTop: '1px solid var(--border)',
      color: 'var(--text-muted)',
      fontSize: '12px'
    }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MessageSquare size={12} /> 3</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> Apr 12</span>
      </div>
      <div style={{ 
        width: '24px', 
        height: '24px', 
        borderRadius: '50%', 
        backgroundColor: 'var(--primary)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontSize: '10px',
        color: 'white'
      }}>{lead.name[0]}</div>
    </div>
  </motion.div>
);

const LeadSidePanel = ({ lead, onClose }) => {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([
    { id: 1, text: 'Met at the conference, interested in enterprise tier.', date: '3 days ago' },
    { id: 2, text: 'Sent follow-up email with pricing details.', date: 'Yesterday' }
  ]);

  const handleAddNote = () => {
    if (!note.trim()) return;
    setNotes([{ id: Date.now(), text: note, date: 'Just now' }, ...notes]);
    setNote('');
  };

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      style={{
        position: 'fixed',
        right: 0,
        top: 0,
        width: '100%',
        maxWidth: '450px',
        height: '100vh',
        backgroundColor: 'var(--bg-sidebar)',
        borderLeft: '1px solid var(--border)',
        zIndex: 100,
        boxShadow: '-10px 0 30px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Lead Details</h2>
        <button onClick={onClose} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
      </div>

      <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
            {lead.name[0]}
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: '700' }}>{lead.name}</div>
            <div style={{ color: 'var(--text-muted)' }}>{lead.company}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div className="glass-card" style={{ padding: '12px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Email</div>
            <div style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', wordBreak: 'break-all' }}><Mail size={14} style={{flexShrink: 0}} /> {lead.name.toLowerCase().replace(' ', '.')}@example.com</div>
          </div>
          <div className="glass-card" style={{ padding: '12px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Phone</div>
            <div style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={14} /> +1 (555) 000-0000</div>
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Notes</h3>
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a rich note..."
              style={{
                width: '100%',
                height: '100px',
                backgroundColor: 'var(--input-bg)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '12px',
                color: 'var(--text-main)',
                fontSize: '14px',
                outline: 'none',
                resize: 'none'
              }}
            />
            <button 
              onClick={handleAddNote}
              style={{
                position: 'absolute',
                right: '12px',
                bottom: '12px',
                backgroundColor: 'var(--primary)',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Send size={14} /> Save Note
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {notes.map(n => (
              <div key={n.id} style={{ 
                padding: '12px', 
                backgroundColor: 'var(--column-bg)', 
                borderRadius: '10px',
                border: '1px solid var(--border)'
              }}>
                <div style={{ fontSize: '13px', marginBottom: '4px' }}>{n.text}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{n.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Leads = () => {
  const [selectedLead, setSelectedLead] = useState(null);
  const [columns, setColumns] = useState([

    { id: 'new', title: 'New Leads', leads: [
      { id: 1, name: 'Alice Freeman', company: 'Digital Pulse', priority: 'High', tags: ['SaaS', 'New'] },
      { id: 2, name: 'Bob Smith', company: 'Skyline Inc', priority: 'Medium', tags: ['Enterprise'] }
    ]},
    { id: 'discovery', title: 'Discovery', leads: [
      { id: 3, name: 'Charlie Day', company: 'Paddy\'s Pub', priority: 'High', tags: ['Hospitality'] }
    ]},
    { id: 'proposal', title: 'Proposal', leads: [
      { id: 4, name: 'Diana Prince', company: 'Themyscira Corp', priority: 'Medium', tags: ['Government'] }
    ]},
    { id: 'closed', title: 'Negotiation', leads: [
      { id: 5, name: 'Eve Online', company: 'CCP Labs', priority: 'High', tags: ['Gaming'] }
    ]}
  ]);

  return (
    <div style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Pipeline</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Manage and track your lead progression</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <button className="glass-card" style={{ padding: '8px 16px', fontSize: '14px' }}>Board View</button>
          <button className="glass-card" style={{ padding: '8px 16px', fontSize: '14px', opacity: 0.5 }}>Table View</button>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} /> Add Lead
          </button>
        </div>
      </header>

      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        flex: 1, 
        overflowX: 'auto', 
        paddingBottom: '20px'
      }}>
        {columns.map(column => (
          <div key={column.id} style={{ minWidth: '300px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '0 8px 16px 8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>{column.title}</span>
                <span style={{ 
                  backgroundColor: 'var(--glass)', 
                  padding: '2px 8px', 
                  borderRadius: '10px', 
                  fontSize: '12px',
                  color: 'var(--text-muted)'
                }}>{column.leads.length}</span>
              </div>
              <Plus size={16} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
            </div>
            
            <div style={{ 
              backgroundColor: 'var(--column-bg)', 
              borderRadius: '12px', 
              padding: '12px', 
              flex: 1,
              border: '1px solid var(--border)'
            }}>
              <AnimatePresence>
                {column.leads.map(lead => (
                  <KanbanCard key={lead.id} lead={lead} onClick={setSelectedLead} />
                ))}
              </AnimatePresence>
              <button style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px dashed var(--border)', 
                borderRadius: '8px',
                color: 'var(--text-muted)',
                fontSize: '13px',
                marginTop: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.color = 'var(--text-main)'; }}
              onMouseLeave={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-muted)'; }}
              >
                + Drop lead here or click to add
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedLead && (
          <LeadSidePanel 
            lead={selectedLead} 
            onClose={() => setSelectedLead(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Leads;
