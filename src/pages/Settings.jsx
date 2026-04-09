import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  User,
  Mail,
  Building,
  Shield,
  Calendar,
  Activity,
  Loader,
} from "lucide-react";
import { fetchUserProfile, clearError } from "../store/auth/authSlice";

const ReadOnlyField = ({ label, icon, value }) => (
  <div style={{ marginBottom: "16px" }}>
    <label
      style={{
        display: "block",
        fontSize: "13px",
        color: "var(--text-muted)",
        marginBottom: "6px",
        fontWeight: "500",
      }}
    >
      {label}
    </label>
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          left: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--text-muted)",
        }}
      >
        {icon}
      </div>
      <input
        value={value || "-"}
        readOnly
        style={{
          width: "100%",
          backgroundColor: "var(--input-bg)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "10px 12px 10px 40px",
          color: "var(--text-main)",
          fontSize: "14px",
          outline: "none",
        }}
      />
    </div>
  </div>
);

const Settings = () => {
  const dispatch = useDispatch();
  const { user, loading, error, isAuthenticated, accessToken } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      dispatch(fetchUserProfile());
    }

    return () => {
      dispatch(clearError());
    };
  }, [dispatch, isAuthenticated, accessToken]);

  const fullName = user?.fullName || "";
  const nameParts = fullName.trim().split(/\s+/).filter(Boolean);
  const firstInitial = nameParts[0]?.[0] || "U";
  const secondInitial = nameParts[1]?.[0] || nameParts[0]?.[1] || "S";
  const initials = `${firstInitial}${secondInitial}`.toUpperCase();

  const primaryRole = user?.roles?.[0] || "No role assigned";
  const allRoles = user?.roles?.length ? user.roles.join(", ") : "No roles";
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "-";
  const accountStatus = user?.isActive ? "Active" : "Inactive";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ maxWidth: "800px", margin: "0 auto", width: "100%" }}
    >
      <header style={{ marginBottom: "32px" }}>
        <h1
          style={{ fontSize: "24px", fontWeight: "700", marginBottom: "8px" }}
        >
          Profile Settings
        </h1>
        <p style={{ color: "var(--text-muted)" }}>
          Your profile details are loaded directly from the API.
        </p>
      </header>

      <div className="glass-card" style={{ padding: "32px" }}>
        {loading && !user ? (
          <div
            style={{
              minHeight: "220px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              color: "var(--text-muted)",
            }}
          >
            <Loader size={18} className="spinner" />
            <span>Fetching profile from API...</span>
          </div>
        ) : error ? (
          <div
            style={{
              padding: "12px 14px",
              borderRadius: "8px",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              backgroundColor: "rgba(239, 68, 68, 0.12)",
              color: "#fca5a5",
              fontSize: "14px",
            }}
          >
            Failed to fetch profile data: {error}
          </div>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                marginBottom: "32px",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  backgroundColor: "var(--avatar-bg)",
                  color: "var(--text-main)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  fontWeight: "bold",
                }}
              >
                {initials}
              </div>
              <div>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    marginBottom: "4px",
                  }}
                >
                  {fullName || "User"}
                </h3>
                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                  {user?.email || "-"}
                </p>
              </div>
            </div>

            <hr
              style={{
                border: "none",
                borderTop: "1px solid var(--border)",
                marginBottom: "24px",
              }}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "20px",
              }}
            >
              <ReadOnlyField
                label="Full Name"
                value={fullName}
                icon={<User size={16} />}
              />
              <ReadOnlyField
                label="Email Address"
                value={user?.email}
                icon={<Mail size={16} />}
              />
              <ReadOnlyField
                label="Organization"
                value={user?.organization?.name}
                icon={<Building size={16} />}
              />
              <ReadOnlyField
                label="Primary Role"
                value={primaryRole}
                icon={<Shield size={16} />}
              />
              <ReadOnlyField
                label="All Roles"
                value={allRoles}
                icon={<Shield size={16} />}
              />
              <ReadOnlyField
                label="Member Since"
                value={memberSince}
                icon={<Calendar size={16} />}
              />
              <ReadOnlyField
                label="Account Status"
                value={accountStatus}
                icon={<Activity size={16} />}
              />
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Settings;
