import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { fetchUserProfile } from "../../store/auth/authSlice";

/**
 * ProtectedRoute Component
 * Checks if user is authenticated before allowing access to a page
 * Can also verify specific roles if needed
 *
 * @param {React.Component} Component - The component to render if authenticated
 * @param {Array} requiredRoles - Optional array of roles required to access this route
 * @returns {React.Component}
 */
// eslint-disable-next-line no-unused-vars
const ProtectedRoute = ({ Component, requiredRoles = [] }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, accessToken, loading, user } = useSelector(
    (state) => state.auth,
  );

  // Fetch user profile if authenticated but no profile data yet
  useEffect(() => {
    if (isAuthenticated && accessToken && !user) {
      dispatch(fetchUserProfile());
    }
  }, [isAuthenticated, accessToken, user, dispatch]);

  // Loading state - show loading spinner or message
  if (loading && !user) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "var(--bg-dark)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            color: "var(--text-light)",
          }}
        >
          <div className="spinner" style={{ marginBottom: "16px" }}></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated || !accessToken) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access if required roles specified
  if (requiredRoles.length > 0 && user) {
    const userRoles = user.roles || [];
    const hasRequiredRole = requiredRoles.some((role) =>
      userRoles.includes(role),
    );

    if (!hasRequiredRole) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            backgroundColor: "var(--bg-dark)",
          }}
        >
          <div
            style={{
              textAlign: "center",
              color: "#ef4444",
            }}
          >
            <h1>Access Denied</h1>
            <p>You don't have permission to access this page.</p>
          </div>
        </div>
      );
    }
  }

  // Render the protected component
  return <Component />;
};

export default ProtectedRoute;
