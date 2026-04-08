import React from "react";
import { Building2, MapPin, Hash, Globe, Mail, Phone } from "lucide-react";

const OrgSetup = () => {
  return (
    <div
      className="erp-org-setup"
      style={{ display: "flex", flexDirection: "column", gap: "24px" }}
    >
      {/* Organization Details */}
      <div className="glass-card" style={{ padding: "24px" }}>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "600",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Building2 size={20} className="text-primary" /> Organization Details
        </h3>
        <div
          className="responsive-grid-2 erp-org-fields"
          style={{ display: "grid", gap: "20px" }}
        >
          {[
            {
              label: "Organization Name",
              icon: <Building2 size={16} />,
              value: "Nexus Global Corp",
            },
            {
              label: "Registration Number",
              icon: <Hash size={16} />,
              value: "REG-2024-98765",
            },
            {
              label: "Website",
              icon: <Globe size={16} />,
              value: "www.nexusglobal.com",
            },
            {
              label: "Primary Email",
              icon: <Mail size={16} />,
              value: "admin@nexusglobal.com",
            },
            {
              label: "Phone Number",
              icon: <Phone size={16} />,
              value: "+1 (555) 123-4567",
            },
            {
              label: "Tax ID / GST",
              icon: <Hash size={16} />,
              value: "27AAAAA0000A1Z5",
            },
          ].map((field, i) => (
            <div
              key={i}
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <label
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  fontWeight: "500",
                }}
              >
                {field.label}
              </label>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                >
                  {field.icon}
                </span>
                <input
                  type="text"
                  defaultValue={field.value}
                  style={{
                    width: "100%",
                    padding: "10px 12px 10px 40px",
                    backgroundColor: "var(--input-bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--text-main)",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Address & Branch info in summary */}
      <div
        className="responsive-grid-2 erp-org-bottom"
        style={{ display: "grid", gap: "24px" }}
      >
        <div className="glass-card" style={{ padding: "24px" }}>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <MapPin size={20} className="text-primary" /> Registered Address
          </h3>
          <textarea
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "var(--input-bg)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "var(--text-main)",
              fontSize: "14px",
              minHeight: "100px",
              outline: "none",
              resize: "none",
            }}
            defaultValue="123 Tech Avenue, Innovation District, San Francisco, CA 94105, United States"
          />
        </div>

        <div className="glass-card" style={{ padding: "24px" }}>
          <h4
            style={{
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "16px",
            }}
          >
            Quick Stats
          </h4>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingBottom: "12px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                Operating Branches
              </span>
              <span style={{ fontWeight: "600" }}>4</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingBottom: "12px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                Active Departments
              </span>
              <span style={{ fontWeight: "600" }}>12</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                Headcount
              </span>
              <span style={{ fontWeight: "600" }}>342</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgSetup;
