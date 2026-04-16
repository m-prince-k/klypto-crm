import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  Clock3,
  Wallet2,
  UserCircle2,
  CalendarDays,
  ShieldAlert,
  Loader,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import apiClient from "../api/apiClient";

const initialLeaveForm = {
  type: "Annual",
  startDate: "",
  endDate: "",
  reason: "",
};
const initialComplaintForm = {
  subject: "",
  category: "General",
  description: "",
  severity: "Medium",
  isAnonymous: false,
};

const toCurrency = (value) =>
  value === null || value === undefined
    ? "-"
    : Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 });

const getStatusStyle = (status) => {
  if (status === "Approved" || status === "Resolved") {
    return { backgroundColor: "var(--tag-bg)", color: "var(--text-main)" };
  }

  if (status === "Rejected" || status === "Escalated") {
    return { backgroundColor: "var(--tag-bg)", color: "var(--text-main)" };
  }

  return { backgroundColor: "var(--tag-bg)", color: "var(--text-muted)" };
};

const fieldLabelStyle = {
  fontSize: "12px",
  color: "var(--text-main)",
  opacity: 0.78,
};

const inputStyle = {
  padding: "10px 12px",
  backgroundColor: "var(--input-bg)",
  color: "var(--text-main)",
  border: "1px solid var(--border)",
  width: "100%",
};

