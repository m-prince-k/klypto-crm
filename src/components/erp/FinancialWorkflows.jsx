import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  FileText,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Loader,
  X,
  Target,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "../../api/apiClient";

const FinancialWorkflows = () => {
  const [view, setView] = useState("purchases"); // 'purchases' (PURCHASE_ORDER) or 'invoices' (INVOICE)
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    referenceNumber: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    status: "Pending",
    partnerId: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // ID of transaction being updated

  const fetchData = async () => {
    setLoading(true);
    try {
      const type = view === "purchases" ? "PURCHASE_ORDER" : "INVOICE";
      const partnerType = view === "purchases" ? "VENDOR" : "CUSTOMER";
      
      const [transRes, statsRes, partnerRes] = await Promise.all([
        apiClient.get(`/finance?type=${type}`),
        apiClient.get("/finance/stats"),
        apiClient.get(`/partners?type=${partnerType}`)
      ]);
      
      setTransactions(transRes.data);
      setStats(statsRes.data);
      setPartners(partnerRes.data);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [view]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const type = view === "purchases" ? "PURCHASE_ORDER" : "INVOICE";
      await apiClient.post("/finance", {
        ...formData,
        type,
        amount: parseFloat(formData.amount) || 0
      });
      setShowModal(false);
      setFormData({ referenceNumber: "", amount: "", date: new Date().toISOString().split("T")[0], status: "Pending", partnerId: "" });
      fetchData();
    } catch (err) {
      alert("Failed to create transaction");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    setActionLoading(id);
    try {
      await apiClient.patch(`/finance/${id}`, { status });
      fetchData();
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
      case "Paid":
      case "Fulfilled": return "#10b981";
      case "Pending":
      case "Draft": return "#f59e0b";
      case "Overdue":
      case "Rejected": return "#ef4444";
      default: return "var(--text-muted)";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Stats Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
        <div className="glass-card" style={{ padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>Outstanding Receivables</div>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "#8b5cf6" }}>${stats?.totalReceivables?.toLocaleString() || 0}</div>
          </div>
          <FileText size={32} style={{ opacity: 0.2 }} />
        </div>
        <div className="glass-card" style={{ padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>Pending Payables</div>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--primary)" }}>${stats?.totalPayables?.toLocaleString() || 0}</div>
          </div>
          <ShoppingCart size={32} style={{ opacity: 0.2 }} />
        </div>
      </div>

      <div className="responsive-grid-2 erp-finance-switch" style={{ display: "grid", gap: "20px" }}>
        <button
          onClick={() => setView("purchases")}
          className="glass-card"
          style={{
            padding: "24px", textAlign: "left", transition: "all 0.2s",
            border: view === "purchases" ? "1px solid var(--primary)" : "1px solid var(--border)",
            backgroundColor: view === "purchases" ? "rgba(var(--primary-rgb), 0.05)" : "var(--bg-card)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{ padding: "8px", backgroundColor: "var(--primary)", borderRadius: "8px", color: "white" }}><ShoppingCart size={20} /></div>
            <h4 style={{ fontSize: "16px", fontWeight: "600" }}>Purchase Orders</h4>
          </div>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Manage procurement and vendor payments.</p>
        </button>

        <button
          onClick={() => setView("invoices")}
          className="glass-card"
          style={{
            padding: "24px", textAlign: "left", transition: "all 0.2s",
            border: view === "invoices" ? "1px solid #8b5cf6" : "1px solid var(--border)",
            backgroundColor: view === "invoices" ? "rgba(139, 92, 246, 0.05)" : "var(--bg-card)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{ padding: "8px", backgroundColor: "#8b5cf6", borderRadius: "8px", color: "white" }}><FileText size={20} /></div>
            <h4 style={{ fontSize: "16px", fontWeight: "600" }}>Sales Invoices</h4>
          </div>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Track client billing and receivables.</p>
        </button>
      </div>

      <div className="glass-card" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "800" }}>
            Recent {view === "purchases" ? "Purchase Orders" : "Invoices"}
          </h3>
          <button onClick={() => setShowModal(true)} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Plus size={18} /> New {view === "purchases" ? "PO" : "Invoice"}
          </button>
        </div>

        {loading ? (
          <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}><Loader className="spinner" size={32} /></div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {transactions.map((item) => (
              <motion.div
                layout
                key={item.id}
                className="erp-finance-row"
                style={{
                  padding: "16px", backgroundColor: "var(--tag-bg)",
                  borderRadius: "12px", display: "flex", alignItems: "center",
                  gap: "20px", border: "1px solid var(--border)"
                }}
              >
                <div style={{ 
                  width: "40px", height: "40px", borderRadius: "10px", 
                  backgroundColor: "var(--input-bg)", display: "flex", 
                  alignItems: "center", justifyContent: "center",
                  color: view === "purchases" ? "var(--primary)" : "#8b5cf6"
                }}>
                  {view === "purchases" ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                    <span style={{ fontWeight: "700", fontSize: "15px" }}>{item.referenceNumber}</span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>• {new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>{item.partner?.name}</div>
                </div>

                <div className="erp-finance-meta" style={{ textAlign: "right", minWidth: "120px" }}>
                  <div style={{ fontWeight: "800", fontSize: "16px", marginBottom: "4px" }}>${item.amount.toLocaleString()}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {actionLoading === item.id && <Loader size={12} className="spinner" />}
                    <select 
                      value={item.status} 
                      disabled={actionLoading === item.id}
                      onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                      style={{ 
                        fontSize: "10px", fontWeight: "800", padding: "2px 6px", borderRadius: "4px",
                        backgroundColor: "var(--input-bg)", color: getStatusColor(item.status),
                        border: "none", cursor: "pointer", outline: "none", textAlign: "right", paddingRight: "0"
                      }}
                    >
                      {["Draft", "Pending", "Approved", "Paid", "Overdue", "Fulfilled"].map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                    </select>
                  </div>
                </div>
              </motion.div>
            ))}
            {transactions.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)", fontSize: "14px" }}>No transactions found.</div>
            )}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="modal-overlay" style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card" style={{ width: "100%", maxWidth: "500px", padding: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: "800" }}>Create New {view === "purchases" ? "Purchase Order" : "Invoice"}</h2>
                <button onClick={() => setShowModal(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>Reference Number</label>
                  <input required placeholder={view === "purchases" ? "PO-2024-001" : "INV-2024-001"} value={formData.referenceNumber} onChange={e => setFormData({...formData, referenceNumber: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "var(--input-bg)", border: "1px solid var(--border)", color: "white" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>Select {view === "purchases" ? "Vendor" : "Customer"}</label>
                  <select required value={formData.partnerId} onChange={e => setFormData({...formData, partnerId: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "var(--input-bg)", border: "1px solid var(--border)", color: "white" }}>
                    <option value="">Select Partner</option>
                    {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>Amount ($)</label>
                    <input required type="number" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "var(--input-bg)", border: "1px solid var(--border)", color: "white" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>Date</label>
                    <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "var(--input-bg)", border: "1px solid var(--border)", color: "white" }} />
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={submitting}
                  style={{ padding: "14px", borderRadius: "10px", marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  {submitting ? <Loader size={18} className="spinner" /> : "Create Record"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FinancialWorkflows;
