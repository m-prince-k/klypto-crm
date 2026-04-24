import React, { useState, useEffect } from "react";
import { UserMinus, CheckCircle2, XCircle, Loader, Clock, User, AlertCircle, FileText, X, Calendar, ClipboardList, Briefcase, IndianRupee } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "../../api/apiClient";
import { toast } from "sonner";

const ResignationList = () => {
  const [resignations, setResignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedResignation, setSelectedResignation] = useState(null);

  const fetchData = async () => {
    try {
      const res = await apiClient.get("/hr-resignations");
      setResignations(res.data);
      
      // Keep selected resignation in sync if it exists
      if (selectedResignation) {
        const updated = res.data.find(r => r.id === selectedResignation.id);
        if (updated) setSelectedResignation(updated);
      }
    } catch (err) {
      console.error("Error fetching resignation data", err);
      toast.error("Failed to load resignation data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = async (id, data) => {
    setActionLoading(id);
    try {
      await apiClient.patch(`/hr-resignations/${id}/status`, data);
      toast.success("Resignation status updated");
      await fetchData();
    } catch (err) {
      console.error("Error updating resignation", err);
      toast.error("Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
        <Loader className="spinner" size={24} color="var(--text-muted)" />
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      <div className="glass-card" style={{ padding: "24px" }}>
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "700" }}>Resignation Tracking</h3>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Manage employee exits, notice periods, and FNF settlement.</p>
        </div>

        {resignations.length === 0 ? (
          <div style={{ color: "var(--text-muted)", fontSize: "14px", textAlign: 'center', padding: '40px' }}>
            No resignation requests found.
          </div>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {resignations.map((item) => {
              const submissionDate = new Date(item.submissionDate);
              const lastWorkingDay = new Date(item.proposedLastWorkingDay);
              
              return (
                <div
                  key={item.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.2fr 1fr 1.2fr 1fr 0.8fr",
                    gap: "16px",
                    alignItems: "center",
                    padding: "20px",
                    borderRadius: "12px",
                    backgroundColor: "var(--column-bg)",
                    border: "1px solid var(--border)",
                    fontSize: "13px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ 
                      width: "40px", 
                      height: "40px", 
                      borderRadius: "10px", 
                      background: "rgba(239, 68, 68, 0.1)", 
                      color: "#ef4444",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <UserMinus size={20} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontWeight: "700", fontSize: "14px" }}>{item.employee?.name}</span>
                      <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{item.employee?.department} | {item.employee?.role}</span>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: "11px", display: "block", color: "var(--text-muted)", marginBottom: "4px" }}>Timeline</span>
                    <div style={{ fontWeight: "600" }}>
                      Sub: {submissionDate.toLocaleDateString()}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--primary)", fontWeight: "700" }}>
                      LWD: {lastWorkingDay.toLocaleDateString()}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: "11px", display: "block", color: "var(--text-muted)", marginBottom: "4px" }}>Resignation Detail</span>
                    <div style={{ fontWeight: "500", maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.reason}>
                      {item.reason}
                    </div>
                    <button 
                      onClick={() => setSelectedResignation(item)}
                      style={{ 
                        fontSize: "11px", 
                        color: "var(--primary)", 
                        background: 'none', 
                        border: 'none', 
                        padding: 0, 
                        fontWeight: '700',
                        cursor: 'pointer',
                        marginTop: '4px'
                      }}
                    >
                      Read Full Detail & Plan
                    </button>
                  </div>

                  <div>
                    <span style={{ fontSize: "11px", display: "block", color: "var(--text-muted)", marginBottom: "4px" }}>Status</span>
                    <div style={{ 
                      display: 'inline-block',
                      padding: '4px 10px', 
                      borderRadius: '20px', 
                      fontSize: '11px', 
                      fontWeight: '800',
                      background: item.status === "Approved" ? 'rgba(16, 185, 129, 0.1)' : item.status === "Pending" ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: item.status === "Approved" ? '#10b981' : item.status === "Pending" ? '#f59e0b' : '#ef4444'
                    }}>
                      {item.status.toUpperCase()}
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => setSelectedResignation(item)}
                      className="btn-primary"
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <FileText size={14} /> Review
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedResignation && (
          <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card" 
              style={{ width: '100%', maxWidth: '700px', padding: '32px', position: 'relative', border: '1px solid var(--border)' }}
            >
              <button 
                onClick={() => setSelectedResignation(null)}
                style={{ position: 'absolute', top: '24px', right: '24px', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserMinus size={28} />
                </div>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>Resignation Review</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Employee exit process for <strong>{selectedResignation.employee?.name}</strong></p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Calendar size={18} color="var(--primary)" />
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Submission Date</div>
                      <div style={{ fontWeight: '600' }}>{new Date(selectedResignation.submissionDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Clock size={18} color="#ef4444" />
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Last Working Day</div>
                      <div style={{ fontWeight: '600', color: '#ef4444' }}>{new Date(selectedResignation.proposedLastWorkingDay).toLocaleDateString(undefined, { dateStyle: 'long' })}</div>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Briefcase size={18} color="var(--primary)" />
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Department & Role</div>
                      <div style={{ fontWeight: '600' }}>{selectedResignation.employee?.department} | {selectedResignation.employee?.role}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <AlertCircle size={18} color="var(--primary)" />
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Notice Period</div>
                      <div style={{ fontWeight: '600' }}>{selectedResignation.noticePeriod} Days (Standard)</div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={16} color="var(--primary)" /> Reason for Resignation
                </h4>
                <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', fontSize: '14px', lineHeight: '1.6', color: 'var(--text-main)' }}>
                  {selectedResignation.reason}
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ClipboardList size={16} color="var(--primary)" /> Handover Plan & Tasks
                </h4>
                <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', fontSize: '14px', lineHeight: '1.6', color: 'var(--text-main)', minHeight: '80px' }}>
                  {selectedResignation.handoverPlan || "No handover plan provided."}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedResignation.companyAssetsHandover}
                      onChange={(e) => handleUpdate(selectedResignation.id, { companyAssetsHandover: e.target.checked })}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>Assets Returned</span>
                  </div>
                  
                  {selectedResignation.status === "Approved" && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <IndianRupee size={16} color="var(--primary)" />
                      <select 
                        value={selectedResignation.fnfStatus}
                        onChange={(e) => handleUpdate(selectedResignation.id, { fnfStatus: e.target.value })}
                        style={{ padding: '4px 8px', borderRadius: '6px', background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: '12px', color: 'var(--text-main)', cursor: 'pointer' }}
                      >
                        <option value="Pending">FNF: Pending</option>
                        <option value="In Progress">FNF: In Progress</option>
                        <option value="Settled">FNF: Settled</option>
                      </select>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  {selectedResignation.status === "Pending" ? (
                    <>
                      <button 
                        onClick={() => handleUpdate(selectedResignation.id, { status: "Rejected" })}
                        disabled={actionLoading}
                        className="btn-secondary"
                        style={{ padding: '10px 24px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                      >
                        {actionLoading === selectedResignation.id ? <Loader size={18} className="spinner" /> : <><XCircle size={18} /> Reject</>}
                      </button>
                      <button 
                        onClick={() => handleUpdate(selectedResignation.id, { status: "Approved" })}
                        disabled={actionLoading}
                        className="btn-primary"
                        style={{ padding: '10px 24px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}
                      >
                        {actionLoading === selectedResignation.id ? <Loader size={18} className="spinner" /> : <><CheckCircle2 size={18} /> Approve</>}
                      </button>
                    </>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>
                      {selectedResignation.status === "Approved" ? <CheckCircle2 size={18} color="#10b981" /> : <XCircle size={18} color="#ef4444" />}
                      <span style={{ fontWeight: '800', color: selectedResignation.status === "Approved" ? '#10b981' : '#ef4444' }}>
                        {selectedResignation.status?.toUpperCase() || ""}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResignationList;
