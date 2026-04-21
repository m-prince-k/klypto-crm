import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Plus,
  Loader,
  Search,
  BookOpen,
  Edit,
  Trash2,
  X,
  AlertCircle,
  FileText,
  ChevronRight,
} from "lucide-react";
import apiClient from "../../api/apiClient";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const PoliciesHub = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // create or edit
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [viewingPolicy, setViewingPolicy] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "General",
  });

  const fetchData = async () => {
    try {
      const res = await apiClient.get("/policies");
      setPolicies(res.data);
    } catch (err) {
      console.error("Failed to fetch policies", err);
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
      if (modalMode === "create") {
        await apiClient.post("/policies", formData);
      } else {
        await apiClient.patch(`/policies/${selectedPolicy.id}`, formData);
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (err) {
      console.error("Failed to save policy", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this policy?")) return;
    try {
      await apiClient.delete(`/policies/${id}`);
      fetchData();
    } catch (err) {
      console.error("Failed to delete policy", err);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", content: "", category: "General" });
    setSelectedPolicy(null);
    setModalMode("create");
  };

  const openEdit = (policy) => {
    setModalMode("edit");
    setSelectedPolicy(policy);
    setFormData({
      title: policy.title,
      content: policy.content,
      category: policy.category,
    });
    setShowModal(true);
  };

  const filteredPolicies = policies.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const categories = ["General", "HR", "IT", "Security", "Finance", "Legal"];

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "300px",
        }}
      >
        <Loader className="spinner" size={32} color="var(--primary)" />
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      {/* Header & Search */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            position: "relative",
            flex: 1,
            maxWidth: "400px",
          }}
        >
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
            }}
          />
          <input
            type="text"
            placeholder="Search policies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px 10px 40px",
              borderRadius: "10px",
              backgroundColor: "var(--input-bg)",
              border: "1px solid var(--border)",
              color: "var(--text-main)",
              fontSize: "14px",
            }}
          />
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <Plus size={18} /> Add New Policy
        </button>
      </div>

      {/* Policies List */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredPolicies.length === 0 ? (
          <div
            className="glass-card"
            style={{
              gridColumn: "1 / -1",
              padding: "40px",
              textAlign: "center",
              color: "var(--text-muted)",
            }}
          >
            <BookOpen
              size={48}
              style={{ marginBottom: "16px", opacity: 0.2, margin: "0 auto" }}
            />
            <p>No policies found. Create your first office policy!</p>
          </div>
        ) : (
          filteredPolicies.map((policy) => (
            <motion.div
              layout
              key={policy.id}
              className="glass-card"
              style={{
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    padding: "8px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(var(--primary-rgb), 0.1)",
                    color: "var(--primary)",
                  }}
                >
                  <FileText size={20} />
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => openEdit(policy)}
                    style={{
                      padding: "6px",
                      color: "var(--text-muted)",
                      borderRadius: "6px",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--input-bg)";
                      e.currentTarget.style.color = "var(--text-main)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "var(--text-muted)";
                    }}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(policy.id)}
                    style={{
                      padding: "6px",
                      color: "var(--text-muted)",
                      borderRadius: "6px",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(239, 68, 68, 0.1)";
                      e.currentTarget.style.color = "#ef4444";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "var(--text-muted)";
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "800",
                    letterSpacing: "0.5px",
                    color: "var(--primary)",
                    textTransform: "uppercase",
                    marginBottom: "4px",
                  }}
                >
                  {policy.category}
                </div>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    marginBottom: "8px",
                  }}
                >
                  {policy.title}
                </h3>
                <div
                  className="policy-preview-content"
                  style={{
                    fontSize: "13px",
                    color: "var(--text-muted)",
                    lineHeight: "1.6",
                    maxHeight: "80px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                  dangerouslySetInnerHTML={{ __html: policy.content }}
                />
              </div>

              <button
                onClick={() => setViewingPolicy(policy)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "var(--text-main)",
                  marginTop: "auto",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  backgroundColor: "var(--input-bg)",
                  width: "fit-content",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--border)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--input-bg)")
                }
              >
                View Full Policy <ChevronRight size={14} />
              </button>
            </motion.div>
          ))
        )}
      </div>

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "20px",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card"
              style={{
                width: "100%",
                maxWidth: "600px",
                padding: "32px",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "24px",
                }}
              >
                <h3 style={{ fontSize: "22px", fontWeight: "800" }}>
                  {modalMode === "create" ? "Add New Policy" : "Edit Policy"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  style={{ color: "var(--text-muted)" }}
                >
                  <X size={24} />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                style={{ display: "grid", gap: "20px" }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      marginBottom: "8px",
                      color: "var(--text-muted)",
                    }}
                  >
                    Policy Title
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Remote Work Guidelines"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "10px",
                      backgroundColor: "var(--input-bg)",
                      border: "1px solid var(--border)",
                      color: "var(--text-main)",
                      fontSize: "14px",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      marginBottom: "8px",
                      color: "var(--text-muted)",
                    }}
                  >
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "10px",
                      backgroundColor: "var(--input-bg)",
                      border: "1px solid var(--border)",
                      color: "var(--text-main)",
                      fontSize: "14px",
                    }}
                  >
                    {categories.map((cat) => (
                      <option
                        key={cat}
                        value={cat}
                        style={{ backgroundColor: "var(--bg-dark)" }}
                      >
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="rich-text-editor-container">
                    <ReactQuill
                      theme="snow"
                      value={formData.content}
                      onChange={(value) =>
                        setFormData({ ...formData, content: value })
                      }
                      modules={{
                        toolbar: [
                          [{ header: [1, 2, 3, false] }],
                          ["bold", "italic", "underline", "strike"],
                          [{ list: "ordered" }, { list: "bullet" }],
                          ["clean"],
                        ],
                      }}
                      placeholder="Describe the policy rules and details..."
                      style={{
                        backgroundColor: "var(--input-bg)",
                        borderRadius: "10px",
                        border: "1px solid var(--border)",
                        color: "var(--text-main)",
                        overflow: "hidden",
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(16, 185, 129, 0.05)",
                    border: "1px solid rgba(16, 185, 129, 0.1)",
                    fontSize: "12px",
                    color: "var(--text-muted)",
                  }}
                >
                  <ShieldCheck size={16} color="#10b981" />
                  <span>
                    This policy will be visible to all employees immediately
                    after publishing.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                  style={{
                    padding: "14px",
                    fontSize: "15px",
                    fontWeight: "800",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  {submitting ? (
                    <Loader size={20} className="spinner" />
                  ) : modalMode === "create" ? (
                    "Publish Policy"
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Viewing Modal */}
      <AnimatePresence>
        {viewingPolicy && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1100,
              padding: "20px",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="glass-card"
              style={{
                width: "100%",
                maxWidth: "850px",
                padding: "48px",
                maxHeight: "85vh",
                overflowY: "auto",
                position: "relative",
                border: "1px solid var(--border)",
              }}
            >
              <button
                onClick={() => setViewingPolicy(null)}
                style={{
                  position: "absolute",
                  right: "24px",
                  top: "24px",
                  padding: "10px",
                  color: "var(--text-muted)",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  borderRadius: "50%",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)")}
              >
                <X size={20} />
              </button>

              <div style={{ marginBottom: "40px", borderBottom: "1px solid var(--border)", paddingBottom: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "800",
                      color: "var(--primary)",
                      textTransform: "uppercase",
                      letterSpacing: "1.5px",
                      backgroundColor: "rgba(var(--primary-rgb), 0.1)",
                      padding: "4px 10px",
                      borderRadius: "6px",
                    }}
                  >
                    {viewingPolicy.category}
                  </span>
                  <div style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "var(--border)" }} />
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "500" }}>
                    Official Policy
                  </span>
                </div>
                <h2
                  style={{
                    fontSize: "36px",
                    fontWeight: "900",
                    lineHeight: "1.2",
                    marginBottom: "16px",
                    letterSpacing: "-0.5px",
                    color: "var(--text-main)",
                  }}
                >
                  {viewingPolicy.title}
                </h2>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontSize: "13px",
                    color: "var(--text-muted)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <ShieldCheck size={14} color="var(--primary)" />
                    Verified Document
                  </div>
                  <div style={{ width: "1px", height: "12px", backgroundColor: "var(--border)" }} />
                  <div>Published {new Date(viewingPolicy.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
              </div>

              <div
                className="policy-doc-container"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                  borderRadius: "16px",
                  padding: "32px",
                  border: "1px solid var(--border)",
                  marginTop: "8px",
                }}
              >
                <div
                  className="policy-full-content ql-viewer"
                  style={{
                    fontSize: "16px",
                    lineHeight: "1.8",
                    color: "rgba(255, 255, 255, 0.9)",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                  dangerouslySetInnerHTML={{ __html: viewingPolicy.content }}
                />
              </div>

              <div
                style={{
                  marginTop: "40px",
                  paddingTop: "24px",
                  borderTop: "1px solid var(--border)",
                  textAlign: "center",
                }}
              >
                <button
                  onClick={() => setViewingPolicy(null)}
                  className="btn-primary"
                  style={{ 
                    padding: "14px 40px", 
                    fontSize: "15px", 
                    fontWeight: "800",
                    borderRadius: "12px",
                    boxShadow: "0 10px 20px -5px rgba(var(--primary-rgb), 0.3)"
                  }}
                >
                  I have read and understood
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};


const styles = `
  .rich-text-editor-container .ql-toolbar {
    background: var(--bg-dark);
    border-color: var(--border) !important;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
  .rich-text-editor-container .ql-container {
    border-color: var(--border) !important;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    min-height: 200px;
    font-family: inherit;
    font-size: 14px;
  }
  .rich-text-editor-container .ql-editor {
    color: var(--text-main);
  }
  .rich-text-editor-container .ql-editor.ql-blank::before {
    color: var(--text-muted);
    font-style: normal;
  }
  .rich-text-editor-container .ql-stroke {
    stroke: var(--text-muted) !important;
  }
  .rich-text-editor-container .ql-fill {
    fill: var(--text-muted) !important;
  }
  .rich-text-editor-container .ql-picker {
    color: var(--text-muted) !important;
  }
  .rich-text-editor-container .ql-picker-options {
    background-color: var(--bg-dark) !important;
    border-color: var(--border) !important;
  }
  
  /* Policy Content Styling */
  .policy-full-content {
    max-width: 100%;
  }
  .policy-full-content ul, .policy-full-content ol {
    padding-left: 20px;
    margin-bottom: 24px;
    margin-top: 12px;
    list-style-position: outside;
  }
  .policy-full-content li {
    margin-bottom: 12px;
    padding-left: 12px;
  }
  .policy-full-content p {
    margin-bottom: 20px;
  }
  .policy-full-content strong {
    color: var(--text-main);
    font-weight: 700;
  }
  .policy-full-content h1, .policy-full-content h2, .policy-full-content h3 {
    margin-top: 32px;
    margin-bottom: 16px;
    font-weight: 800;
    color: var(--text-main);
    letter-spacing: -0.3px;
    line-height: 1.3;
  }
  .policy-full-content h1 { font-size: 26px; }
  .policy-full-content h2 { font-size: 22px; }
  .policy-full-content h3 { font-size: 19px; }

  .policy-preview-content * {
    margin: 0 !important;
    padding: 0 !important;
    font-size: 13px !important;
  }
`;

const StyleInjector = () => <style>{styles}</style>;

export default () => (
  <>
    <StyleInjector />
    <PoliciesHub />
  </>
);
