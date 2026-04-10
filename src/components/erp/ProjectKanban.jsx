import React, { useState, useEffect, useRef } from "react";
import {
  MoreHorizontal,
  Plus,
  Calendar,
  User as UserIcon,
  Loader,
  Trash2,
  CheckCircle,
  ChevronDown,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "../../api/apiClient";

const ProjectKanban = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
  });
  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
    status: "Active",
  });
  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // ID of task being updated
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const projectDropdownRef = useRef(null);

  const fetchData = async () => {
    try {
      const [projectsRes, tasksRes] = await Promise.all([
        apiClient.get("/projects"),
        apiClient.get("/projects/tasks"),
      ]);
      setProjects(projectsRes.data);
      if (projectsRes.data.length > 0 && !selectedProject) {
        setSelectedProject(projectsRes.data[0]);
      }
      setTasks(tasksRes.data);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        showProjectDropdown &&
        projectDropdownRef.current &&
        !projectDropdownRef.current.contains(event.target)
      ) {
        setShowProjectDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showProjectDropdown]);

  useEffect(() => {
    if (!projects.length) {
      setSelectedProject(null);
      return;
    }

    if (!selectedProject) {
      setSelectedProject(projects[0]);
      return;
    }

    const matchedProject = projects.find(
      (project) => project.id === selectedProject.id,
    );
    if (!matchedProject) {
      setSelectedProject(projects[0]);
    }
  }, [projects, selectedProject]);

  const handleStatusChange = async (taskId, newStatus) => {
    setActionLoading(taskId);
    try {
      await apiClient.patch(`/projects/tasks/${taskId}`, { status: newStatus });
      fetchData();
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDragStart = (event, taskId) => {
    setDraggedTaskId(taskId);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  const handleColumnDragOver = (event, columnId) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleColumnDrop = async (event, columnId) => {
    event.preventDefault();

    const droppedTaskId =
      draggedTaskId || event.dataTransfer.getData("text/plain");
    if (!droppedTaskId) return;

    const currentTask = tasks.find((task) => task.id === droppedTaskId);
    if (!currentTask) {
      setDraggedTaskId(null);
      setDragOverColumn(null);
      return;
    }

    if (currentTask.status === columnId) {
      setDraggedTaskId(null);
      setDragOverColumn(null);
      return;
    }

    const previousTasks = tasks;
    const nextTasks = tasks.map((task) =>
      task.id === droppedTaskId ? { ...task, status: columnId } : task,
    );

    setTasks(nextTasks);
    setActionLoading(droppedTaskId);

    try {
      await apiClient.patch(`/projects/tasks/${droppedTaskId}`, {
        status: columnId,
      });
    } catch (err) {
      setTasks(previousTasks);
      alert("Failed to update task status");
    } finally {
      setActionLoading(null);
      setDraggedTaskId(null);
      setDragOverColumn(null);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!selectedProject) return;
    setSubmitting(true);
    try {
      await apiClient.post("/projects/tasks", {
        ...newTask,
        projectId: selectedProject.id,
      });
      setShowTaskModal(false);
      setNewTask({ title: "", description: "", priority: "Medium" });
      fetchData();
    } catch (err) {
      alert("Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: projectForm.name,
        description: projectForm.description || undefined,
        status: projectForm.status || "Active",
      };

      const res = await apiClient.post("/projects", payload);
      setShowProjectModal(false);
      setProjectForm({ name: "", description: "", status: "Active" });
      await fetchData();
      if (res.data) setSelectedProject(res.data);
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to create project";
      alert(
        Array.isArray(errorMessage)
          ? errorMessage.join(", ")
          : String(errorMessage),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await apiClient.delete(`/projects/tasks/${id}`);
      fetchData();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return "#ef4444";
      case "High":
        return "#f59e0b";
      case "Medium":
        return "#3b82f6";
      default:
        return "var(--text-muted)";
    }
  };

  if (loading)
    return (
      <div
        style={{
          height: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader className="spinner" size={32} />
      </div>
    );

  const columns = [
    { id: "todo", title: "To Do" },
    { id: "inprogress", title: "In Progress" },
    { id: "review", title: "Review" },
    { id: "done", title: "Done" },
  ];

  const filteredTasks = tasks.filter(
    (t) => !selectedProject || t.projectId === selectedProject.id,
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Project Selector & Actions */}
      <div
        className="glass-card"
        style={{
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            ref={projectDropdownRef}
            style={{ position: "relative", minWidth: "240px" }}
          >
            <button
              type="button"
              onClick={() => setShowProjectDropdown((prev) => !prev)}
              style={{
                width: "100%",
                padding: "10px 18px",
                borderRadius: "12px",
                backgroundColor: "var(--input-bg)",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  backgroundColor: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  flexShrink: 0,
                }}
              >
                <CheckCircle size={18} />
              </div>
              <span
                style={{
                  fontWeight: "800",
                  fontSize: "14px",
                  flex: 1,
                  color: "var(--text-main)",
                  textAlign: "left",
                }}
              >
                {selectedProject?.name || "Select Project"}
              </span>
              <ChevronDown
                size={18}
                className="text-muted"
                style={{
                  transform: showProjectDropdown
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                  color: "white",
                }}
              />
            </button>

            <AnimatePresence>
              {showProjectDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.16 }}
                  className="glass-card"
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    left: 0,
                    right: 0,
                    zIndex: 30,
                    maxHeight: "280px",
                    overflowY: "auto",
                    border: "1px solid var(--border)",
                    padding: "8px",
                    display: "grid",
                    gap: "6px",
                  }}
                >
                  {projects.map((project) => {
                    const isSelected = selectedProject?.id === project.id;
                    return (
                      <button
                        key={project.id}
                        type="button"
                        onClick={() => {
                          setSelectedProject(project);
                          setShowProjectDropdown(false);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "10px",
                          width: "100%",
                          border: "1px solid var(--border)",
                          borderRadius: "10px",
                          padding: "10px 12px",
                          backgroundColor: isSelected
                            ? "rgba(14,165,233,0.14)"
                            : "var(--input-bg)",
                          color: "var(--text-main)",
                          cursor: "pointer",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: isSelected ? "700" : "600",
                            textAlign: "left",
                          }}
                        >
                          {project.name}
                        </span>
                        {isSelected ? <CheckCircle size={14} /> : null}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={() => setShowProjectModal(true)}
            className="btn-secondary"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: "700",
            }}
          >
            <Plus size={18} /> New Project
          </button>
        </div>
        <button
          className="btn-primary"
          onClick={() => setShowTaskModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 24px",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(14, 165, 233, 0.3)",
          }}
        >
          <Plus size={20} /> Add Task
        </button>
      </div>

      <div
        className="responsive-grid-4"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
        }}
      >
        {columns.map((col) => (
          <div
            key={col.id}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 8px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    fontWeight: "800",
                    fontSize: "13px",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {col.title}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "var(--primary)",
                    backgroundColor: "var(--icon-bg)",
                    padding: "2px 8px",
                    borderRadius: "6px",
                  }}
                >
                  {filteredTasks.filter((t) => t.status === col.id).length}
                </span>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "rgba(255,255,255,0.015)",
                borderRadius: "16px",
                padding: "12px",
                minHeight: "500px",
                border:
                  dragOverColumn === col.id
                    ? "1px solid var(--primary)"
                    : "1px dashed var(--border)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                transition:
                  "border-color 0.2s ease, background-color 0.2s ease",
                background:
                  dragOverColumn === col.id
                    ? "rgba(14, 165, 233, 0.08)"
                    : "rgba(255,255,255,0.015)",
              }}
              onDragOver={(event) => handleColumnDragOver(event, col.id)}
              onDrop={(event) => handleColumnDrop(event, col.id)}
              onDragLeave={() => {
                if (dragOverColumn === col.id) {
                  setDragOverColumn(null);
                }
              }}
            >
              {filteredTasks
                .filter((t) => t.status === col.id)
                .map((task) => (
                  <motion.div
                    layout
                    id={task.id}
                    key={task.id}
                    className="glass-card"
                    style={{
                      padding: "16px",
                      cursor:
                        actionLoading === task.id ? "not-allowed" : "grab",
                      border: "1px solid var(--border)",
                      opacity: draggedTaskId === task.id ? 0.6 : 1,
                      background:
                        "linear-gradient(145deg, var(--bg-card), rgba(30, 41, 59, 0.4))",
                    }}
                    draggable={actionLoading !== task.id}
                    onDragStart={(event) => handleDragStart(event, task.id)}
                    onDragEnd={handleDragEnd}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "12px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "9px",
                          fontWeight: "900",
                          color: getPriorityColor(task.priority),
                          backgroundColor: `${getPriorityColor(task.priority)}15`,
                          padding: "2px 6px",
                          borderRadius: "4px",
                          border: `1px solid ${getPriorityColor(task.priority)}30`,
                        }}
                      >
                        {task.priority.toUpperCase()}
                      </span>
                      <div style={{ display: "flex", gap: "10px" }}>
                        {actionLoading === task.id && (
                          <Loader size={12} className="spinner" />
                        )}
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          style={{ color: "var(--text-muted)", opacity: 0.5 }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = "#ef4444")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = "var(--text-muted)")
                          }
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p
                      style={{
                        fontSize: "15px",
                        fontWeight: "700",
                        marginBottom: "16px",
                        lineHeight: "1.4",
                      }}
                    >
                      {task.title}
                    </p>

                    <div
                      style={{
                        padding: "12px",
                        backgroundColor: "rgba(255,255,255,0.02)",
                        borderRadius: "8px",
                        marginBottom: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "11px",
                          color: "var(--text-muted)",
                        }}
                      >
                        <Calendar size={12} />{" "}
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "No Deadline"}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "6px" }}>
                      {columns.map(
                        (target) =>
                          target.id !== col.id && (
                            <button
                              key={target.id}
                              disabled={actionLoading === task.id}
                              onClick={() =>
                                handleStatusChange(task.id, target.id)
                              }
                              style={{
                                fontSize: "9px",
                                fontWeight: "800",
                                padding: "4px 8px",
                                borderRadius: "6px",
                                backgroundColor: "var(--input-bg)",
                                color: "var(--text-muted)",
                                border: "1px solid var(--border)",
                                flex: 1,
                                transition: "all 0.2s",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.borderColor =
                                  "var(--primary)")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.borderColor =
                                  "var(--border)")
                              }
                            >
                              {target.title.split(" ")[0]}
                            </button>
                          ),
                      )}
                    </div>
                  </motion.div>
                ))}
              {filteredTasks.filter((t) => t.status === col.id).length ===
                0 && (
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0.2,
                  }}
                >
                  <CheckCircle size={32} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {projects.length === 0 && !loading && (
        <div
          style={{
            padding: "100px 40px",
            textAlign: "center",
            border: "2px dashed var(--border)",
            borderRadius: "32px",
            backgroundColor: "rgba(255,255,255,0.01)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              backgroundColor: "var(--icon-bg)",
              color: "var(--primary)",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 32px",
              boxShadow: "0 8px 24px rgba(14, 165, 233, 0.2)",
            }}
          >
            <Plus size={40} />
          </div>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "800",
              marginBottom: "16px",
              color: "var(--text-main)",
            }}
          >
            Initialize Your First Project
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              marginBottom: "40px",
              maxWidth: "450px",
              margin: "0 auto 40px",
              lineHeight: "1.6",
            }}
          >
            Ready to streamline your team's workflow? Create a project to start
            organizing tasks, tracking progress, and hitting milestones.
          </p>
          <button
            onClick={() => setShowProjectModal(true)}
            className="btn-primary"
            style={{
              padding: "16px 48px",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "700",
            }}
          >
            + Create New Project
          </button>
        </div>
      )}

      <AnimatePresence>
        {showTaskModal && (
          <div
            className="modal-overlay"
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.85)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "20px",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card"
              style={{
                width: "100%",
                maxWidth: "550px",
                padding: "40px",
                position: "relative",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <div style={{ position: "absolute", top: "24px", right: "24px" }}>
                <button
                  onClick={() => setShowTaskModal(false)}
                  style={{ color: "var(--text-muted)" }}
                >
                  <X size={24} />
                </button>
              </div>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "800",
                  marginBottom: "28px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    padding: "10px",
                    backgroundColor: "var(--icon-bg)",
                    borderRadius: "10px",
                    color: "var(--primary)",
                  }}
                >
                  <Plus size={24} />
                </div>
                New Project Task
              </h2>
              <form
                onSubmit={handleCreateTask}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "var(--text-muted)",
                      marginBottom: "10px",
                    }}
                  >
                    Task Title
                  </label>
                  <input
                    required
                    placeholder="E.g., Design UI architecture..."
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: "10px",
                      backgroundColor: "var(--input-bg)",
                      border: "1px solid var(--border)",
                      color: "white",
                      fontSize: "15px",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "var(--text-muted)",
                      marginBottom: "10px",
                    }}
                  >
                    Priority & Impact
                  </label>
                  <div style={{ position: "relative" }}>
                    <select
                      value={newTask.priority}
                      onChange={(e) =>
                        setNewTask({ ...newTask, priority: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "14px",
                        paddingLeft: "42px",
                        borderRadius: "10px",
                        backgroundColor: "var(--input-bg)",
                        border: "1px solid var(--border)",
                        color: "white",
                        appearance: "none",
                      }}
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Critical</option>
                    </select>
                    <div
                      style={{
                        position: "absolute",
                        left: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--primary)",
                      }}
                    >
                      <MoreHorizontal size={18} />
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "var(--text-muted)",
                      marginBottom: "10px",
                    }}
                  >
                    Description
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Briefly describe the deliverables and requirements..."
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: "10px",
                      backgroundColor: "var(--input-bg)",
                      border: "1px solid var(--border)",
                      color: "white",
                      fontSize: "15px",
                      resize: "none",
                    }}
                  />
                </div>
                <div
                  style={{ display: "flex", gap: "16px", marginTop: "12px" }}
                >
                  <button
                    type="button"
                    onClick={() => setShowTaskModal(false)}
                    className="btn-secondary"
                    style={{ flex: 1, padding: "14px" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={submitting}
                    style={{
                      flex: 2,
                      padding: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      fontWeight: "700",
                    }}
                  >
                    {submitting ? (
                      <Loader size={20} className="spinner" />
                    ) : (
                      <>
                        <Plus size={20} /> Deploy Task
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {showProjectModal && (
          <div
            className="modal-overlay"
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.85)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "20px",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card"
              style={{
                width: "100%",
                maxWidth: "550px",
                padding: "40px",
                position: "relative",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <div style={{ position: "absolute", top: "24px", right: "24px" }}>
                <button
                  onClick={() => setShowProjectModal(false)}
                  style={{ color: "var(--text-muted)" }}
                >
                  <X size={24} />
                </button>
              </div>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "800",
                  marginBottom: "28px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    padding: "10px",
                    backgroundColor: "var(--icon-bg)",
                    borderRadius: "10px",
                    color: "var(--primary)",
                  }}
                >
                  <CheckCircle size={24} />
                </div>
                Launch New Project
              </h2>
              <form
                onSubmit={handleCreateProject}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "var(--text-muted)",
                      marginBottom: "10px",
                    }}
                  >
                    Project Name
                  </label>
                  <input
                    required
                    placeholder="E.g., Cloud Migration..."
                    value={projectForm.name}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, name: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: "10px",
                      backgroundColor: "var(--input-bg)",
                      border: "1px solid var(--border)",
                      color: "white",
                      fontSize: "15px",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "var(--text-muted)",
                      marginBottom: "10px",
                    }}
                  >
                    Core Purpose
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Outline the strategic objectives for this project..."
                    value={projectForm.description}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        description: e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: "10px",
                      backgroundColor: "var(--input-bg)",
                      border: "1px solid var(--border)",
                      color: "white",
                      fontSize: "15px",
                      resize: "none",
                    }}
                  />
                </div>
                <div
                  style={{ display: "flex", gap: "16px", marginTop: "12px" }}
                >
                  <button
                    type="button"
                    onClick={() => setShowProjectModal(false)}
                    className="btn-secondary"
                    style={{ flex: 1, padding: "14px" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={submitting}
                    style={{
                      flex: 2,
                      padding: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      fontWeight: "700",
                    }}
                  >
                    {submitting ? (
                      <Loader size={20} className="spinner" />
                    ) : (
                      <>
                        <CheckCircle size={20} /> Launch Project
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectKanban;
