import React, { useState, useEffect } from "react";
import {
  Search,
  UserPlus,
  Filter,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Plus,
  Loader,
  X,
  Trash2,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "../../api/apiClient";

const PartnerMaster = () => {
  const [activeSubTab, setActiveSubTab] = useState("customers");
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    status: "Active",
    category: "General",
    creditLimit: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // ID of partner being updated

  const fetchData = async () => {
    setLoading(true);
    try {
      const type = activeSubTab === "customers" ? "CUSTOMER" : "VENDOR";
      const res = await apiClient.get(`/partners?type=${type}`);
      setPartners(res.data);
    } catch (err) {
      console.error("Failed to fetch partners", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeSubTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const type = activeSubTab === "customers" ? "CUSTOMER" : "VENDOR";
      await apiClient.post("/partners", {
        ...formData,
        type,
        creditLimit: parseFloat(formData.creditLimit) || 0,
      });
      setShowModal(false);
      setFormData({
        name: "",
        contactPerson: "",
        email: "",
        phone: "",
        status: "Active",
        category: "General",
        creditLimit: 0,
      });
      fetchData();
    } catch (err) {
      alert("Failed to create partner");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    setActionLoading(id);
    try {
      await apiClient.patch(`/partners/${id}`, { status });
      await fetchData();
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeletePartner = async (id) => {
    if (
      !window.confirm(
        "Delete this partner profile? Transactions under this partner may be affected.",
      )
    )
      return;
    setActionLoading(id);
    try {
      await apiClient.delete(`/partners/${id}`);
      await fetchData();
    } catch (err) {
      alert("Failed to delete partner");
    } finally {
      setActionLoading(null);
    }
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredPartners = partners.filter((partner) => {
    const statusMatch =
      statusFilter === "all" || partner.status === statusFilter;
    const searchMatch =
      !normalizedSearch ||
      partner.name?.toLowerCase().includes(normalizedSearch) ||
      partner.contactPerson?.toLowerCase().includes(normalizedSearch) ||
      partner.email?.toLowerCase().includes(normalizedSearch);
    return statusMatch && searchMatch;
  });
  const hasActiveFilters = Boolean(normalizedSearch) || statusFilter !== "all";

  return (
    <div className="glass-card erp-partner-master" style={{ padding: "24px" }}>
      <div
        className="erp-partner-toolbar"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", flexDir: "column", gap: "4px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "800" }}>
            Partner Ecosystem
          </h2>
          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            Centralized database for stakeholders.
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div
            className="erp-partner-tabs"
            style={{
              display: "flex",
              gap: "4px",
              backgroundColor: "var(--tag-bg)",
              padding: "4px",
              borderRadius: "10px",
            }}
          >
            {["customers", "vendors"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  backgroundColor:
                    activeSubTab === tab ? "var(--primary)" : "transparent",
                  color: activeSubTab === tab ? "white" : "var(--text-muted)",
                  transition: "all 0.2s",
                  textTransform: "capitalize",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <Plus size={18} /> Add{" "}
            {activeSubTab === "customers" ? "Customer" : "Vendor"}
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              minWidth: "220px",
              flex: "1 1 240px",
            }}
          >
            <label
              style={{
                fontSize: "11px",
                color: "var(--text-muted)",
                fontWeight: "700",
                letterSpacing: "0.4px",
              }}
            >
              SEARCH {activeSubTab === "customers" ? "CUSTOMERS" : "VENDORS"}
            </label>
            <div style={{ position: "relative" }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                }}
              />
              <input
                type="text"
                placeholder="Name, contact, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 10px 10px 34px",
                  borderRadius: "8px",
                  backgroundColor: "var(--input-bg)",
                  border: "1px solid var(--border)",
                  color: "var(--text-main)",
                  fontSize: "13px",
                }}
              />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label
              style={{
                fontSize: "11px",
                color: "var(--text-muted)",
                fontWeight: "700",
                letterSpacing: "0.4px",
              }}
            >
              FILTER STATUS
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                backgroundColor: "var(--input-bg)",
                border: "1px solid var(--border)",
                color: "var(--text-main)",
                fontSize: "13px",
                minWidth: "160px",
              }}
            >
              <option value="all">All Statuses</option>
              {["Active", "Inactive", "Blocked"].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "transparent",
                color: "var(--text-muted)",
                fontSize: "12px",
                fontWeight: "700",
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
          Showing:{" "}
          <strong>
            {statusFilter === "all" ? "All Statuses" : statusFilter}
          </strong>{" "}
          ·{" "}
          <strong>
            {normalizedSearch ? `Search \"${searchTerm}\"` : "No Search"}
          </strong>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        {loading ? (
          <div
            style={{
              height: "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Loader className="spinner" size={32} />
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: "0 8px",
            }}
          >
            <thead>
              <tr>
                {[
                  `Name (${filteredPartners.length})`,
                  "Contact Person",
                  "Identity",
                  "Status",
                  activeSubTab === "customers" ? "Credit Limit" : "Category",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "0 16px 8px",
                      color: "var(--text-muted)",
                      fontSize: "11px",
                      fontWeight: "700",
                      textAlign: "left",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredPartners.map((partner) => (
                <tr
                  key={partner.id}
                  className="table-row-hover"
                  style={{
                    backgroundColor: "var(--tag-bg)",
                    transition: "all 0.2s",
                  }}
                >
                  <td
                    style={{ padding: "16px", borderRadius: "12px 0 0 12px" }}
                  >
                    <div
                      style={{
                        fontWeight: "700",
                        fontSize: "14px",
                        color: "var(--text-main)",
                      }}
                    >
                      {partner.name}
                    </div>
                    <div
                      style={{ fontSize: "11px", color: "var(--text-muted)" }}
                    >
                      ID: {partner.id.substring(0, 8)}
                    </div>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <div style={{ fontSize: "13px", fontWeight: "600" }}>
                      {partner.contactPerson}
                    </div>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        color: "var(--text-muted)",
                      }}
                    >
                      <Mail size={14} title={partner.email} />{" "}
                      <Phone size={14} title={partner.phone} />
                    </div>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {actionLoading === partner.id && (
                        <Loader size={12} className="spinner" />
                      )}
                      <select
                        value={partner.status}
                        disabled={actionLoading === partner.id}
                        onChange={(e) =>
                          handleUpdateStatus(partner.id, e.target.value)
                        }
                        style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: "800",
                          backgroundColor: "var(--input-bg)",
                          color:
                            partner.status === "Active" ? "#10b981" : "#ef4444",
                          border: "none",
                          cursor: "pointer",
                          outline: "none",
                        }}
                      >
                        {["Active", "Inactive", "Blocked"].map((s) => (
                          <option key={s} value={s}>
                            {s.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "16px",
                      fontSize: "14px",
                      fontWeight: "700",
                    }}
                  >
                    {activeSubTab === "customers"
                      ? `$${partner.creditLimit?.toLocaleString()}`
                      : partner.category}
                  </td>
                  <td
                    style={{
                      padding: "16px",
                      borderRadius: "0 12px 12px 0",
                      textAlign: "right",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                    >
                      <button
                        onClick={() => handleDeletePartner(partner.id)}
                        disabled={actionLoading === partner.id}
                        style={{ color: "var(--text-muted)", opacity: 0.6 }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "#ef4444")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "var(--text-muted)")
                        }
                      >
                        <Trash2 size={16} />
                      </button>
                      <button style={{ color: "var(--text-muted)" }}>
                        <ExternalLink size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {partners.length > 0 && filteredPartners.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: "24px",
                      textAlign: "center",
                      color: "var(--text-muted)",
                      fontStyle: "italic",
                    }}
                  >
                    No partners match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Partner Modal */}
      <AnimatePresence>
        {showModal && (
          <div
            className="modal-overlay"
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "20px",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card"
              style={{ width: "100%", maxWidth: "550px", padding: "32px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "24px",
                }}
              >
                <h2 style={{ fontSize: "20px", fontWeight: "800" }}>
                  Create New{" "}
                  {activeSubTab === "customers" ? "Customer" : "Vendor"}
                </h2>
                <button onClick={() => setShowModal(false)}>
                  <X size={20} style={{ color: "white" }} />
                </button>
              </div>
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      marginBottom: "8px",
                    }}
                  >
                    Company / Partner Name
                  </label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      backgroundColor: "var(--input-bg)",
                      border: "1px solid var(--border)",
                      color: "white",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        color: "var(--text-muted)",
                        marginBottom: "8px",
                      }}
                    >
                      Contact Person
                    </label>
                    <input
                      required
                      value={formData.contactPerson}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactPerson: e.target.value,
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        backgroundColor: "var(--input-bg)",
                        border: "1px solid var(--border)",
                        color: "white",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        color: "var(--text-muted)",
                        marginBottom: "8px",
                      }}
                    >
                      Category
                    </label>
                    <input
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        backgroundColor: "var(--input-bg)",
                        border: "1px solid var(--border)",
                        color: "white",
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        color: "var(--text-muted)",
                        marginBottom: "8px",
                      }}
                    >
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        backgroundColor: "var(--input-bg)",
                        border: "1px solid var(--border)",
                        color: "white",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        color: "var(--text-muted)",
                        marginBottom: "8px",
                      }}
                    >
                      Phone
                    </label>
                    <input
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        backgroundColor: "var(--input-bg)",
                        border: "1px solid var(--border)",
                        color: "white",
                      }}
                    />
                  </div>
                </div>
                {activeSubTab === "customers" && (
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        color: "var(--text-muted)",
                        marginBottom: "8px",
                      }}
                    >
                      Credit Limit ($)
                    </label>
                    <input
                      type="number"
                      value={formData.creditLimit}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          creditLimit: e.target.value,
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        backgroundColor: "var(--input-bg)",
                        border: "1px solid var(--border)",
                        color: "white",
                      }}
                    />
                  </div>
                )}
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                  style={{
                    padding: "14px",
                    borderRadius: "10px",
                    marginTop: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  {submitting ? (
                    <Loader size={18} className="spinner" />
                  ) : (
                    "Save Partner"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PartnerMaster;
