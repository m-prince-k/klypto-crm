import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Users,
  FileSearch,
  LayoutDashboard,
  Calendar,
  ClipboardCheck,
  GraduationCap,
  FileSignature,
  UserPlus,
  Plus,
  Search,
  MoreVertical,
  Star,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowLeft,
} from "lucide-react";

const RecruitmentAssessment = () => {
  const [activeSubView, setActiveSubView] = useState("jobs");
  const [isAddingJob, setIsAddingJob] = useState(false);
  const navigate = useNavigate();
  const subViewNavRef = useRef(null);
  const dragStateRef = useRef({ isDragging: false, startX: 0, scrollLeft: 0 });

  const subViews = [
    { id: "jobs", label: "Job Manager", icon: <Briefcase size={18} /> },
    {
      id: "pipeline",
      label: "Candidate Pipeline",
      icon: <LayoutDashboard size={18} />,
    },
    {
      id: "assessments",
      label: "Online Tests",
      icon: <GraduationCap size={18} />,
    },
    { id: "interviews", label: "Scheduling", icon: <Calendar size={18} /> },
    {
      id: "scorecards",
      label: "Scorecards",
      icon: <ClipboardCheck size={18} />,
    },
    {
      id: "offers",
      label: "Offers & Onboarding",
      icon: <FileSignature size={18} />,
    },
  ];

  const candidates = [
    {
      id: "1",
      name: "John Doe",
      role: "Senior React Developer",
      stage: "Interview",
      score: 85,
      lastUpdate: "2h ago",
      avatar: "JD",
    },
    {
      id: "2",
      name: "Sarah Smith",
      role: "UI/UX Designer",
      stage: "Screening",
      score: 72,
      lastUpdate: "5h ago",
      avatar: "SS",
    },
    {
      id: "3",
      name: "Mike Johnson",
      role: "Backend Engineer",
      stage: "Technical Test",
      score: 92,
      lastUpdate: "1d ago",
      avatar: "MJ",
    },
    {
      id: "4",
      name: "Emily Brown",
      role: "Product Manager",
      stage: "Offered",
      score: 88,
      lastUpdate: "3d ago",
      avatar: "EB",
    },
  ];

  const jobs = [
    {
      id: "JOB-001",
      title: "Senior React Developer",
      dept: "Engineering",
      status: "Active",
      applicants: 24,
      posted: "2024-03-20",
    },
    {
      id: "JOB-002",
      title: "UI/UX Designer",
      dept: "Design",
      status: "Paused",
      applicants: 15,
      posted: "2024-03-18",
    },
    {
      id: "JOB-003",
      title: "Product Manager",
      dept: "Product",
      status: "Active",
      applicants: 12,
      posted: "2024-03-25",
    },
  ];

  useEffect(() => {
    const activeButton = subViewNavRef.current?.querySelector(
      `[data-subview="${activeSubView}"]`,
    );

    activeButton?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeSubView]);

  const handleSubViewDragStart = (event) => {
    if (!subViewNavRef.current) return;

    dragStateRef.current = {
      isDragging: true,
      startX: event.clientX,
      scrollLeft: subViewNavRef.current.scrollLeft,
    };

    subViewNavRef.current.classList.add("is-dragging");
  };

  const handleSubViewDragMove = (event) => {
    if (!dragStateRef.current.isDragging || !subViewNavRef.current) return;

    event.preventDefault();
    const deltaX = event.clientX - dragStateRef.current.startX;
    subViewNavRef.current.scrollLeft = dragStateRef.current.scrollLeft - deltaX;
  };

  const handleSubViewDragEnd = () => {
    dragStateRef.current.isDragging = false;
    subViewNavRef.current?.classList.remove("is-dragging");
  };

  const renderSubView = () => {
    switch (activeSubView) {
      case "jobs":
        return (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "300px",
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
                  placeholder="Search jobs..."
                  style={{
                    width: "100%",
                    padding: "10px 10px 10px 40px",
                    borderRadius: "8px",
                    backgroundColor: "var(--input-bg)",
                    border: "1px solid var(--border)",
                    color: "white",
                  }}
                />
              </div>
              <button
                className="btn-primary"
                onClick={() => setIsAddingJob(true)}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Plus size={18} /> Create Job Posting
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="glass-card"
                  style={{
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          fontSize: "16px",
                          fontWeight: "700",
                          marginBottom: "4px",
                        }}
                      >
                        {job.title}
                      </h4>
                      <span
                        style={{ fontSize: "13px", color: "var(--text-muted)" }}
                      >
                        {job.dept} • {job.id}
                      </span>
                    </div>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: "700",
                        backgroundColor:
                          job.status === "Active"
                            ? "rgba(16, 185, 129, 0.1)"
                            : "rgba(245, 158, 11, 0.1)",
                        color: job.status === "Active" ? "#10b981" : "#f59e0b",
                        flexShrink: 0,
                      }}
                    >
                      {job.status.toUpperCase()}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "13px",
                      gap: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        color: "var(--text-muted)",
                      }}
                    >
                      <Users size={16} /> {job.applicants} Applicants
                    </div>
                    <div style={{ color: "var(--text-muted)" }}>
                      Posted: {job.posted}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: "6px",
                        border: "1px solid var(--border)",
                        fontSize: "13px",
                        fontWeight: "600",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: "6px",
                        backgroundColor: "var(--icon-bg)",
                        color: "var(--primary)",
                        fontSize: "13px",
                        fontWeight: "600",
                      }}
                    >
                      View Pipeline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "pipeline":
        const stages = [
          "Applied",
          "Screening",
          "Technical Test",
          "Interview",
          "Offered",
        ];
        return (
          <div
            style={{
              display: "flex",
              gap: "20px",
              overflowX: "auto",
              paddingBottom: "20px",
              minHeight: "500px",
            }}
          >
            {stages.map((stage) => (
              <div
                key={stage}
                style={{
                  minWidth: "260px",
                  flex: "1 1 260px",
                  backgroundColor: "var(--column-bg)",
                  borderRadius: "12px",
                  padding: "16px",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "var(--text-muted)",
                    }}
                  >
                    {stage.toUpperCase()}{" "}
                    <span
                      style={{
                        marginLeft: "8px",
                        padding: "2px 8px",
                        backgroundColor: "var(--tag-bg)",
                        borderRadius: "10px",
                      }}
                    >
                      {candidates.filter((c) => c.stage === stage).length}
                    </span>
                  </h4>
                  <MoreVertical
                    size={16}
                    style={{ color: "var(--text-muted)" }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {candidates
                    .filter((c) => c.stage === stage)
                    .map((candidate) => (
                      <div
                        key={candidate.id}
                        className="glass-card"
                        style={{ padding: "16px", cursor: "grab" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            marginBottom: "12px",
                          }}
                        >
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              backgroundColor: "var(--primary)",
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "12px",
                              fontWeight: "700",
                            }}
                          >
                            {candidate.avatar}
                          </div>
                          <div>
                            <div
                              style={{ fontSize: "14px", fontWeight: "600" }}
                            >
                              {candidate.name}
                            </div>
                            <div
                              style={{
                                fontSize: "12px",
                                color: "var(--text-muted)",
                              }}
                            >
                              {candidate.role}
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                              fontSize: "12px",
                              color: "#10b981",
                              fontWeight: "700",
                            }}
                          >
                            <Star size={12} fill="#10b981" /> {candidate.score}%
                          </div>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <FileSearch
                              size={14}
                              style={{
                                color: "var(--text-muted)",
                                cursor: "pointer",
                              }}
                              title="Parse Resume"
                            />
                            <Clock
                              size={14}
                              style={{ color: "var(--text-muted)" }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  <button
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px dashed var(--border)",
                      borderRadius: "8px",
                      color: "var(--text-muted)",
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      marginTop: "4px",
                    }}
                  >
                    <Plus size={16} /> Add Candidate
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      case "assessments":
        return (
          <div
            className="glass-card recruitment-assessment"
            style={{ padding: "24px" }}
          >
            <div
              className="assessment-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
                marginBottom: "24px",
              }}
            >
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: "700" }}>
                  Assessment Management
                </h3>
                <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                  Manage online tests and technical challenges.
                </p>
              </div>
              <button
                className="btn-primary assessment-create-btn"
                style={{ whiteSpace: "nowrap" }}
              >
                Create New Test
              </button>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {[
                {
                  title: "React Fundamental Quiz",
                  time: "45 mins",
                  questions: 30,
                  level: "Intermediate",
                  taken: 124,
                },
                {
                  title: "System Design Challenge",
                  time: "120 mins",
                  questions: 5,
                  level: "Advanced",
                  taken: 45,
                },
                {
                  title: "UI/UX Interactive Audit",
                  time: "60 mins",
                  questions: 8,
                  level: "All Levels",
                  taken: 89,
                },
              ].map((test, index) => (
                <div
                  key={index}
                  className="assessment-card"
                  style={{
                    padding: "20px",
                    backgroundColor: "var(--tag-bg)",
                    borderRadius: "12px",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                  }}
                >
                  <div
                    className="assessment-card-main"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      minWidth: "0",
                    }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "10px",
                        backgroundColor: "var(--icon-bg)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--primary)",
                      }}
                    >
                      <GraduationCap size={24} />
                    </div>
                    <div>
                      <h4 style={{ fontWeight: "600" }}>{test.title}</h4>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "var(--text-muted)",
                          display: "flex",
                          gap: "12px",
                          marginTop: "4px",
                        }}
                      >
                        <span>
                          <Clock
                            size={12}
                            style={{
                              verticalAlign: "middle",
                              marginRight: "4px",
                            }}
                          />{" "}
                          {test.time}
                        </span>
                        <span>
                          <ClipboardCheck
                            size={12}
                            style={{
                              verticalAlign: "middle",
                              marginRight: "4px",
                            }}
                          />{" "}
                          {test.questions} Questions
                        </span>
                        <span>• {test.level}</span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="assessment-card-actions"
                    style={{ textAlign: "right", flexShrink: 0 }}
                  >
                    <div style={{ fontSize: "14px", fontWeight: "600" }}>
                      {test.taken} Taken
                    </div>
                    <button
                      className="assessment-results-btn"
                      style={{
                        color: "var(--primary)",
                        fontSize: "13px",
                        fontWeight: "700",
                        marginTop: "4px",
                      }}
                    >
                      Manage Results
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "interviews":
        return (
          <div
            className="recruitment-interviews-grid"
            style={{
              display: "grid",
              gap: "24px",
            }}
          >
            <div
              className="glass-card recruitment-schedule-panel"
              style={{ padding: "24px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                  marginBottom: "20px",
                }}
              >
                <h3 style={{ fontWeight: "700" }}>Upcoming Interviews</h3>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: "1px solid var(--border)",
                      fontSize: "13px",
                    }}
                  >
                    Today
                  </button>
                  <button
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: "1px solid var(--border)",
                      fontSize: "13px",
                    }}
                  >
                    Week
                  </button>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {[
                  {
                    time: "10:00 AM",
                    candidate: "John Doe",
                    type: "Technical Round 1",
                    mode: "Virtual",
                    interviewer: "Alex Chen",
                  },
                  {
                    time: "02:30 PM",
                    candidate: "Mike Johnson",
                    type: "Design Discussion",
                    mode: "On-site",
                    interviewer: "Sarah Wilson",
                  },
                  {
                    time: "04:00 PM",
                    candidate: "Emily Brown",
                    type: "HR Final Round",
                    mode: "Virtual",
                    interviewer: "David Miller",
                  },
                ].map((apt, i) => (
                  <div
                    key={i}
                    className="recruitment-schedule-card"
                    style={{
                      display: "flex",
                      gap: "20px",
                      padding: "16px",
                      borderLeft: "3px solid var(--primary)",
                      backgroundColor: "var(--tag-bg)",
                      borderRadius: "0 8px 8px 0",
                    }}
                  >
                    <div
                      style={{
                        minWidth: "80px",
                        fontWeight: "700",
                        fontSize: "14px",
                      }}
                    >
                      {apt.time}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "600" }}>{apt.candidate}</div>
                      <div
                        style={{ fontSize: "12px", color: "var(--text-muted)" }}
                      >
                        {apt.type} • {apt.mode}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", fontSize: "12px" }}>
                      <div style={{ color: "var(--text-muted)" }}>
                        Interviewer
                      </div>
                      <div style={{ fontWeight: "600" }}>{apt.interviewer}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="glass-card recruitment-scheduler-panel"
              style={{ padding: "24px" }}
            >
              <h3 style={{ fontWeight: "700", marginBottom: "16px" }}>
                Quick Scheduler
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      marginBottom: "6px",
                      color: "var(--text-muted)",
                    }}
                  >
                    Select Candidate
                  </label>
                  <select
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "8px",
                      backgroundColor: "var(--input-bg)",
                      border: "1px solid var(--border)",
                      color: "white",
                    }}
                  >
                    {candidates.map((c) => (
                      <option key={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      marginBottom: "6px",
                      color: "var(--text-muted)",
                    }}
                  >
                    Interview Type
                  </label>
                  <select
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "8px",
                      backgroundColor: "var(--input-bg)",
                      border: "1px solid var(--border)",
                      color: "white",
                    }}
                  >
                    <option>Technical Round 1</option>
                    <option>Technical Round 2</option>
                    <option>Culture Fit</option>
                    <option>HR Interview</option>
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      marginBottom: "6px",
                      color: "var(--text-muted)",
                    }}
                  >
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "8px",
                      backgroundColor: "var(--input-bg)",
                      border: "1px solid var(--border)",
                      color: "white",
                    }}
                  />
                </div>
                <button className="btn-primary" style={{ marginTop: "8px" }}>
                  Schedule Interview
                </button>
              </div>
            </div>
          </div>
        );

      case "scorecards":
        return (
          <div
            className="glass-card recruitment-scorecards"
            style={{ padding: "24px" }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "700",
                marginBottom: "20px",
              }}
            >
              Evaluation Scorecards
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {candidates
                .filter((c) => c.score > 0)
                .map((c) => (
                  <div
                    key={c.id}
                    className="recruitment-scorecard"
                    style={{
                      padding: "20px",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                    }}
                  >
                    <div
                      className="recruitment-scorecard-header"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "12px",
                        flexWrap: "wrap",
                        marginBottom: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: "var(--primary)",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "700",
                          }}
                        >
                          {c.avatar}
                        </div>
                        <div>
                          <div style={{ fontWeight: "600" }}>{c.name}</div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "var(--text-muted)",
                            }}
                          >
                            {c.role}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "20px",
                            fontWeight: "800",
                            color: "var(--primary)",
                          }}
                        >
                          {c.score}/100
                        </span>
                        <CheckCircle2 size={20} style={{ color: "#10b981" }} />
                      </div>
                    </div>
                    <div
                      className="responsive-grid-4"
                      style={{
                        display: "grid",
                        gap: "12px",
                      }}
                    >
                      {[
                        { label: "Technical Skills", val: 90 },
                        { label: "Communication", val: 75 },
                        { label: "Problem Solving", val: 85 },
                        { label: "Company Fit", val: 95 },
                      ].map((metric, i) => (
                        <div
                          key={i}
                          style={{
                            padding: "12px",
                            backgroundColor: "var(--tag-bg)",
                            borderRadius: "8px",
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "11px",
                              color: "var(--text-muted)",
                              marginBottom: "4px",
                            }}
                          >
                            {metric.label}
                          </div>
                          <div style={{ fontWeight: "700" }}>{metric.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        );

      case "offers":
        return (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            <div
              className="recruitment-offers-grid responsive-grid-2"
              style={{
                display: "grid",
                gap: "20px",
              }}
            >
              <div
                className="glass-card recruitment-offer-panel"
                style={{ padding: "24px" }}
              >
                <h3
                  style={{
                    fontWeight: "700",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <FileSignature size={20} color="var(--primary)" /> Offer
                  Workflow
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {[
                    {
                      candidate: "Emily Brown",
                      role: "Product Manager",
                      status: "Sent",
                      date: "Mar 24",
                    },
                    {
                      candidate: "James Wilson",
                      role: "Sales Lead",
                      status: "Draft",
                      date: "Mar 26",
                    },
                  ].map((offer, i) => (
                    <div
                      key={i}
                      className="recruitment-offer-row"
                      style={{
                        padding: "16px",
                        backgroundColor: "var(--input-bg)",
                        borderRadius: "10px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "12px",
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: "600" }}>
                          {offer.candidate}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "var(--text-muted)",
                          }}
                        >
                          {offer.role}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span
                          style={{
                            fontSize: "11px",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            backgroundColor: "var(--tag-bg)",
                            color:
                              offer.status === "Sent"
                                ? "#10b981"
                                : "var(--text-muted)",
                          }}
                        >
                          {offer.status.toUpperCase()}
                        </span>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "var(--text-muted)",
                            marginTop: "4px",
                          }}
                        >
                          {offer.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="glass-card recruitment-onboarding-panel"
                style={{ padding: "24px" }}
              >
                <h3
                  style={{
                    fontWeight: "700",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <UserPlus size={20} color="#10b981" /> Pending Onboarding
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {[
                    {
                      candidate: "Robert Fox",
                      role: "QA Engineer",
                      progress: 65,
                      start: "Apr 10",
                    },
                    {
                      candidate: "Jane Cooper",
                      role: "Data Analyst",
                      progress: 20,
                      start: "Apr 15",
                    },
                  ].map((onb, i) => (
                    <div
                      key={i}
                      className="recruitment-onboarding-row"
                      style={{
                        padding: "16px",
                        backgroundColor: "var(--input-bg)",
                        borderRadius: "10px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "12px",
                          flexWrap: "wrap",
                          marginBottom: "8px",
                        }}
                      >
                        <div style={{ fontWeight: "600", fontSize: "14px" }}>
                          {onb.candidate}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "var(--text-muted)",
                          }}
                        >
                          Starts {onb.start}
                        </div>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          height: "6px",
                          backgroundColor: "var(--border)",
                          borderRadius: "3px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${onb.progress}%`,
                            height: "100%",
                            backgroundColor: "#10b981",
                          }}
                        ></div>
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "var(--text-muted)",
                          marginTop: "6px",
                          textAlign: "right",
                        }}
                      >
                        {onb.progress}% Complete
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: "24px" }}>
              <h3 style={{ fontWeight: "700", marginBottom: "20px" }}>
                Candidate Portal Preview
              </h3>
              <div
                className="recruitment-portal-preview"
                style={{
                  padding: "40px",
                  backgroundColor: "var(--bg-dark)",
                  borderRadius: "12px",
                  border: "1px solid var(--primary)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    backgroundColor: "var(--primary)",
                    fontSize: "10px",
                    color: "white",
                    fontWeight: "800",
                  }}
                >
                  EXTERNALLY VISIBLE
                </div>
                <div style={{ maxWidth: "600px", margin: "0 auto" }}>
                  <h2
                    style={{
                      fontSize: "24px",
                      fontWeight: "800",
                      textAlign: "center",
                      marginBottom: "8px",
                    }}
                  >
                    Welcome, John!
                  </h2>
                  <p
                    style={{
                      textAlign: "center",
                      color: "var(--text-muted)",
                      marginBottom: "32px",
                    }}
                  >
                    Track your application progress with Klypto Inc.
                  </p>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                    }}
                  >
                    <div
                      className="glass-card"
                      style={{
                        padding: "20px",
                        border: "1px solid var(--primary)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "var(--text-muted)",
                            }}
                          >
                            Current Status
                          </div>
                          <div
                            style={{
                              fontSize: "18px",
                              fontWeight: "700",
                              color: "var(--primary)",
                            }}
                          >
                            Interview Scheduled
                          </div>
                        </div>
                        <Calendar
                          size={32}
                          color="var(--primary)"
                          opacity={0.5}
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      <h4 style={{ fontSize: "14px", fontWeight: "700" }}>
                        Your Next Steps
                      </h4>
                      {[
                        { task: "Confirm interview attendance", done: true },
                        {
                          task: "Review Technical Challenge results",
                          done: true,
                        },
                        { task: "Upload identity documents", done: false },
                      ].map((t, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "12px",
                            backgroundColor: "var(--tag-bg)",
                            borderRadius: "8px",
                          }}
                        >
                          {t.done ? (
                            <CheckCircle2 size={18} color="#10b981" />
                          ) : (
                            <Clock size={18} color="var(--text-muted)" />
                          )}
                          <span
                            style={{
                              fontSize: "14px",
                              color: t.done ? "var(--text-muted)" : "white",
                              textDecoration: t.done ? "line-through" : "none",
                            }}
                          >
                            {t.task}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <header
        className="module-header"
        style={{ display: "flex", alignItems: "center", gap: "16px" }}
      >
        <button
          onClick={() => navigate(-1)}
          className="glass-card"
          style={{
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted)",
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 style={{ fontSize: "24px", fontWeight: "800" }}>
            Recruitment & Assessment
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Manage jobs, candidates, and hiring workflows.
          </p>
        </div>
      </header>

      {/* Sub-navigation */}
      <div
        ref={subViewNavRef}
        className="glass-card recruitment-subnav"
        onPointerDown={handleSubViewDragStart}
        onPointerMove={handleSubViewDragMove}
        onPointerUp={handleSubViewDragEnd}
        onPointerLeave={handleSubViewDragEnd}
        onPointerCancel={handleSubViewDragEnd}
        style={{
          display: "flex",
          gap: "4px",
          alignContent: "center",
          flexWrap: "nowrap",
          justifyContent: "flex-start",
          alignItems: "stretch",
          minHeight: "52px",
          padding: "6px",
          width: "100%",
          maxWidth: "100%",
          overflowX: "auto",
          overflowY: "hidden",
          scrollBehavior: "smooth",
          touchAction: "pan-x",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          cursor: "grab",
        }}
      >
        {subViews.map((view) => (
          <button
            key={view.id}
            data-subview={view.id}
            className="recruitment-subnav-item"
            onClick={() => setActiveSubView(view.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              transition: "all 0.2s ease",
              color: activeSubView === view.id ? "white" : "var(--text-muted)",
              backgroundColor:
                activeSubView === view.id ? "var(--primary)" : "transparent",
              flex: "0 0 auto",
              whiteSpace: "nowrap",
              scrollSnapAlign: "center",
            }}
          >
            {view.icon}
            {view.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1 }}>{renderSubView()}</div>

      {/* Mock Resume Parsing Modal */}
      {isAddingJob && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="glass-card"
            style={{ width: "500px", padding: "32px", position: "relative" }}
          >
            <button
              onClick={() => setIsAddingJob(false)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                color: "var(--text-muted)",
              }}
            >
              <XCircle size={24} />
            </button>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "800",
                marginBottom: "24px",
              }}
            >
              Create New Job Posting
            </h2>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    marginBottom: "6px",
                    color: "var(--text-muted)",
                  }}
                >
                  Job Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Frontend Engineer"
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    backgroundColor: "var(--input-bg)",
                    border: "1px solid var(--border)",
                    color: "white",
                  }}
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      marginBottom: "6px",
                      color: "var(--text-muted)",
                    }}
                  >
                    Department
                  </label>
                  <select
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      backgroundColor: "var(--input-bg)",
                      border: "1px solid var(--border)",
                      color: "white",
                    }}
                  >
                    <option>Engineering</option>
                    <option>Design</option>
                    <option>Marketing</option>
                    <option>Sales</option>
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      marginBottom: "6px",
                      color: "var(--text-muted)",
                    }}
                  >
                    Type
                  </label>
                  <select
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      backgroundColor: "var(--input-bg)",
                      border: "1px solid var(--border)",
                      color: "white",
                    }}
                  >
                    <option>Full-time</option>
                    <option>Contract</option>
                    <option>Part-time</option>
                    <option>Remote</option>
                  </select>
                </div>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    marginBottom: "6px",
                    color: "var(--text-muted)",
                  }}
                >
                  Description
                </label>
                <textarea
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    backgroundColor: "var(--input-bg)",
                    border: "1px solid var(--border)",
                    color: "white",
                  }}
                  placeholder="Enter job description..."
                ></textarea>
              </div>
              <button className="btn-primary" style={{ padding: "14px" }}>
                Create & Publish Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruitmentAssessment;
