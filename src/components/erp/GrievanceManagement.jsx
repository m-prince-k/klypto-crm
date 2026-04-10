import React, { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ShieldAlert,
  Clock,
  CheckCircle2,
  UserX,
  MessageSquare,
  Flag,
  MoreVertical,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Search,
  Send,
  Loader,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "../../api/apiClient";

const GrievanceManagement = () => {
  const [view, setView] = useState("dashboard");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [grievances, setGrievances] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // ID of grievance being updated
  
  const [formData, setFormData] = useState({
    subject: "",
    category: "General",
    description: "",
    severity: "Medium",
    isAnonymous: false,
  });

  const fetchData = async () => {
    try {
      const [grievanceRes, statsRes] = await Promise.all([
        apiClient.get("/grievances"),
        apiClient.get("/grievances/stats"),
      ]);
      setGrievances(grievanceRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Failed to fetch grievance data", err);
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
      await apiClient.post("/grievances", { ...formData, isAnonymous });
      setFormData({ subject: "", category: "General", description: "", severity: "Medium", isAnonymous: false });
      setView("dashboard");
      fetchData();
    } catch (err) {
      alert("Failed to submit grievance");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    setActionLoading(id);
    try {
      await apiClient.patch(`/grievances/${id}`, { status });
      fetchData();
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setActionLoading(null);
    }
  };

  const getSeverityColor = (sev) => {
    switch (sev) {
      case "Critical": return "#ef4444";
      case "High": return "#f59e0b";
      case "Medium": return "var(--primary)";
      default: return "var(--text-muted)";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved": return "#10b981";
      case "Escalated": return "#ef4444";
      case "In Review": return "#3b82f6";
      default: return "var(--text-muted)";
    }
  };

  if (loading) {
    return (
      <div style={{ height: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader className="spinner" size={32} />
      </div>
    );
  }

  const renderView = () => {
    switch (view) {
      case "dashboard":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
              <div className="glass-card" style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <div style={{ padding: "8px", borderRadius: "8px", backgroundColor: "var(--tag-bg)", color: "var(--primary)" }}><MessageSquare size={18} /></div>
                </div>
                <div style={{ fontSize: "24px", fontWeight: "800" }}>{stats?.total || 0}</div>
                <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Total Grievances</div>
              </div>
              <div className="glass-card" style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <div style={{ padding: "8px", borderRadius: "8px", backgroundColor: "var(--tag-bg)", color: "#f59e0b" }}><Clock size={18} /></div>
                </div>
                <div style={{ fontSize: "24px", fontWeight: "800" }}>{stats?.unresolved || 0}</div>
                <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Unresolved</div>
              </div>
              <div className="glass-card" style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <div style={{ padding: "8px", borderRadius: "8px", backgroundColor: "var(--tag-bg)", color: "#ef4444" }}><AlertTriangle size={18} /></div>
                </div>
                <div style={{ fontSize: "24px", fontWeight: "800" }}>{stats?.critical || 0}</div>
                <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Critical / High</div>
              </div>
              <div className="glass-card" style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <div style={{ padding: "8px", borderRadius: "8px", backgroundColor: "var(--tag-bg)", color: "#10b981" }}><CheckCircle2 size={18} /></div>
                </div>
                <div style={{ fontSize: "24px", fontWeight: "800" }}>{stats?.resolved || 0}</div>
                <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Resolved (MTD)</div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ fontWeight: "700" }}>Recent Grievances</h3>
                <button className="btn-primary" onClick={() => setView("submit")} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Plus size={18} /> New Complaint
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {grievances.map((grv) => (
                  <div key={grv.id} style={{ padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", backgroundColor: "var(--tag-bg)", display: "flex", alignItems: "center", gap: "20px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "var(--input-bg)", display: "flex", alignItems: "center", justifyContent: "center", color: getSeverityColor(grv.severity) }}>
                      {grv.isAnonymous ? <UserX size={20} /> : <ShieldAlert size={20} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span style={{ fontWeight: "700" }}>{grv.subject}</span>
                        {grv.isAnonymous && <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#ef4444", fontWeight: "800" }}>ANONYMOUS</span>}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        ID: {grv.id.substring(0,8)} • {grv.category} • {new Date(grv.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", minWidth: "120px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {actionLoading === grv.id && <Loader size={12} className="spinner" />}
                      <select 
                        value={grv.status}
                        disabled={actionLoading === grv.id}
                        onChange={(e) => handleUpdateStatus(grv.id, e.target.value)}
                        style={{ backgroundColor: "transparent", border: "none", color: getStatusColor(grv.status), fontSize: "11px", fontWeight: "700", outline: "none", cursor: "pointer" }}
                      >
                        {["Open", "In Review", "Escalated", "Resolved"].map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                      </select>
                    </div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>Severity: <span style={{ color: getSeverityColor(grv.severity) }}>{grv.severity}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "submit":
        return (
          <div className="glass-card" style={{ maxWidth: "700px", margin: "0 auto", padding: "32px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "8px" }}>Submit a Grievance</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "32px" }}>Provide details about your concern. We ensure fair evaluation for all cases.</p>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ padding: "16px", borderRadius: "12px", backgroundColor: "var(--input-bg)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: isAnonymous ? "#ef4444" : "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                    {isAnonymous ? <UserX size={20} /> : <ShieldCheck size={20} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: "600" }}>Anonymous Submission</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Your identity will be hidden from the reviewer.</div>
                  </div>
                </div>
                <button type="button" onClick={() => setIsAnonymous(!isAnonymous)} style={{ width: "50px", height: "24px", borderRadius: "12px", backgroundColor: isAnonymous ? "#ef4444" : "var(--border)", position: "relative", transition: "all 0.3s" }}>
                  <div style={{ position: "absolute", left: isAnonymous ? "28px" : "4px", top: "4px", width: "16px", height: "16px", backgroundColor: "white", borderRadius: "50%", transition: "all 0.3s" }}></div>
                </button>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>Reason / Subject</label>
                <input required type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} placeholder="Brief summary" style={{ width: "100%", padding: "14px", borderRadius: "8px", backgroundColor: "var(--input-bg)", border: "1px solid var(--border)", color: "white" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ width: "100%", padding: "14px", borderRadius: "8px", backgroundColor: "var(--input-bg)", border: "1px solid var(--border)", color: "white" }}>
                    <option>General</option>
                    <option>Workplace Harassment</option>
                    <option>Policy Violation</option>
                    <option>Management Issue</option>
                    <option>Infrastructure / Facilities</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>Severity</label>
                  <select value={formData.severity} onChange={e => setFormData({...formData, severity: e.target.value})} style={{ width: "100%", padding: "14px", borderRadius: "8px", backgroundColor: "var(--input-bg)", border: "1px solid var(--border)", color: "white" }}>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>Description</label>
                <textarea required rows={5} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Detailed information..." style={{ width: "100%", padding: "14px", borderRadius: "8px", backgroundColor: "var(--input-bg)", border: "1px solid var(--border)", color: "white" }}></textarea>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button type="button" onClick={() => setView("dashboard")} style={{ flex: 1, padding: "14px", borderRadius: "10px", border: "1px solid var(--border)", fontWeight: "600" }}>Cancel</button>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={submitting}
                  style={{ flex: 2, padding: "14px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  {submitting ? <Loader size={18} className="spinner" /> : <><Send size={18} /> Submit Grievance</>}
                </button>
              </div>
            </form>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "4px" }}>Grievance Management</h1>
          <p style={{ color: "var(--text-muted)" }}>Ensuring workplace fairness and transparency.</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => setView("dashboard")} style={{ padding: "8px 16px", borderRadius: "8px", backgroundColor: view === "dashboard" ? "var(--primary)" : "var(--tag-bg)", color: view === "dashboard" ? "white" : "var(--text-main)", fontSize: "14px", fontWeight: "600" }}>Dashboard</button>
          <button onClick={() => setView("submit")} style={{ padding: "8px 16px", borderRadius: "8px", backgroundColor: view === "submit" ? "var(--primary)" : "var(--tag-bg)", color: view === "submit" ? "white" : "var(--text-main)", fontSize: "14px", fontWeight: "600" }}>Submit</button>
        </div>
      </header>
      <main>{renderView()}</main>
    </div>
  );
};

export default GrievanceManagement;
