import React, { useState, useEffect } from "react";
import { ReceiptText, CheckCircle2, XCircle, Loader, Clock, User, Download, ExternalLink, X, Eye, Calendar, Wallet } from "lucide-react";
import apiClient from "../../api/apiClient";
import { toast } from "sonner";

const ReimbursementList = () => {
  const [reimbursements, setReimbursements] = useState([]);
  const [stats, setStats] = useState({ pendingExpenses: 0, totalReimbursed: 0, count: 0 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchData = async () => {
    try {
      const [listRes, statsRes] = await Promise.all([
        apiClient.get("/finance/reimbursements"),
        apiClient.get("/finance/reimbursements/stats"),
      ]);
      setReimbursements(listRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Error fetching reimbursement data", err);
      toast.error("Failed to load reimbursement data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    setActionLoading(id);
    try {
      await apiClient.patch(`/finance/reimbursements/${id}/status`, { status });
      toast.success(`Request marked as ${status}`);
      if (selectedRequest?.id === id) {
        setSelectedRequest(prev => ({ ...prev, status }));
      }
      await fetchData();
    } catch (err) {
      console.error("Error updating status", err);
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
      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        {[
          { label: "Pending Claims", value: `₹${stats.pendingExpenses.toLocaleString()}`, icon: <Clock size={16} />, color: "#f59e0b" },
          { label: "Total Reimbursed", value: `₹${stats.totalReimbursed.toLocaleString()}`, icon: <CheckCircle2 size={16} />, color: "#10b981" },
          { label: "Total Requests", value: stats.count.toString(), icon: <ReceiptText size={16} />, color: "#0ea5e9" },
        ].map((item) => (
          <div key={item.label} className="glass-card" style={{ padding: "16px", borderLeft: `4px solid ${item.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div style={{ color: item.color }}>{item.icon}</div>
              {/* <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)" }}>LIVE</span> */}
            </div>
            <div style={{ fontSize: "24px", fontWeight: "800" }}>{item.value}</div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* List Table */}
      <div className="glass-card" style={{ padding: "24px" }}>
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "700" }}>Recent Reimbursement Requests</h3>
        </div>

        {reimbursements.length === 0 ? (
          <div style={{ color: "var(--text-muted)", fontSize: "14px", textAlign: 'center', padding: '40px' }}>
            No reimbursement requests found.
          </div>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {reimbursements.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedRequest(item)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.5fr 1fr 1fr 0.8fr 1.2fr",
                  gap: "12px",
                  alignItems: "center",
                  padding: "16px",
                  borderRadius: "12px",
                  backgroundColor: "var(--column-bg)",
                  border: "1px solid var(--border)",
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                className="hover-card"
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--bg-card)', color: 'var(--primary)' }}>
                    <User size={16} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontWeight: "600" }}>{item.employee?.name}</span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{item.employee?.code}</span>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: "11px", display: "block", color: "var(--text-muted)", marginBottom: "2px" }}>Amount</span>
                  <span style={{ fontWeight: "700", color: "var(--primary)" }}>₹{item.amount.toLocaleString()}</span>
                </div>

                <div>
                  <span style={{ fontSize: "11px", display: "block", color: "var(--text-muted)", marginBottom: "2px" }}>Expense Date</span>
                  <span style={{ fontWeight: "500" }}>{item.date ? new Date(item.date).toLocaleDateString() : "N/A"}</span>
                </div>

                <div>
                  <span style={{ fontSize: "11px", display: "block", color: "var(--text-muted)", marginBottom: "2px" }}>Receipt</span>
                  {item.attachmentUrl ? (
                    <span style={{ color: "#10b981", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                      <CheckCircle2 size={12} /> ATTACHED
                    </span>
                  ) : (
                    <span style={{ color: "var(--text-muted)" }}>MISSING</span>
                  )}
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }} onClick={(e) => e.stopPropagation()}>
                  {item.status === "Pending" ? (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(item.id, "Approved")}
                        disabled={actionLoading === item.id}
                        className="btn-primary"
                        style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '6px' }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(item.id, "Rejected")}
                        disabled={actionLoading === item.id}
                        style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                      >
                        Reject
                      </button>
                    </>
                  ) : item.status === "Approved" ? (
                    <button
                      onClick={() => handleStatusUpdate(item.id, "Reimbursed")}
                      disabled={actionLoading === item.id}
                      style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }}
                    >
                      Mark Paid
                    </button>
                  ) : (
                    <div style={{ 
                      padding: '4px 10px', 
                      borderRadius: '20px', 
                      fontSize: '10px', 
                      fontWeight: '800',
                      background: item.status === "Reimbursed" ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: item.status === "Reimbursed" ? '#10b981' : '#ef4444'
                    }}>
                      {item.status.toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedRequest && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.8)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000,
          padding: "20px"
        }}>
          <div className="glass-card" style={{ width: "100%", maxWidth: "900px", padding: "0", overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 1fr", maxHeight: "85vh" }}>
            <div style={{ padding: "32px", overflowY: "auto", borderRight: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                <div>
                  <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "4px" }}>Claim Details</h2>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>Review expense and attachment</p>
                </div>
                <button onClick={() => setSelectedRequest(null)} style={{ padding: "8px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: "grid", gap: "20px" }}>
                <div style={{ padding: "16px", borderRadius: "12px", background: "var(--column-bg)", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "18px", fontWeight: "700" }}>
                      {selectedRequest.employee?.name?.[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: "700", fontSize: "16px" }}>{selectedRequest.employee?.name}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{selectedRequest.employee?.code} | {selectedRequest.employee?.department}</div>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>AMOUNT</span>
                      <div style={{ fontSize: "20px", fontWeight: "800", color: "var(--primary)" }}>₹{selectedRequest.amount.toLocaleString()}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>EXPENSE DATE</span>
                      <div style={{ fontSize: "16px", fontWeight: "600" }}>{selectedRequest.date ? new Date(selectedRequest.date).toLocaleDateString() : "N/A"}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "8px", fontWeight: "800" }}>DESCRIPTION / REASON</span>
                  <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", lineHeight: "1.6", fontSize: "14px" }}>
                    {selectedRequest.reason}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                  {selectedRequest.status === "Pending" ? (
                    <>
                      <button 
                        onClick={() => handleStatusUpdate(selectedRequest.id, "Approved")}
                        className="btn-primary" 
                        style={{ flex: 1, padding: "14px" }}
                      >
                        Approve Claim
                      </button>
                      <button 
                         onClick={() => handleStatusUpdate(selectedRequest.id, "Rejected")}
                        style={{ flex: 1, padding: "14px", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", borderRadius: "10px", fontWeight: "700", border: "1px solid rgba(239, 68, 68, 0.2)" }}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <div style={{ 
                      width: "100%", 
                      padding: "16px", 
                      borderRadius: "10px", 
                      textAlign: "center", 
                      fontWeight: "800",
                      background: selectedRequest.status === "Approved" || selectedRequest.status === "Reimbursed" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                      color: selectedRequest.status === "Approved" || selectedRequest.status === "Reimbursed" ? "#10b981" : "#ef4444"
                    }}>
                      STATUS: {selectedRequest.status.toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
              {selectedRequest.attachmentUrl ? (
                <>
                  <img 
                    src={selectedRequest.attachmentUrl} 
                    alt="Receipt" 
                    style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                  />
                  <div style={{ position: "absolute", bottom: "20px", display: "flex", gap: "10px" }}>
                    <a href={selectedRequest.attachmentUrl} target="_blank" rel="noreferrer" className="btn-primary" style={{ padding: "8px 16px", borderRadius: "20px", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <ExternalLink size={14} /> Open Full Size
                    </a>
                  </div>
                </>
              ) : (
                <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "40px" }}>
                  <div style={{ marginBottom: "12px", opacity: 0.2 }}><ReceiptText size={64} /></div>
                  <p style={{ fontWeight: "600" }}>No Bill/Receipt Attached</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReimbursementList;
