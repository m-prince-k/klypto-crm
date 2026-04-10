import React, { useEffect, useRef, useState } from "react";
import {
  Briefcase,
  Users,
  FileSearch,
  LayoutDashboard,
  GraduationCap,
  Plus,
  Search,
  MoreVertical,
  Star,
  Clock,
  Loader,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "../../api/apiClient";

const RecruitmentAssessment = () => {
  const [activeSubView, setActiveSubView] = useState("jobs");
  const [isAddingJob, setIsAddingJob] = useState(false);
  const [isAddingCandidate, setIsAddingCandidate] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // ID of candidate being updated

  const [jobFormData, setJobFormData] = useState({ title: "", department: "", status: "Active" });
  const [candidateFormData, setCandidateFormData] = useState({ name: "", email: "", phone: "", role: "", jobId: "", score: "" });

  const subViews = [
    { id: "jobs", label: "Job Manager", icon: <Briefcase size={18} /> },
    { id: "pipeline", label: "Candidate Pipeline", icon: <LayoutDashboard size={18} /> },
    { id: "assessments", label: "Online Tests", icon: <GraduationCap size={18} /> },
  ];

  const fetchData = async () => {
    try {
      const [jobRes, candRes] = await Promise.all([
        apiClient.get("/recruitment/jobs"),
        apiClient.get("/recruitment/candidates"),
      ]);
      setJobs(jobRes.data);
      setCandidates(candRes.data);
    } catch (err) {
      console.error("Failed to fetch recruitment data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post("/recruitment/jobs", jobFormData);
      setIsAddingJob(false);
      setJobFormData({ title: "", department: "", status: "Active" });
      fetchData();
    } catch (err) {
      alert("Failed to create job");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateCandidate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post("/recruitment/candidates", {
        ...candidateFormData,
        score: Number(candidateFormData.score)
      });
      setIsAddingCandidate(false);
      setCandidateFormData({ name: "", email: "", phone: "", role: "", jobId: "", score: 0 });
      fetchData();
    } catch (err) {
      alert("Failed to add candidate");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStage = async (id, stage) => {
    setActionLoading(id);
    try {
      await apiClient.patch(`/recruitment/candidates/${id}`, { stage });
      fetchData();
    } catch (err) {
      console.error("Failed to update candidate stage", err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div style={{ height: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader className="spinner" size={32} />
      </div>
    );
  }

  const renderSubView = () => {
    switch (activeSubView) {
      case "jobs":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <div style={{ position: "relative", width: "100%", maxWidth: "300px" }}>
                <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input type="text" placeholder="Search jobs..." style={{ width: "100%", padding: "10px 10px 10px 40px", borderRadius: "8px", backgroundColor: "var(--input-bg)", border: "1px solid var(--border)", color: "white" }} />
              </div>
              <button className="btn-primary" onClick={() => setIsAddingJob(true)} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Plus size={18} /> Create Job Posting
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
              {jobs.map((job) => (
                <div key={job.id} className="glass-card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                    <div>
                      <h4 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "4px" }}>{job.title}</h4>
                      <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{job.department} • {job.id.substring(0, 8)}</span>
                    </div>
                    <span style={{ padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", backgroundColor: job.status === "Active" ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)", color: job.status === "Active" ? "#10b981" : "#f59e0b" }}>
                      {job.status.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
                    <div style={{ display: "flex", gap: "8px", color: "var(--text-muted)" }}>
                      <Users size={16} /> {job._count?.candidates || 0} Applicants
                    </div>
                    <div style={{ color: "var(--text-muted)" }}>Posted: {new Date(job.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "pipeline":
        const stages = ["Applied", "Screening", "Technical", "Interview", "Offered", "Hired", "Rejected"];
        return (
          <div style={{ display: "flex", gap: "20px", overflowX: "auto", paddingBottom: "20px", minHeight: "500px" }}>
            {stages.map((stage) => (
              <div key={stage} style={{ minWidth: "260px", flex: "1 1 260px", backgroundColor: "var(--column-bg)", borderRadius: "12px", padding: "16px", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h4 style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-muted)" }}>
                    {stage.toUpperCase()} <span style={{ marginLeft: "8px", padding: "2px 8px", backgroundColor: "var(--tag-bg)", borderRadius: "10px" }}>
                      {candidates.filter(c => c.stage === stage).length}
                    </span>
                  </h4>
                  <Plus size={16} style={{ color: "var(--text-muted)", cursor: "pointer" }} onClick={() => {setCandidateFormData({...candidateFormData, stage}); setIsAddingCandidate(true);}} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {candidates.filter(c => c.stage === stage).map(candidate => (
                    <div key={candidate.id} className="glass-card" style={{ padding: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700" }}>
                          {candidate.name[0]}
                        </div>
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: "600" }}>{candidate.name}</div>
                          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{candidate.role}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#10b981", fontWeight: "700" }}>
                          <Star size={12} fill="#10b981" /> {candidate.score}%
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {actionLoading === candidate.id && <Loader size={12} className="spinner" />}
                          <select 
                            value={candidate.stage}
                            disabled={actionLoading === candidate.id}
                            onChange={(e) => handleUpdateStage(candidate.id, e.target.value)}
                            style={{ backgroundColor: "transparent", border: "none", color: "var(--text-muted)", fontSize: "11px", fontWeight: "600", outline: "none", cursor: "pointer" }}
                          >
                            {stages.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case "assessments":
        return (
          <div className="glass-card" style={{ padding: "24px" }}>
             <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>Online Assessments</h3>
             <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Live technical assessment integration is coming soon. Currently tracking candidate scores manually.</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", gap: "12px", overflowX: "auto", padding: "4px" }}>
        {subViews.map((sv) => (
          <button
            key={sv.id}
            onClick={() => setActiveSubView(sv.id)}
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              backgroundColor: activeSubView === sv.id ? "var(--primary)" : "var(--column-bg)",
              color: activeSubView === sv.id ? "white" : "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
              fontWeight: "600",
              border: "1px solid var(--border)",
              transition: "all 0.2s",
            }}
          >
            {sv.icon} {sv.label}
          </button>
        ))}
      </div>

      <main>{renderSubView()}</main>

      <AnimatePresence>
        {isAddingJob && (
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 110 }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card" style={{ width: "min(90vw, 450px)", padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: "700" }}>Create Job Posting</h3>
                <button onClick={() => setIsAddingJob(false)}><XCircle size={20} /></button>
              </div>
              <form onSubmit={handleCreateJob} style={{ display: "grid", gap: "12px" }}>
                <input type="text" required placeholder="Job Title" value={jobFormData.title} onChange={e => setJobFormData({...jobFormData, title: e.target.value})} style={{ width: "100%", padding: "10px", borderRadius: "8px", backgroundColor: "var(--input-bg)", border: "1px solid var(--border)", color: "white" }} />
                <input type="text" required placeholder="Department" value={jobFormData.department} onChange={e => setJobFormData({...jobFormData, department: e.target.value})} style={{ width: "100%", padding: "10px", borderRadius: "8px", backgroundColor: "var(--input-bg)", border: "1px solid var(--border)", color: "white" }} />
                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={submitting}
                  style={{ marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  {submitting ? <Loader size={18} className="spinner" /> : "Post Job"}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {isAddingCandidate && (
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 110 }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card" style={{ width: "min(90vw, 500px)", padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: "700" }}>Add Candidate</h3>
                <button onClick={() => setIsAddingCandidate(false)}><XCircle size={20} /></button>
              </div>
              <form onSubmit={handleCreateCandidate} style={{ display: "grid", gap: "12px" }}>
                <input type="text" required placeholder="Candidate Name" value={candidateFormData.name} onChange={e => setCandidateFormData({...candidateFormData, name: e.target.value})} style={{ width: "100%", padding: "10px", borderRadius: "8px", backgroundColor: "var(--input-bg)", border: "1px solid var(--border)", color: "white" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <input type="email" placeholder="Email" value={candidateFormData.email} onChange={e => setCandidateFormData({...candidateFormData, email: e.target.value})} style={{ width: "100%", padding: "10px", borderRadius: "8px", backgroundColor: "var(--input-bg)", border: "1px solid var(--border)", color: "white" }} />
                  <input type="text" placeholder="Phone" value={candidateFormData.phone} onChange={e => setCandidateFormData({...candidateFormData, phone: e.target.value})} style={{ width: "100%", padding: "10px", borderRadius: "8px", backgroundColor: "var(--input-bg)", border: "1px solid var(--border)", color: "white" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <select required value={candidateFormData.jobId} onChange={e => {const job = jobs.find(j => j.id === e.target.value); setCandidateFormData({...candidateFormData, jobId: e.target.value, role: job?.title || ""});}} style={{ width: "100%", padding: "10px", borderRadius: "8px", backgroundColor: "var(--input-bg)", border: "1px solid var(--border)", color: "white" }}>
                    <option value="">Select Job</option>
                    {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                  </select>
                  <input type="number" placeholder="Score (0-100)" value={candidateFormData.score} onChange={e => setCandidateFormData({...candidateFormData, score: e.target.value})} style={{ width: "100%", padding: "10px", borderRadius: "8px", backgroundColor: "var(--input-bg)", border: "1px solid var(--border)", color: "white" }} />
                </div>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={submitting}
                  style={{ marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  {submitting ? <Loader size={18} className="spinner" /> : "Add to Pipeline"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecruitmentAssessment;
