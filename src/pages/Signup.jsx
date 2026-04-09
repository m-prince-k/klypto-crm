import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { signupUser, clearError } from "../store/auth/authSlice";
import {
  Mail,
  Lock,
  User,
  Building2,
  AlertCircle,
  Loader,
  CheckCircle,
  ShieldCheck,
  Shield,
  Briefcase,
  UserRound,
} from "lucide-react";
import "../styles/auth.css";

const AVAILABLE_ROLES = [
  {
    id: "SUPER_ADMIN",
    label: "Super Admin",
    description: "Full system access and configuration",
    icon: ShieldCheck,
  },
  {
    id: "ADMIN",
    label: "Administrator",
    description: "Manage users and organization settings",
    icon: Shield,
  },
  {
    id: "MANAGER",
    label: "Manager",
    description: "Oversee team and projects",
    icon: Briefcase,
  },
  {
    id: "EMPLOYEE",
    label: "Employee",
    description: "Access to core features",
    icon: UserRound,
  },
];

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
  const [selectedRole, setSelectedRole] = useState("EMPLOYEE");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth,
  );

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Clear error on component unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched for validation
    setTouched({
      email: true,
      password: true,
      confirmPassword: true,
      fullName: true,
      organizationName: true,
    });

    // Basic validation
    if (
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.fullName ||
      !formData.organizationName
    ) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      return;
    }

    // Dispatch signup thunk with role information
    dispatch(
      signupUser({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        organizationName: formData.organizationName,
        requestedRole: selectedRole, // Note: Backend might override based on business logic
      }),
    );
  };

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isPasswordValid = formData.password.length >= 6;
  const isConfirmPasswordValid =
    formData.confirmPassword === formData.password &&
    formData.confirmPassword.length > 0;
  const isNameValid = formData.fullName.trim().length > 0;
  const isOrgValid = formData.organizationName.trim().length > 0;

  const getEmailError = () => {
    if (!formData.email && touched.email) return "Email is required";
    if (formData.email && !isEmailValid && touched.email)
      return "Invalid email format";
    return "";
  };

  const getPasswordError = () => {
    if (!formData.password && touched.password) return "Password is required";
    if (formData.password && !isPasswordValid && touched.password)
      return "Password must be at least 6 characters";
    return "";
  };

  const getConfirmPasswordError = () => {
    if (!formData.confirmPassword && touched.confirmPassword)
      return "Please confirm your password";
    if (
      formData.confirmPassword &&
      !isConfirmPasswordValid &&
      touched.confirmPassword
    )
      return "Passwords do not match";
    return "";
  };

  const getNameError = () => {
    if (!formData.fullName && touched.fullName) return "Full name is required";
    return "";
  };

  const getOrgError = () => {
    if (!formData.organizationName && touched.organizationName)
      return "Organization name is required";
    return "";
  };

  const isFormValid =
    isEmailValid &&
    isPasswordValid &&
    isConfirmPasswordValid &&
    isNameValid &&
    isOrgValid;

  return (
    <div className="auth-container">
      <div className="auth-card auth-card-large">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="logo-icon">K</div>
          </div>
          <h1 className="auth-title">Join Klypto CRM</h1>
          <p className="auth-subtitle">Create your account and get started</p>
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
                  className={`form-input ${touched.fullName && !isNameValid && formData.fullName ? "error" : ""}`}
                  disabled={loading}
                />
              </div>
              {getNameError() && <p className="error-text">{getNameError()}</p>}
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
                  className={`form-input ${touched.organizationName && !isOrgValid && formData.organizationName ? "error" : ""}`}
                  disabled={loading}
                />
              </div>
              {getOrgError() && <p className="error-text">{getOrgError()}</p>}
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
                placeholder="you@example.com"
                className={`form-input ${touched.email && !isEmailValid && formData.email ? "error" : ""}`}
                disabled={loading}
              />
            </div>
            {getEmailError() && <p className="error-text">{getEmailError()}</p>}
          </div>

          {/* Password and Confirm Password Row */}
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
                  className={`form-input ${touched.password && !isPasswordValid && formData.password ? "error" : ""}`}
                  disabled={loading}
                />
              </div>
              {getPasswordError() && (
                <p className="error-text">{getPasswordError()}</p>
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
                  className={`form-input ${touched.confirmPassword && !isConfirmPasswordValid && formData.confirmPassword ? "error" : ""}`}
                  disabled={loading}
                />
              </div>
              {getConfirmPasswordError() && (
                <p className="error-text">{getConfirmPasswordError()}</p>
              )}
            </div>
          </div>

          {/* Role Selection */}
          <div className="form-group">
            <label className="form-label">Select Your Role</label>
            <div className="role-grid">
              {AVAILABLE_ROLES.map((role) => {
                const RoleIcon = role.icon;
                return (
                  <div
                    key={role.id}
                    className={`role-card ${selectedRole === role.id ? "selected" : ""}`}
                    onClick={() => !loading && setSelectedRole(role.id)}
                  >
                    <span className="role-icon">
                      <RoleIcon size={22} strokeWidth={1.8} />
                    </span>
                    <input
                      type="radio"
                      name="role"
                      value={role.id}
                      checked={selectedRole === role.id}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      disabled={loading}
                      style={{ display: "none" }}
                    />
                    <h3 className="role-title">{role.label}</h3>
                    <p className="role-description">{role.description}</p>
                    {selectedRole === role.id && (
                      <div className="role-check">
                        <CheckCircle size={20} />
                      </div>
                    )}
                  </div>
                );
              })}
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
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>Already have an account?</span>
        </div>

        <Link to="/login" className="auth-link-button">
          Sign In
        </Link>

        <p className="auth-footer">
          By creating an account, you agree to our{" "}
          <a href="/terms" className="footer-link">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="footer-link">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
