import React, { useState, useEffect } from 'react';
import { Box, MapPin, Calendar, DollarSign, Tag, Info, Plus, Loader, X, Trash2, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../../api/apiClient';

const AssetTracker = () => {
  const [assets, setAssets] = useState([]);
  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'IT Electronics',
    location: '',
    value: '',
    status: 'In Storage',
    employeeId: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // ID of asset being updated

  const fetchData = async () => {
    try {
      const [assetRes, statsRes, empRes] = await Promise.all([
        apiClient.get('/assets'),
        apiClient.get('/assets/stats'),
        apiClient.get('/employees/master')
      ]);
      setAssets(assetRes.data);
      setStats(statsRes.data);
      setEmployees(empRes.data);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = { ...formData, value: parseFloat(formData.value) || 0 };
      if (!data.employeeId) delete data.employeeId;
      
      await apiClient.post('/assets', data);
      setShowModal(false);
      setFormData({ name: '', category: 'IT Electronics', location: '', value: '', status: 'In Storage', employeeId: '' });
      fetchData();
    } catch (err) {
      alert("Failed to add asset");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    setActionLoading(id);
    try {
      await apiClient.patch(`/assets/${id}`, { status });
      fetchData();
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div style={{ height: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}><Loader className="spinner" size={32} /></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Total Inventory Value</div>
          <div style={{ fontSize: '24px', fontWeight: '800' }}>${stats?.totalValuation?.toLocaleString() || 0}</div>
        </div>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Assets in Use</div>
          <div style={{ fontSize: '24px', fontWeight: '800' }}>{stats?.inUse || 0}</div>
        </div>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Under Maintenance</div>
          <div style={{ fontSize: '24px', fontWeight: '800' }}><span style={{ color: '#ef4444' }}>{stats?.maintenance || 0}</span></div>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary" style={{ height: '100%', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Plus size={20} /> Add New Asset
        </button>
      </div>

      {/* Asset Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {assets.map((asset) => (
          <motion.div layout key={asset.id} className="glass-card" style={{ padding: '20px', display: 'flex', gap: '16px' }}>
            <div style={{ 
              width: '48px', height: '48px', borderRadius: '12px', 
              backgroundColor: 'var(--tag-bg)', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', color: 'var(--primary)'
            }}>
              <Box size={24} />
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '700' }}>{asset.name}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {actionLoading === asset.id && <Loader size={12} className="spinner" />}
                  <select 
                    value={asset.status} 
                    disabled={actionLoading === asset.id}
                    onChange={(e) => handleUpdateStatus(asset.id, e.target.value)}
                    style={{ 
                      fontSize: '10px', fontWeight: '800', padding: '2px 4px', borderRadius: '4px',
                      backgroundColor: 'var(--input-bg)', color: asset.status === 'In Use' ? '#10b981' : '#f59e0b',
                      border: 'none', cursor: 'pointer', outline: 'none'
                    }}
                  >
                    {['In Use', 'In Storage', 'Maintenance', 'Disposed'].map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>ID: {asset.id.substring(0,8)} • {asset.category}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <MapPin size={12} /> {asset.location}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <DollarSign size={12} /> ${asset.value?.toLocaleString()}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <UserIcon size={12} /> {asset.employee?.name || '-'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--primary)', cursor: 'pointer' }}>
                  <Info size={12} /> Details
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Asset Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Register New Asset</h2>
                <button onClick={() => setShowModal(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Asset Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--input-bg)', border: '1px solid var(--border)', color: 'white' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Category</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--input-bg)', border: '1px solid var(--border)', color: 'white' }}>
                      <option>IT Electronics</option>
                      <option>Furniture</option>
                      <option>Stationery</option>
                      <option>Software Licenses</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Value ($)</label>
                    <input type="number" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--input-bg)', border: '1px solid var(--border)', color: 'white' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Location</label>
                  <input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--input-bg)', border: '1px solid var(--border)', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Assign to Employee (Optional)</label>
                  <select value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--input-bg)', border: '1px solid var(--border)', color: 'white' }}>
                    <option value="">Unassigned</option>
                    {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>)}
                  </select>
                </div>
                 <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={submitting}
                  style={{ padding: '14px', borderRadius: '10px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  {submitting ? <Loader size={18} className="spinner" /> : "Register Asset"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AssetTracker;
