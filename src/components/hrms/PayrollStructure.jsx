import React from "react";
import {
  Wallet2,
  ReceiptText,
  BadgeIndianRupee,
  Calculator,
} from "lucide-react";

const PayrollStructure = () => {
  const items = [
    { label: "Basic Salary", amount: "$32,000" },
    { label: "HRA", amount: "$9,600" },
    { label: "Reimbursements", amount: "$1,800" },
    { label: "Deductions", amount: "$4,250" },
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
          <Wallet2 size={18} /> Salary Structure
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          {items.map((item, i) => (
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
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    backgroundColor: "var(--icon-bg)",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {i === 0 ? (
                    <BadgeIndianRupee size={18} />
                  ) : (
                    <ReceiptText size={18} />
                  )}
                </div>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Monthly
                </span>
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "var(--text-muted)",
                  marginBottom: "6px",
                }}
              >
                {item.label}
              </div>
              <div style={{ fontSize: "22px", fontWeight: "800" }}>
                {item.amount}
              </div>
            </div>
          ))}
        </div>
      </div>

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
          <Calculator size={18} /> Payroll Controls
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "14px",
          }}
        >
          {[
            "PF / ESI / PT / TDS rule sets",
            "Payroll run approvals and checklists",
            "Payslip generation and distribution",
            "Payroll audit log and compliance trail",
          ].map((entry) => (
            <div
              key={entry}
              style={{
                padding: "14px",
                borderRadius: "12px",
                backgroundColor: "var(--column-bg)",
                border: "1px solid var(--border)",
                fontSize: "13px",
              }}
            >
              {entry}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PayrollStructure;
