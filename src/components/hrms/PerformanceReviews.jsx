import React, { useState, useEffect } from "react";
import { Star, Target, Trophy, BarChart3, Plus, Loader, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import apiClient from "../../api/apiClient";

const PerformanceReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: "",
    cycle: "Q1 2026",
    rating: 5,
    feedback: "",
    status: "Complete",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [revRes, empRes] = await Promise.all([
        apiClient.get("/performance"),
        apiClient.get("/employees"),
      ]);
      setReviews(revRes.data);
      setEmployees(empRes.data);
    } catch (err) {
      console.error("Failed to fetch performance data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post("/performance", {
        ...formData,
        rating: Number(formData.rating),
      });
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error("Failed to add review", err);
      alert("Failed to save performance review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
        }}
      >
        <Loader className="spinner" size={24} color="var(--text-muted)" />
      </div>
    );
  }

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "20px", fontWeight: "700" }}>Performance Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <Plus size={18} /> Add Review
        </button>
      </div>

      <div className="glass-card" style={{ padding: "24px" }}>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "700",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <BarChart3 size={18} /> Performance Summary
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
          }}
        >
          {[
            { label: "Average Rating", value: `${avgRating}/5.0`, icon: <Star size={16} /> },
            { label: "Reviews Logged", value: reviews.length.toString(), icon: <Trophy size={16} /> },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                padding: "20px",
                borderRadius: "12px",
                backgroundColor: "var(--column-bg)",
                border: "1px solid var(--border)",
              }}
            >
              <div style={{ color: "var(--primary)", marginBottom: "12px" }}>{item.icon}</div>
              <div style={{ fontSize: "26px", fontWeight: "800" }}>{item.value}</div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>Review Queue</h3>
        <div style={{ display: "grid", gap: "12px" }}>
          {reviews.length === 0 ? (
            <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>No reviews logged yet.</div>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "16px",
                  alignItems: "center",
                  padding: "16px",
                  borderRadius: "12px",
                  backgroundColor: "var(--column-bg)",
                  border: "1px solid var(--border)",
                }}
              >
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "700" }}>{review.employee?.name}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    Cycle: {review.cycle} · {review.feedback?.substring(0, 50)}...
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-end" }}>
                    <Star size={14} fill="var(--primary)" color="var(--primary)" />
                    <span style={{ fontSize: "16px", fontWeight: "800" }}>{review.rating.toFixed(1)}</span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#10b981" }}>{review.status}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card"
            style={{ width: "min(90vw, 500px)", padding: "24px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: "700" }}>Add Performance Review</h3>
              <button onClick={() => setShowModal(false)}><XCircle size={20} /></button>
            </div>

            <form onSubmit={handleAddReview} style={{ display: "grid", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", marginBottom: "8px" }}>Employee</label>
                <select
                  required
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", backgroundColor: "var(--input-bg)", border: "1px solid var(--border)", color: "white" }}
                >
                  <option value="">Select Employee</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", marginBottom: "8px" }}>Review Cycle</label>
                  <input
                    type="text"
                    required
                    value={formData.cycle}
                    onChange={(e) => setFormData({ ...formData, cycle: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", backgroundColor: "var(--input-bg)", border: "1px solid var(--border)", color: "white" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", marginBottom: "8px" }}>Rating (0.0 - 5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    required
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", backgroundColor: "var(--input-bg)", border: "1px solid var(--border)", color: "white" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", marginBottom: "8px" }}>Feedback</label>
                <textarea
                  required
                  value={formData.feedback}
                  onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                  style={{ width: "100%", minHeight: "100px", padding: "10px", borderRadius: "8px", backgroundColor: "var(--input-bg)", border: "1px solid var(--border)", color: "white", resize: "none" }}
                />
              </div>

              <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={submitting}
                  style={{ marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  {submitting ? <Loader size={18} className="spinner" /> : "Save Evaluation"}
                </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PerformanceReviews;
