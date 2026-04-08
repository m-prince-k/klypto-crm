import React from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet2,
  PieChart,
  BarChart,
} from "lucide-react";

const ERPAnalytics = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Financial Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
        }}
      >
        {[
          {
            label: "Total Sales",
            value: "$248,500",
            icon: <DollarSign size={20} />,
            color: "#10b981",
            trend: "+14%",
            up: true,
          },
          {
            label: "Operational Cost",
            value: "$92,400",
            icon: <Wallet2 size={20} />,
            color: "#ef4444",
            trend: "+2%",
            up: false,
          },
          {
            label: "Net Profit",
            value: "$156,100",
            icon: <TrendingUp size={20} />,
            color: "#0ea5e9",
            trend: "+18%",
            up: true,
          },
          {
            label: "Asset Valuation",
            value: "$1.2M",
            icon: <PieChart size={20} />,
            color: "#8b5cf6",
            trend: "Stable",
            up: true,
          },
        ].map((stat, i) => (
          <div key={i} className="glass-card" style={{ padding: "24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  padding: "10px",
                  backgroundColor: `${stat.color}15`,
                  color: stat.color,
                  borderRadius: "10px",
                }}
              >
                {stat.icon}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "12px",
                  fontWeight: "700",
                  color: stat.up ? "#10b981" : "#ef4444",
                }}
              >
                {stat.up ? (
                  <TrendingUp size={14} />
                ) : (
                  <TrendingDown size={14} />
                )}{" "}
                {stat.trend}
              </div>
            </div>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "14px",
                marginBottom: "4px",
              }}
            >
              {stat.label}
            </p>
            <h3 style={{ fontSize: "28px", fontWeight: "800" }}>
              {stat.value}
            </h3>
          </div>
        ))}
      </div>

      <div
        className="erp-analytics-main"
        style={{ display: "grid", gap: "24px" }}
      >
        {/* Mock Chart Area */}
        <div className="glass-card" style={{ padding: "24px" }}>
          <div
            className="erp-analytics-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
              marginBottom: "24px",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "700" }}>
              Monthly Financial Performance
            </h3>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                style={{
                  padding: "4px 12px",
                  backgroundColor: "var(--tag-bg)",
                  borderRadius: "6px",
                  fontSize: "12px",
                }}
              >
                6 Months
              </button>
              <button
                style={{
                  padding: "4px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  color: "var(--text-muted)",
                }}
              >
                1 Year
              </button>
            </div>
          </div>

          <div
            style={{
              height: "300px",
              display: "flex",
              alignItems: "flex-end",
              gap: "20px",
              padding: "0 20px",
            }}
          >
            {[60, 45, 80, 55, 90, 75, 95].map((val, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: `${val}%`,
                    backgroundColor: "var(--primary)",
                    background: "linear-gradient(to top, #0ea5e9, #8b5cf6)",
                    borderRadius: "6px 6px 0 0",
                    opacity: 1,
                  }}
                ></div>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown Card */}
        <div className="glass-card" style={{ padding: "24px" }}>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "700",
              marginBottom: "24px",
            }}
          >
            Operational Breakdown
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {[
              { label: "Procurement", val: 40, color: "#0ea5e9" },
              { label: "Operations", val: 25, color: "#8b5cf6" },
              { label: "Marketing", val: 20, color: "#f59e0b" },
              { label: "Fixed Assets", val: 15, color: "#10b981" },
            ].map((item, i) => (
              <div key={i}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "13px",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ color: "var(--text-muted)" }}>
                    {item.label}
                  </span>
                  <span style={{ fontWeight: "600" }}>{item.val}%</span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    backgroundColor: "var(--tag-bg)",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${item.val}%`,
                      height: "100%",
                      backgroundColor: item.color,
                      borderRadius: "4px",
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ERPAnalytics;
