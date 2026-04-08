import React from "react";
import { Star, Target, Trophy, BarChart3 } from "lucide-react";

const PerformanceReviews = () => {
  const reviews = [
    {
      name: "Ava Johnson",
      rating: "4.8/5",
      cycle: "Q1 2026",
      goal: "Leadership",
      status: "Complete",
    },
    {
      name: "Rohan Mehta",
      rating: "4.2/5",
      cycle: "Q1 2026",
      goal: "Revenue growth",
      status: "In review",
    },
    {
      name: "Noah Garcia",
      rating: "4.9/5",
      cycle: "Q1 2026",
      goal: "Delivery excellence",
      status: "Complete",
    },
  ];

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      <div className="glass-card" style={{ padding: "24px" }}>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "700",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <BarChart3 size={18} /> Performance Summary
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
          }}
        >
          {[
            {
              label: "Reviews Completed",
              value: "86%",
              icon: <Star size={16} />,
            },
            {
              label: "Goals On Track",
              value: "74%",
              icon: <Target size={16} />,
            },
            {
              label: "Top Performers",
              value: "28",
              icon: <Trophy size={16} />,
            },
            {
              label: "Pending Feedback",
              value: "12",
              icon: <BarChart3 size={16} />,
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                padding: "16px",
                borderRadius: "12px",
                backgroundColor: "var(--column-bg)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <div style={{ color: "var(--primary)" }}>{item.icon}</div>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  This cycle
                </span>
              </div>
              <div style={{ fontSize: "26px", fontWeight: "800" }}>
                {item.value}
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ padding: "24px" }}>
        <h3
          style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}
        >
          Review Queue
        </h3>
        <div style={{ display: "grid", gap: "12px" }}>
          {reviews.map((review) => (
            <div
              key={review.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "16px",
                alignItems: "center",
                padding: "14px",
                borderRadius: "12px",
                backgroundColor: "var(--column-bg)",
                border: "1px solid var(--border)",
              }}
            >
              <div>
                <div style={{ fontSize: "14px", fontWeight: "700" }}>
                  {review.name}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {review.cycle} · Goal: {review.goal}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "14px", fontWeight: "700" }}>
                  {review.rating}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: review.status === "Complete" ? "#10b981" : "#f59e0b",
                  }}
                >
                  {review.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceReviews;
