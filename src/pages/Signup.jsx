import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { signupUser, clearError } from "../store/auth/authSlice";
import apiClient from "../api/apiClient";
import {
  Mail,
  Lock,
  User,
  Building2,
  AlertCircle,
  Loader,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import "../styles/auth.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    organizationName: "",
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirmPassword: false,
    fullName: false,
    organizationName: false,
  });
  const [orgCheckDone, setOrgCheckDone] = useState(false);
  const [orgExists, setOrgExists] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  // Check if an org already exists — if so, redirect to /login
  useEffect(() => {
    apiClient
      .get("/auth/org-exists")
      .then((res) => {
        if (res.data?.exists) {
          setOrgExists(true);
        }
      })
      .catch(() => {
        // If the check fails we still allow the form
      })
      .finally(() => setOrgCheckDone(true));
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      email: true,
      password: true,
      confirmPassword: true,
      fullName: true,
      organizationName: true,
    });

    if (
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.fullName ||
      !formData.organizationName
    )
      return;

    if (formData.password !== formData.confirmPassword) return;

    dispatch(
      signupUser({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        organizationName: formData.organizationName,
      })
    );
  };

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isPasswordValid = formData.password.length >= 6;
  const isConfirmPasswordValid =
    formData.confirmPassword === formData.password &&
    formData.confirmPassword.length > 0;
  const isNameValid = formData.fullName.trim().length > 0;
  const isOrgValid = formData.organizationName.trim().length > 0;
  const isFormValid =
    isEmailValid && isPasswordValid && isConfirmPasswordValid && isNameValid && isOrgValid;

  // ── Loading check ───────────────────────────────────────────────────────────
  if (!orgCheckDone) {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: "center", padding: "48px 32px" }}>
          <Loader size={32} className="spinner" style={{ margin: "0 auto 16px" }} />
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Checking system status…</p>
        </div>
      </div>
    );
  }

  // ── Organization already set up — direct to login ───────────────────────────
  if (orgExists) {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: "center", padding: "48px 32px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--primary), #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <ShieldCheck size={28} color="white" />
          </div>
          <h1 className="auth-title" style={{ marginBottom: "12px" }}>
            Organization Already Set Up
          </h1>
          <p
            className="auth-subtitle"
            style={{ maxWidth: "320px", margin: "0 auto 32px", lineHeight: 1.6 }}
          >
            Your organization is already configured. New accounts are created by your
            administrator.{" "}
            <strong>Please sign in with your provided credentials.</strong>
          </p>
          <Link
            to="/login"
            className="auth-button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
              padding: "13px 32px",
            }}
          >
            Go to Sign In <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  // ── First-time org setup form ───────────────────────────────────────────────
  return (
    <div className="auth-container">
      <div className="auth-card auth-card-large">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="logo-icon">K</div>
          </div>
          <h1 className="auth-title">Initialize Organization</h1>
          <p className="auth-subtitle">
            Set up your organization and create the first Super Admin account
          </p>
        </div>

        {error && (
          <div className="error-alert">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Name and Organization Row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                Full Name
              </label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="John Doe"
                  className={`form-input ${
                    touched.fullName && !isNameValid && formData.fullName ? "error" : ""
                  }`}
                  disabled={loading}
                />
              </div>
              {touched.fullName && !isNameValid && formData.fullName && (
                <p className="error-text">Full name is required</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="organizationName" className="form-label">
                Organization
              </label>
              <div className="input-wrapper">
                <Building2 size={18} className="input-icon" />
                <input
                  id="organizationName"
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Klypto Corp"
                  className={`form-input ${
                    touched.organizationName && !isOrgValid && formData.organizationName
                      ? "error"
                      : ""
                  }`}
                  disabled={loading}
                />
              </div>
              {touched.organizationName && !isOrgValid && formData.organizationName && (
                <p className="error-text">Organization name is required</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="admin@yourcompany.com"
                className={`form-input ${
                  touched.email && !isEmailValid && formData.email ? "error" : ""
                }`}
                disabled={loading}
              />
            </div>
            {touched.email && !isEmailValid && formData.email && (
              <p className="error-text">Valid email is required</p>
            )}
          </div>

          {/* Password Row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  className={`form-input ${
                    touched.password && !isPasswordValid && formData.password ? "error" : ""
                  }`}
                  disabled={loading}
                />
              </div>
              {touched.password && !isPasswordValid && formData.password && (
                <p className="error-text">Minimum 6 characters</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  className={`form-input ${
                    touched.confirmPassword &&
                    !isConfirmPasswordValid &&
                    formData.confirmPassword
                      ? "error"
                      : ""
                  }`}
                  disabled={loading}
                />
              </div>
              {touched.confirmPassword &&
                !isConfirmPasswordValid &&
                formData.confirmPassword && (
                  <p className="error-text">Passwords do not match</p>
                )}
            </div>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading || !isFormValid}
          >
            {loading ? (
              <>
                <Loader size={18} className="spinner" />
                Initializing…
              </>
            ) : (
              <>
                <ShieldCheck size={18} />
                Initialize Organization
              </>
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>Already have an account?</span>
        </div>

        <Link to="/login" className="auth-link-button">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Signup;