const EmployeePortal = () => {
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [employeeId, setEmployeeId] = useState(null);

  const [employee, setEmployee] = useState(null);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [salaryStructure, setSalaryStructure] = useState(null);
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [complaints, setComplaints] = useState([]);

  const [leaveForm, setLeaveForm] = useState(initialLeaveForm);
  const [complaintForm, setComplaintForm] = useState(initialComplaintForm);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [leaveStatusFilter, setLeaveStatusFilter] = useState("All");
  const [complaintStatusFilter, setComplaintStatusFilter] = useState("All");

  const todayIsoDate = useMemo(() => {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  }, []);

  const fetchEmployeeData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const myEmployeeRes = await apiClient.get("/leaves/my-employee-id");
      const myEmployeeId = myEmployeeRes.data?.employeeId || null;
      setEmployeeId(myEmployeeId);

      if (!myEmployeeId) {
        setEmployee(null);
        setTodayAttendance(null);
        setSalaryStructure(null);
        setPayrollRecords([]);
        setLeaveRequests([]);
        setComplaints([]);

        return;
      }

      const [
        employeesRes,
        attendanceRes,
        salaryRes,
        payrollRes,
        leaveRes,
        grievanceRes,
      ] = await Promise.all([
        apiClient.get("/employees"),
        apiClient.get(`/attendance?date=${todayIsoDate}`),
        apiClient.get("/payroll/structures"),
        apiClient.get("/payroll/records"),
        apiClient.get("/leaves"),
        apiClient.get("/grievances"),
      ]);

      const employeeRecord =
        employeesRes.data.find((item) => item.id === myEmployeeId) || null;
      const attendanceRecord =
        attendanceRes.data.find((item) => item.employeeId === myEmployeeId) ||
        null;
      const salaryRecord =
        salaryRes.data.find((item) => item.employeeId === myEmployeeId) || null;
      const payrollHistory = payrollRes.data.filter(
        (item) => item.employeeId === myEmployeeId,
      );
      const myLeaves = leaveRes.data.filter(
        (item) => item.employeeId === myEmployeeId,
      );
      const myComplaints = grievanceRes.data.filter(
        (item) => item.employeeId === myEmployeeId,
      );

      setEmployee(employeeRecord);
      setTodayAttendance(attendanceRecord);
      setSalaryStructure(salaryRecord);
      setPayrollRecords(payrollHistory);
      setLeaveRequests(myLeaves);
      setComplaints(myComplaints);
    } catch (fetchError) {
      const message =
        fetchError.response?.data?.message ||
        "Failed to load employee portal data";
      setError(message);
      toast.error(
        Array.isArray(message) ? message.join(", ") : String(message),
      );
    } finally {
      setLoading(false);
    }
  }, [todayIsoDate]);

  useEffect(() => {
    fetchEmployeeData();
  }, [fetchEmployeeData]);

  const handleCheckIn = async () => {
    if (!employeeId) return;

    setActionLoading("checkin");
    setError("");
    setSuccessMessage("");

    try {
      await apiClient.post("/attendance", {
        employeeId,
        date: todayIsoDate,
        status: "Present",
        checkIn: new Date().toISOString(),
      });
      setSuccessMessage("Check-in recorded successfully.");
      toast.success("Check-in recorded successfully");
      await fetchEmployeeData();
    } catch (checkInError) {
      const message = checkInError.response?.data?.message || "Check-in failed";
      setError(message);
      toast.error(
        Array.isArray(message) ? message.join(", ") : String(message),
      );
    } finally {
      setActionLoading("");
    }
  };

  const handleLeaveSubmit = async (event) => {
    event.preventDefault();
    if (!employeeId) return;

    if (!leaveForm.startDate || !leaveForm.endDate) {
      setError("Please select both start and end date for leave.");
      toast.error("Please select both start and end date for leave");
      return;
    }

    if (new Date(leaveForm.endDate) < new Date(leaveForm.startDate)) {
      setError("Leave end date cannot be before start date.");
      toast.error("Leave end date cannot be before start date");
      return;
    }

    setActionLoading("leave");
    setError("");
    setSuccessMessage("");

    try {
      await apiClient.post("/leaves", {
        ...leaveForm,
        employeeId,
        reason: leaveForm.reason.trim(),
        startDate: new Date(leaveForm.startDate).toISOString(),
        endDate: new Date(leaveForm.endDate).toISOString(),
      });
      setLeaveForm(initialLeaveForm);
      setSuccessMessage("Leave request submitted.");
      toast.success("Leave request submitted");
      await fetchEmployeeData();
    } catch (leaveError) {
      const message =
        leaveError.response?.data?.message || "Leave request failed";
      setError(message);
      toast.error(
        Array.isArray(message) ? message.join(", ") : String(message),
      );
    } finally {
      setActionLoading("");
    }
  };

  const handleComplaintSubmit = async (event) => {
    event.preventDefault();
    if (!employeeId) return;

    if (!complaintForm.subject.trim() || !complaintForm.description.trim()) {
      setError("Subject and complaint description are required.");
      toast.error("Subject and complaint description are required");
      return;
    }

    setActionLoading("complaint");
    setError("");
    setSuccessMessage("");

    try {
      await apiClient.post("/grievances", {
        ...complaintForm,
        subject: complaintForm.subject.trim(),
        category: complaintForm.category.trim(),
        description: complaintForm.description.trim(),
        employeeId,
      });
      setComplaintForm(initialComplaintForm);
      setSuccessMessage("Complaint submitted successfully.");
      toast.success("Complaint submitted successfully");
      await fetchEmployeeData();
    } catch (complaintError) {
      const message =
        complaintError.response?.data?.message || "Complaint submission failed";
      setError(message);
      toast.error(
        Array.isArray(message) ? message.join(", ") : String(message),
      );
    } finally {
      setActionLoading("");
    }
  };

  const latestPayroll = payrollRecords[0] || null;
  const canCheckIn = !todayAttendance?.checkIn;

  const leaveSubmitDisabled =
    actionLoading === "leave" || !leaveForm.startDate || !leaveForm.endDate;
  const complaintSubmitDisabled =
    actionLoading === "complaint" ||
    !complaintForm.subject.trim() ||
    !complaintForm.description.trim();
  const filteredLeaveRequests = leaveRequests.filter(
    (leave) =>
      leaveStatusFilter === "All" || leave.status === leaveStatusFilter,
  );
  const filteredComplaints = complaints.filter(
    (complaint) =>
      complaintStatusFilter === "All" ||
      complaint.status === complaintStatusFilter,
  );

  if (loading) {
    return (
      <div
        style={{
          height: "320px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader className="spinner" size={30} />
      </div>
    );
  }

  return (
    <div
      className="employee-portal"
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <div className="glass-card" style={{ padding: "20px" }}>
        <h1
          style={{ fontSize: "28px", fontWeight: "800", marginBottom: "6px" }}
        >
          Employee Self Service
        </h1>
        <p style={{ color: "var(--text-muted)" }}>
          Check in, view your salary and profile details, apply leaves, and
          raise complaints.
        </p>
      </div>

      {error && (
        <div
          className="glass-card"
          style={{
            padding: "14px 16px",
            color: "var(--text-main)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <AlertCircle size={16} />
          {Array.isArray(error) ? error.join(", ") : String(error)}
        </div>
      )}

      {successMessage && (
        <div
          className="glass-card"
          style={{
            padding: "14px 16px",
            color: "var(--text-main)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <CheckCircle2 size={16} />
          {successMessage}
        </div>
      )}

      {!employeeId ? (
        <div
          className="glass-card"
          style={{ padding: "20px", color: "var(--text-muted)" }}
        >
          Your account is not linked to an employee record yet. Contact
          HR/Admin.
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "14px",
            }}
          >
            <div className="glass-card" style={{ padding: "16px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "8px",
                }}
              >
                <Clock3 size={18} />
                <span style={{ fontWeight: "700" }}>Today Check-in</span>
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "var(--text-muted)",
                  marginBottom: "10px",
                }}
              >
                {todayAttendance?.checkIn
                  ? `Checked in at ${new Date(todayAttendance.checkIn).toLocaleTimeString()}`
                  : "No check-in recorded for today"}
              </div>
              <button
                className="btn-primary"
                onClick={handleCheckIn}
                disabled={!canCheckIn || actionLoading === "checkin"}
              >
                {actionLoading === "checkin"
                  ? "Saving..."
                  : canCheckIn
                    ? "Check In"
                    : "Checked In"}
              </button>
            </div>

            <div className="glass-card" style={{ padding: "16px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "8px",
                }}
              >
                <Wallet2 size={18} />
                <span style={{ fontWeight: "700" }}>Salary Details</span>
              </div>
              <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                Basic:{" "}
                {salaryStructure
                  ? toCurrency(salaryStructure.basicSalary)
                  : "-"}
              </div>
              <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                Allowances:{" "}
                {salaryStructure ? toCurrency(salaryStructure.allowances) : "-"}
              </div>
              <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                Deductions:{" "}
                {salaryStructure ? toCurrency(salaryStructure.deductions) : "-"}
              </div>
              <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                Net (latest):{" "}
                {latestPayroll ? toCurrency(latestPayroll.netPay) : "-"}
              </div>
            </div>

            <div className="glass-card" style={{ padding: "16px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "8px",
                }}
              >
                <UserCircle2 size={18} />
                <span style={{ fontWeight: "700" }}>My Details</span>
              </div>
              <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                Name: {employee?.name || user?.fullName || "-"}
              </div>
              <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                Dept: {employee?.department || "-"}
              </div>
              <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                Role: {employee?.role || "-"}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "14px",
            }}
          >
            <div className="glass-card" style={{ padding: "18px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "14px",
                }}
              >
                <CalendarDays size={18} />
                <h3 style={{ fontWeight: "700" }}>Apply Leave</h3>
              </div>

              <form
                onSubmit={handleLeaveSubmit}
                style={{ display: "grid", gap: "10px" }}
              >
                <label style={fieldLabelStyle}>Leave Type</label>
                <select
                  value={leaveForm.type}
                  onChange={(event) =>
                    setLeaveForm((prev) => ({
                      ...prev,
                      type: event.target.value,
                    }))
                  }
                  className="glass-card"
                  style={inputStyle}
                >
                  {[
                    "Annual",
                    "Sick",
                    "Casual",
                    "Maternity",
                    "Paternity",
                    "Unpaid",
                  ].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                <label style={fieldLabelStyle}>Start Date</label>
                <input
                  type="date"
                  required
                  value={leaveForm.startDate}
                  onChange={(event) =>
                    setLeaveForm((prev) => ({
                      ...prev,
                      startDate: event.target.value,
                    }))
                  }
                  className="glass-card"
                  style={inputStyle}
                />

                <label style={fieldLabelStyle}>End Date</label>
                <input
                  type="date"
                  required
                  value={leaveForm.endDate}
                  onChange={(event) =>
                    setLeaveForm((prev) => ({
                      ...prev,
                      endDate: event.target.value,
                    }))
                  }
                  className="glass-card"
                  style={inputStyle}
                />

                <textarea
                  rows={3}
                  placeholder="Reason (optional)"
                  value={leaveForm.reason}
                  onChange={(event) =>
                    setLeaveForm((prev) => ({
                      ...prev,
                      reason: event.target.value,
                    }))
                  }
                  className="glass-card"
                  style={{ ...inputStyle, resize: "vertical" }}
                />

                <button className="btn-primary" disabled={leaveSubmitDisabled}>
                  {actionLoading === "leave"
                    ? "Submitting..."
                    : "Submit Leave Request"}
                </button>
              </form>

              <div
                style={{
                  marginTop: "12px",
                  fontSize: "13px",
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <span>
                  My leave requests: {filteredLeaveRequests.length} /{" "}
                  {leaveRequests.length}
                </span>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      letterSpacing: "0.4px",
                    }}
                  >
                    FILTER LEAVE STATUS
                  </span>
                  <select
                    value={leaveStatusFilter}
                    onChange={(event) =>
                      setLeaveStatusFilter(event.target.value)
                    }
                    style={{
                      padding: "6px 8px",
                      borderRadius: "8px",
                      backgroundColor: "var(--input-bg)",
                      border: "1px solid var(--border)",
                      color: "var(--text-main)",
                      fontSize: "12px",
                    }}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending Only</option>
                    <option value="Approved">Approved Only</option>
                    <option value="Rejected">Rejected Only</option>
                  </select>
                </div>
              </div>

              <div
                style={{
                  marginTop: "10px",
                  display: "grid",
                  gap: "8px",
                  maxHeight: "180px",
                  overflowY: "auto",
                }}
              >
                {filteredLeaveRequests.slice(0, 6).map((leave) => (
                  <div
                    key={leave.id}
                    style={{
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      padding: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: "13px", fontWeight: "600" }}>
                        {leave.type}
                      </div>
                      <div
                        style={{ fontSize: "12px", color: "var(--text-muted)" }}
                      >
                        {new Date(leave.startDate).toLocaleDateString()} -{" "}
                        {new Date(leave.endDate).toLocaleDateString()}
                      </div>
                    </div>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "999px",
                        fontSize: "11px",
                        fontWeight: "600",
                        ...getStatusStyle(leave.status),
                      }}
                    >
                      {leave.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card" style={{ padding: "18px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "14px",
                }}
              >
                <ShieldAlert size={18} />
                <h3 style={{ fontWeight: "700" }}>Post Complaint</h3>
              </div>

              <form
                onSubmit={handleComplaintSubmit}
                style={{ display: "grid", gap: "10px" }}
              >
                <label style={fieldLabelStyle}>Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Subject"
                  value={complaintForm.subject}
                  onChange={(event) =>
                    setComplaintForm((prev) => ({
                      ...prev,
                      subject: event.target.value,
                    }))
                  }
                  className="glass-card"
                  style={inputStyle}
                />

                <label style={fieldLabelStyle}>Category</label>
                <input
                  type="text"
                  required
                  placeholder="Category"
                  value={complaintForm.category}
                  onChange={(event) =>
                    setComplaintForm((prev) => ({
                      ...prev,
                      category: event.target.value,
                    }))
                  }
                  className="glass-card"
                  style={inputStyle}
                />

                <label style={fieldLabelStyle}>Severity</label>
                <select
                  value={complaintForm.severity}
                  onChange={(event) =>
                    setComplaintForm((prev) => ({
                      ...prev,
                      severity: event.target.value,
                    }))
                  }
                  className="glass-card"
                  style={inputStyle}
                >
                  {["Low", "Medium", "High", "Critical"].map((severity) => (
                    <option key={severity} value={severity}>
                      {severity}
                    </option>
                  ))}
                </select>

                <label style={fieldLabelStyle}>Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your complaint"
                  value={complaintForm.description}
                  onChange={(event) =>
                    setComplaintForm((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  className="glass-card"
                  style={{ ...inputStyle, resize: "vertical" }}
                />

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "var(--text-muted)",
                    fontSize: "13px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={complaintForm.isAnonymous}
                    onChange={(event) =>
                      setComplaintForm((prev) => ({
                        ...prev,
                        isAnonymous: event.target.checked,
                      }))
                    }
                  />
                  Submit anonymously
                </label>

                <button
                  className="btn-primary"
                  disabled={complaintSubmitDisabled}
                >
                  {actionLoading === "complaint"
                    ? "Submitting..."
                    : "Submit Complaint"}
                </button>
              </form>

              <div
                style={{
                  marginTop: "12px",
                  fontSize: "13px",
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <span>
                  My complaints: {filteredComplaints.length} /{" "}
                  {complaints.length}
                </span>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      letterSpacing: "0.4px",
                    }}
                  >
                    FILTER COMPLAINT STATUS
                  </span>
                  <select
                    value={complaintStatusFilter}
                    onChange={(event) =>
                      setComplaintStatusFilter(event.target.value)
                    }
                    style={{
                      padding: "6px 8px",
                      borderRadius: "8px",
                      backgroundColor: "var(--input-bg)",
                      border: "1px solid var(--border)",
                      color: "var(--text-main)",
                      fontSize: "12px",
                    }}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Open">Open Only</option>
                    <option value="In Review">In Review Only</option>
                    <option value="Escalated">Escalated Only</option>
                    <option value="Resolved">Resolved Only</option>
                  </select>
                </div>
              </div>

              <div
                style={{
                  marginTop: "10px",
                  display: "grid",
                  gap: "8px",
                  maxHeight: "180px",
                  overflowY: "auto",
                }}
              >
                {filteredComplaints.slice(0, 6).map((complaint) => (
                  <div
                    key={complaint.id}
                    style={{
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      padding: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: "600",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "220px",
                        }}
                      >
                        {complaint.subject}
                      </div>
                      <div
                        style={{ fontSize: "12px", color: "var(--text-muted)" }}
                      >
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "999px",
                        fontSize: "11px",
                        fontWeight: "600",
                        ...getStatusStyle(complaint.status),
                      }}
                    >
                      {complaint.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EmployeePortal;
