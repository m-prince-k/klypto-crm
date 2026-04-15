import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Search, Bell, Plus, Settings, Moon, Sun, Menu } from "lucide-react";
import { logout, logoutUser } from "../../store/auth/authSlice";
import { API_BASE_URL } from "../../api/apiClient";
import { toast } from "sonner";

const Navbar = ({ onMenuClick }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark",
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = React.useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };

    if (isSettingsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isSettingsOpen]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleLogout = async () => {
    setIsSettingsOpen(false);
    await dispatch(logoutUser());
    navigate("/login");
  };

  useEffect(() => {
    if (!accessToken) return;

    const eventUrl = `${API_BASE_URL}/auth/events?token=${encodeURIComponent(accessToken)}`;

    const eventSource = new EventSource(eventUrl);

    eventSource.onmessage = (event) => {
      try {
        if (typeof event.data !== "string") {
          return;
        }

        const trimmedData = event.data.trim();
        if (!trimmedData.startsWith("{") && !trimmedData.startsWith("[")) {
          return;
        }

        const payload = JSON.parse(trimmedData);
        if (payload?.type === "USER_DEACTIVATED") {
          dispatch(logout());
          toast.error(
            payload?.message ||
              "Your account has been deactivated. You have been logged out.",
          );
          navigate("/login", { replace: true });
          eventSource.close();
        }
      } catch {
        // ignore malformed SSE payloads
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [accessToken, dispatch, navigate]);

  return (
    <header
      className="app-navbar"
      style={{
        height: "64px",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        backgroundColor: "var(--bg-card)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 10,
        gap: "16px",
        flexWrap: "wrap",
        minWidth: 0,
      }}
    >
      <button
        onClick={onMenuClick}
        className="mobile-menu-btn glass-card"
        style={{
          width: "40px",
          height: "40px",
          display: "none",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-muted)",
          flexShrink: 0,
        }}
        aria-label="Toggle sidebar menu"
        title="Toggle sidebar menu"
      >
        <Menu size={20} />
      </button>

      <div
        className="navbar-search"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "400px",
          flex: "1 1 280px",
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
          placeholder="Search leads, pipelines... (Ctrl+K)"
          style={{
            width: "100%",
            backgroundColor: "var(--glass)",
            border: "1px solid var(--border)",
            padding: "10px 12px 10px 40px",
            borderRadius: "10px",
            color: "var(--text-main)",
            fontSize: "14px",
            outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
        <div
          className="search-shortcut"
          style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "var(--tag-bg)",
            padding: "2px 6px",
            borderRadius: "4px",
            fontSize: "10px",
            color: "var(--text-muted)",
            border: "1px solid var(--border)",
          }}
        >
          K
        </div>
      </div>

      <div
        className="navbar-actions"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
          marginLeft: "auto",
        }}
      >
        <div
          style={{
            width: "1px",
            height: "24px",
            backgroundColor: "var(--border)",
          }}
        />

        <button onClick={toggleTheme} style={{ color: "var(--text-muted)" }}>
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button style={{ color: "var(--text-muted)" }}>
          <Bell size={20} />
        </button>

        <div ref={settingsRef} style={{ position: "relative" }}>
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            style={{
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Settings size={20} />
          </button>

          {isSettingsOpen && (
            <div
              style={{
                position: "absolute",
                top: "40px",
                right: "0",
                width: "180px",
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                boxShadow: "var(--shadow)",
                padding: "8px 0",
                zIndex: 50,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Link
                to="/settings"
                onClick={() => setIsSettingsOpen(false)}
                style={{
                  padding: "10px 16px",
                  textAlign: "left",
                  fontSize: "14px",
                  width: "100%",
                  color: "var(--text-main)",
                  display: "block",
                  textDecoration: "none",
                }}
              >
                Profile
              </Link>
              <Link
                to="/settings"
                onClick={() => setIsSettingsOpen(false)}
                style={{
                  padding: "10px 16px",
                  textAlign: "left",
                  fontSize: "14px",
                  width: "100%",
                  color: "var(--text-main)",
                  display: "block",
                  textDecoration: "none",
                }}
              >
                Preferences
              </Link>
              <div
                style={{
                  height: "1px",
                  backgroundColor: "var(--border)",
                  margin: "4px 0",
                }}
              />
              <button
                onClick={handleLogout}
                style={{
                  padding: "10px 16px",
                  textAlign: "left",
                  fontSize: "14px",
                  width: "100%",
                  color: "#ef4444",
                  display: "block",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                }}
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
