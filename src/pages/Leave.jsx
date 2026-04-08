import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  CalendarDays,
  ReceiptText,
  RotateCcw,
  Plus,
  TrendingUp,
  Clock3,
  AlertTriangle,
} from "lucide-react";

const TabContent = ({ title, children, showAdd = true }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="erp-tab-content"
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
        gap: "16px",
        flexWrap: "wrap",
      }}
    >
      <h2 style={{ fontSize: "24px", fontWeight: "700" }}>{title}</h2>
      {showAdd && (
        <button
          className="btn-primary"
          style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
        >
          <Plus size={18} /> Add New
        </button>
      )}
    </div>
    {children}
  </motion.div>
);

const Leave = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: <BarChart3 size={18} /> },
    { id: "balances", label: "Balances", icon: <Wallet size={18} /> },
    { id: "policies", label: "Policies", icon: <ShieldCheck size={18} /> },
    { id: "requests", label: "Requests", icon: <CheckCircle2 size={18} /> },
    { id: "calendar", label: "Calendar", icon: <CalendarDays size={18} /> },
    { id: "encashment", label: "Encashment", icon: <ReceiptText size={18} /> },
    { id: "carry", label: "Carry Forward", icon: <RotateCcw size={18} /> },
  ];

  return (
    <div
      className="erp-container"
      style={{
        width: "100%",
        maxWidth: "1400px",
        margin: "0 auto",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <header>
        <h1
          style={{ fontSize: "32px", fontWeight: "800", marginBottom: "8px" }}
        >
          Leave Management
        </h1>
        <p style={{ color: "var(--text-muted)" }}>
          Manage leave balances, policy workflows, approvals, and carry-forward
          rules.
        </p>
      </header>

      <div
        className="glass-card"
        style={{
          display: "flex",
          gap: "4px",
          alignContent: "center",
          flexWrap: "nowrap",
          justifyContent: "flex-start",
          alignItems: "stretch",
          minHeight: "52px",
          padding: "6px",
          overflowX: "auto",
          overflowY: "hidden",
          width: "100%",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              transition: "all 0.2s ease",
              color: activeTab === tab.id ? "white" : "var(--text-muted)",
              backgroundColor:
                activeTab === tab.id ? "var(--primary)" : "transparent",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <main style={{ flex: 1, position: "relative" }}>
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <TabContent
              key="overview"
              title="Leave Operations Overview"
              showAdd={false}
            >
              <div style={{ display: "grid", gap: "24px" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
                    gap: "20px",
                  }}
                >
                  {[
                    {
                      label: "Open Requests",
                      value: "28",
                      trend: "12 urgent",
                      up: false,
                      icon: <AlertTriangle size={16} />,
                    },
                    {
                      label: "Approved This Month",
                      value: "84",
                      trend: "+14%",
                      up: true,
                      icon: <CheckCircle2 size={16} />,
                    },
                    {
                      label: "Average SLA",
                      value: "18h",
                      trend: "Within target",
                      up: true,
                      icon: <Clock3 size={16} />,
                    },
                    {
                      label: "Encashment Cases",
                      value: "7",
                      trend: "Payroll synced",
                      up: true,
                      icon: <TrendingUp size={16} />,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="glass-card"
                      style={{ padding: "20px" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "12px",
                        }}
                      >
                        <div
                          style={{
                            width: "34px",
                            height: "34px",
                            borderRadius: "10px",
                            backgroundColor: "var(--icon-bg)",
                            color: "var(--primary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {item.icon}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "12px",
                            fontWeight: "700",
                            color: item.up ? "#10b981" : "#ef4444",
                          }}
                        >
                          {item.up ? (
                            <TrendingUp size={14} />
                          ) : (
                            <AlertTriangle size={14} />
                          )}{" "}
                          {item.trend}
                        </div>
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
                      <div style={{ fontSize: "28px", fontWeight: "800" }}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.4fr 1fr",
                    gap: "24px",
                  }}
                >
                  <div className="glass-card" style={{ padding: "24px" }}>
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        marginBottom: "16px",
                      }}
                    >
                      Department Approval Queue
                    </h3>
                    <div style={{ display: "grid", gap: "12px" }}>
                      {[
                        {
                          dept: "Engineering",
                          pending: 8,
                          approver: "Noah Garcia",
                          sla: "17h left",
                        },
                        {
                          dept: "Sales",
                          pending: 6,
                          approver: "Ava Johnson",
                          sla: "9h left",
                        },
                        {
                          dept: "Finance",
                          pending: 5,
                          approver: "Maya Patel",
                          sla: "22h left",
                        },
                        {
                          dept: "People Ops",
                          pending: 9,
                          approver: "Ethan Blake",
                          sla: "4h left",
                        },
                      ].map((entry) => (
                        <div
                          key={entry.dept}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1.2fr 0.8fr 1fr 0.8fr",
                            gap: "12px",
                            padding: "14px",
                            borderRadius: "12px",
                            border: "1px solid var(--border)",
                            backgroundColor: "var(--column-bg)",
                            alignItems: "center",
                            fontSize: "13px",
                          }}
                        >
                          <div style={{ fontWeight: "700" }}>{entry.dept}</div>
                          <div style={{ color: "#f59e0b", fontWeight: "700" }}>
                            {entry.pending} pending
                          </div>
                          <div style={{ color: "var(--text-muted)" }}>
                            {entry.approver}
                          </div>
                          <div
                            style={{
                              textAlign: "right",
                              color: "#ef4444",
                              fontWeight: "700",
                            }}
                          >
                            {entry.sla}
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
                      }}
                    >
                      SLA & Escalation Matrix
                    </h3>
                    <div style={{ display: "grid", gap: "10px" }}>
                      {[
                        "L1 Manager approval target: 24 hours",
                        "L2 HR Admin escalation: after 24 hours",
                        "L3 Org Admin escalation: after 48 hours",
                        "Auto-alert via email + in-app at 18h and 22h",
                        "Audit trail mandatory for reject decisions",
                      ].map((item) => (
                        <div
                          key={item}
                          style={{
                            padding: "12px 14px",
                            borderRadius: "10px",
                            border: "1px solid var(--border)",
                            backgroundColor: "var(--column-bg)",
                            fontSize: "13px",
                          }}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabContent>
          )}

          {activeTab === "balances" && (
            <TabContent key="balances" title="Leave Balances" showAdd={false}>
              <div style={{ display: "grid", gap: "24px" }}>
                <div className="glass-card" style={{ padding: "24px" }}>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      marginBottom: "16px",
                    }}
                  >
                    Policy-Wise Balance Ledger
                  </h3>
                  <div style={{ display: "grid", gap: "12px" }}>
                    {[
                      {
                        type: "Annual Leave",
                        allocated: "18",
                        used: "7",
                        remaining: "11",
                        utilization: 39,
                      },
                      {
                        type: "Sick Leave",
                        allocated: "10",
                        used: "3",
                        remaining: "7",
                        utilization: 30,
                      },
                      {
                        type: "Casual Leave",
                        allocated: "8",
                        used: "4",
                        remaining: "4",
                        utilization: 50,
                      },
                      {
                        type: "Comp-Off",
                        allocated: "4",
                        used: "1",
                        remaining: "3",
                        utilization: 25,
                      },
                    ].map((row) => (
                      <div
                        key={row.type}
                        style={{
                          padding: "14px",
                          borderRadius: "12px",
                          backgroundColor: "var(--column-bg)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "2fr 1fr 1fr 1fr",
                            gap: "12px",
                            fontSize: "13px",
                            marginBottom: "10px",
                          }}
                        >
                          <div style={{ fontWeight: "700" }}>{row.type}</div>
                          <div style={{ color: "var(--text-muted)" }}>
                            Allocated: {row.allocated}
                          </div>
                          <div style={{ color: "var(--text-muted)" }}>
                            Used: {row.used}
                          </div>
                          <div
                            style={{
                              textAlign: "right",
                              fontWeight: "700",
                              color: "#10b981",
                            }}
                          >
                            Left: {row.remaining}
                          </div>
                        </div>
                        <div
                          style={{
                            height: "8px",
                            width: "100%",
                            borderRadius: "8px",
                            backgroundColor: "var(--tag-bg)",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${row.utilization}%`,
                              height: "100%",
                              borderRadius: "8px",
                              backgroundColor: "var(--primary)",
                            }}
                          />
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
                    }}
                  >
                    Employee Balance Snapshot
                  </h3>
                  <div style={{ display: "grid", gap: "12px" }}>
                    {[
                      {
                        employee: "Ava Johnson",
                        annual: "11",
                        sick: "6",
                        casual: "3",
                        comp: "2",
                      },
                      {
                        employee: "Rohan Mehta",
                        annual: "8",
                        sick: "7",
                        casual: "4",
                        comp: "1",
                      },
                      {
                        employee: "Noah Garcia",
                        annual: "9",
                        sick: "5",
                        casual: "2",
                        comp: "0",
                      },
                    ].map((row) => (
                      <div
                        key={row.employee}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1.6fr 1fr 1fr 1fr 1fr",
                          gap: "12px",
                          padding: "14px",
                          borderRadius: "12px",
                          border: "1px solid var(--border)",
                          backgroundColor: "var(--column-bg)",
                          fontSize: "13px",
                        }}
                      >
                        <div style={{ fontWeight: "700" }}>{row.employee}</div>
                        <div style={{ color: "var(--text-muted)" }}>
                          Annual: {row.annual}
                        </div>
                        <div style={{ color: "var(--text-muted)" }}>
                          Sick: {row.sick}
                        </div>
                        <div style={{ color: "var(--text-muted)" }}>
                          Casual: {row.casual}
                        </div>
                        <div
                          style={{
                            textAlign: "right",
                            color: "var(--text-muted)",
                          }}
                        >
                          Comp: {row.comp}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabContent>
          )}

          {activeTab === "policies" && (
            <TabContent key="policies" title="Policy Engine" showAdd={false}>
              <div style={{ display: "grid", gap: "24px" }}>
                <div className="glass-card" style={{ padding: "24px" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(260px, 1fr))",
                      gap: "14px",
                    }}
                  >
                    {[
                      "Leave eligibility by department and grades",
                      "Holiday and weekend auto-calculation rules",
                      "Half-day and sandwich leave conditions",
                      "Approval matrix by reporting hierarchy",
                      "Emergency leave and auto-escalation settings",
                      "Region/branch-specific leave policies",
                    ].map((item) => (
                      <div
                        key={item}
                        style={{
                          padding: "14px",
                          borderRadius: "12px",
                          border: "1px solid var(--border)",
                          backgroundColor: "var(--column-bg)",
                          fontSize: "13px",
                        }}
                      >
                        {item}
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
                    }}
                  >
                    Active Policy Packs
                  </h3>
                  <div style={{ display: "grid", gap: "12px" }}>
                    {[
                      {
                        policy: "India HQ Standard",
                        scope: "All permanent employees",
                        approvers: "Manager → HR Admin",
                        effective: "01 Apr 2026",
                      },
                      {
                        policy: "APAC Branch Variant",
                        scope: "Singapore and Malaysia branches",
                        approvers: "Manager → Org Admin",
                        effective: "01 Jan 2026",
                      },
                      {
                        policy: "Contractor Policy",
                        scope: "Project-based staff",
                        approvers: "Delivery Lead → HR Admin",
                        effective: "15 Feb 2026",
                      },
                    ].map((entry) => (
                      <div
                        key={entry.policy}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1.2fr 1.4fr 1fr 0.8fr",
                          gap: "12px",
                          padding: "14px",
                          borderRadius: "12px",
                          border: "1px solid var(--border)",
                          backgroundColor: "var(--column-bg)",
                          fontSize: "13px",
                        }}
                      >
                        <div style={{ fontWeight: "700" }}>{entry.policy}</div>
                        <div style={{ color: "var(--text-muted)" }}>
                          {entry.scope}
                        </div>
                        <div style={{ color: "var(--text-muted)" }}>
                          {entry.approvers}
                        </div>
                        <div
                          style={{
                            textAlign: "right",
                            color: "var(--text-muted)",
                          }}
                        >
                          {entry.effective}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabContent>
          )}

          {activeTab === "requests" && (
            <TabContent
              key="requests"
              title="Apply, Approve, Reject"
              showAdd={false}
            >
              <div style={{ display: "grid", gap: "24px" }}>
                <div className="glass-card" style={{ padding: "24px" }}>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      marginBottom: "16px",
                    }}
                  >
                    Request Queue
                  </h3>
                  <div style={{ display: "grid", gap: "12px" }}>
                    {[
                      {
                        employee: "Ava Johnson",
                        type: "Annual Leave",
                        dates: "Apr 10 - Apr 12",
                        status: "Pending",
                        reason: "Family travel",
                        approver: "Noah Garcia",
                      },
                      {
                        employee: "Rohan Mehta",
                        type: "Sick Leave",
                        dates: "Apr 08",
                        status: "Approved",
                        reason: "Medical rest",
                        approver: "Maya Patel",
                      },
                      {
                        employee: "Noah Garcia",
                        type: "Casual Leave",
                        dates: "Apr 17",
                        status: "Rejected",
                        reason: "Project deployment clash",
                        approver: "Ava Johnson",
                      },
                    ].map((request) => (
                      <div
                        key={`${request.employee}-${request.type}`}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1.2fr 1fr 0.9fr 1fr 0.8fr",
                          gap: "12px",
                          alignItems: "center",
                          padding: "14px",
                          borderRadius: "12px",
                          border: "1px solid var(--border)",
                          backgroundColor: "var(--column-bg)",
                          fontSize: "13px",
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: "700" }}>
                            {request.employee}
                          </div>
                          <div
                            style={{
                              color: "var(--text-muted)",
                              fontSize: "12px",
                            }}
                          >
                            {request.type}
                          </div>
                        </div>
                        <div style={{ color: "var(--text-muted)" }}>
                          {request.dates}
                        </div>
                        <div style={{ color: "var(--text-muted)" }}>
                          {request.reason}
                        </div>
                        <div style={{ color: "var(--text-muted)" }}>
                          {request.approver}
                        </div>
                        <div
                          style={{
                            textAlign: "right",
                            fontWeight: "700",
                            color:
                              request.status === "Approved"
                                ? "#10b981"
                                : request.status === "Rejected"
                                  ? "#ef4444"
                                  : "#f59e0b",
                          }}
                        >
                          {request.status}
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
                    }}
                  >
                    Workflow Timeline
                  </h3>
                  <div style={{ display: "grid", gap: "10px" }}>
                    {[
                      "10:05 AM · Ava Johnson submitted Annual Leave request",
                      "10:15 AM · Manager notified with SLA deadline",
                      "11:40 AM · Rohan Mehta request approved by Manager",
                      "01:10 PM · Payroll sync queued for approved encashment",
                      "02:25 PM · Noah Garcia request rejected with reason",
                    ].map((item) => (
                      <div
                        key={item}
                        style={{
                          padding: "12px 14px",
                          borderRadius: "10px",
                          border: "1px solid var(--border)",
                          backgroundColor: "var(--column-bg)",
                          fontSize: "13px",
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabContent>
          )}

          {activeTab === "calendar" && (
            <TabContent key="calendar" title="Leave Calendar" showAdd={false}>
              <div style={{ display: "grid", gap: "24px" }}>
                <div className="glass-card" style={{ padding: "24px" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(7, 1fr)",
                      gap: "10px",
                    }}
                  >
                    {Array.from({ length: 30 }, (_, idx) => idx + 1).map(
                      (day) => {
                        const isBusy = [3, 7, 10, 11, 12, 18, 22, 27].includes(
                          day,
                        );
                        return (
                          <div
                            key={day}
                            style={{
                              height: "58px",
                              borderRadius: "10px",
                              border: "1px solid var(--border)",
                              backgroundColor: isBusy
                                ? "var(--icon-bg)"
                                : "var(--column-bg)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "13px",
                              fontWeight: "600",
                              color: isBusy
                                ? "var(--primary)"
                                : "var(--text-main)",
                            }}
                          >
                            {day}
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "24px",
                  }}
                >
                  <div className="glass-card" style={{ padding: "24px" }}>
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        marginBottom: "16px",
                      }}
                    >
                      Calendar Legend
                    </h3>
                    <div style={{ display: "grid", gap: "10px" }}>
                      {[
                        { name: "Approved Leave", color: "#10b981" },
                        { name: "Pending Approval", color: "#f59e0b" },
                        { name: "Public Holiday", color: "#0ea5e9" },
                        { name: "Team Blackout", color: "#ef4444" },
                      ].map((item) => (
                        <div
                          key={item.name}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "10px 12px",
                            borderRadius: "10px",
                            border: "1px solid var(--border)",
                            backgroundColor: "var(--column-bg)",
                            fontSize: "13px",
                          }}
                        >
                          <span
                            style={{
                              width: "10px",
                              height: "10px",
                              borderRadius: "999px",
                              backgroundColor: item.color,
                            }}
                          />
                          {item.name}
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
                      }}
                    >
                      Upcoming Leave Events
                    </h3>
                    <div style={{ display: "grid", gap: "10px" }}>
                      {[
                        "Apr 10–12 · Ava Johnson · Annual Leave",
                        "Apr 14 · Company Holiday · Founders Day",
                        "Apr 17 · Noah Garcia · Casual Leave",
                        "Apr 22 · Release Freeze (No leave approvals)",
                      ].map((item) => (
                        <div
                          key={item}
                          style={{
                            padding: "12px 14px",
                            borderRadius: "10px",
                            border: "1px solid var(--border)",
                            backgroundColor: "var(--column-bg)",
                            fontSize: "13px",
                          }}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabContent>
          )}

          {activeTab === "encashment" && (
            <TabContent
              key="encashment"
              title="Leave Encashment Rules"
              showAdd={false}
            >
              <div style={{ display: "grid", gap: "24px" }}>
                <div className="glass-card" style={{ padding: "24px" }}>
                  <div style={{ display: "grid", gap: "12px" }}>
                    {[
                      "Encashment available for Annual Leave only",
                      "Maximum encashment cap: 10 days per financial year",
                      "Encashment requests require manager + payroll approval",
                      "Auto-map approved encashment into payroll run",
                    ].map((rule) => (
                      <div
                        key={rule}
                        style={{
                          padding: "14px",
                          borderRadius: "12px",
                          border: "1px solid var(--border)",
                          backgroundColor: "var(--column-bg)",
                          fontSize: "13px",
                        }}
                      >
                        {rule}
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
                    }}
                  >
                    Recent Encashment Requests
                  </h3>
                  <div style={{ display: "grid", gap: "12px" }}>
                    {[
                      {
                        employee: "Maya Patel",
                        days: "4",
                        amount: "$520",
                        status: "Approved",
                        run: "Apr Payroll",
                      },
                      {
                        employee: "Ava Johnson",
                        days: "3",
                        amount: "$420",
                        status: "Pending",
                        run: "Apr Payroll",
                      },
                      {
                        employee: "Rohan Mehta",
                        days: "2",
                        amount: "$260",
                        status: "Processed",
                        run: "Mar Payroll",
                      },
                    ].map((row) => (
                      <div
                        key={`${row.employee}-${row.days}`}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1.4fr 0.6fr 0.8fr 0.8fr 0.8fr",
                          gap: "12px",
                          padding: "14px",
                          borderRadius: "12px",
                          border: "1px solid var(--border)",
                          backgroundColor: "var(--column-bg)",
                          fontSize: "13px",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ fontWeight: "700" }}>{row.employee}</div>
                        <div style={{ color: "var(--text-muted)" }}>
                          {row.days} days
                        </div>
                        <div style={{ color: "var(--text-muted)" }}>
                          {row.amount}
                        </div>
                        <div
                          style={{
                            color:
                              row.status === "Approved" ||
                              row.status === "Processed"
                                ? "#10b981"
                                : "#f59e0b",
                            fontWeight: "700",
                          }}
                        >
                          {row.status}
                        </div>
                        <div
                          style={{
                            textAlign: "right",
                            color: "var(--text-muted)",
                          }}
                        >
                          {row.run}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabContent>
          )}

          {activeTab === "carry" && (
            <TabContent key="carry" title="Carry-Forward Rules" showAdd={false}>
              <div style={{ display: "grid", gap: "24px" }}>
                <div className="glass-card" style={{ padding: "24px" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(240px, 1fr))",
                      gap: "14px",
                    }}
                  >
                    {[
                      {
                        title: "Annual Leave",
                        detail: "Up to 5 days can carry to next cycle",
                      },
                      {
                        title: "Sick Leave",
                        detail: "No carry-forward; reset each cycle",
                      },
                      {
                        title: "Casual Leave",
                        detail: "Carry-forward disabled by policy",
                      },
                      {
                        title: "Comp-Off",
                        detail: "Valid for 90 days from allocation",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        style={{
                          padding: "16px",
                          borderRadius: "12px",
                          border: "1px solid var(--border)",
                          backgroundColor: "var(--column-bg)",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: "700",
                            marginBottom: "6px",
                          }}
                        >
                          {item.title}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "var(--text-muted)",
                          }}
                        >
                          {item.detail}
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
                    }}
                  >
                    Carry-Forward Exception Log
                  </h3>
                  <div style={{ display: "grid", gap: "10px" }}>
                    {[
                      "Exception approved: Sales leadership carry-forward override (7 days)",
                      "Exception rejected: Casual leave carry-forward request (policy blocked)",
                      "Comp-off extension granted for on-call incident coverage",
                      "Auto-expired balances archived with audit entry",
                    ].map((item) => (
                      <div
                        key={item}
                        style={{
                          padding: "12px 14px",
                          borderRadius: "10px",
                          border: "1px solid var(--border)",
                          backgroundColor: "var(--column-bg)",
                          fontSize: "13px",
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabContent>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Leave;
