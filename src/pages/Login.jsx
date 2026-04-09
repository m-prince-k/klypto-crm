import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, clearError } from "../store/auth/authSlice";
import { Mail, Lock, AlertCircle, Loader } from "lucide-react";
import "../styles/auth.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

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
    });

    // Basic validation
    if (!formData.email || !formData.password) {
      return;
    }

    // Dispatch login thunk
    dispatch(loginUser(formData));
  };

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isPasswordValid = formData.password.length >= 6;

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

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="logo-icon">K</div>
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your Klypto CRM account</p>
        </div>

        {error && (
          <div className="error-alert">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
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

          <div className="form-group">
            <div className="label-header">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>
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

          <button
            type="submit"
            className="auth-button"
            disabled={
              loading ||
              !formData.email ||
              !formData.password ||
              !isEmailValid ||
              !isPasswordValid
            }
          >
            {loading ? (
              <>
                <Loader size={18} className="spinner" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>Don't have an account?</span>
        </div>

        <Link to="/signup" className="auth-link-button">
          Create Account
        </Link>

        <p className="auth-footer">
          By signing in, you agree to our{" "}
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

export default Login;
