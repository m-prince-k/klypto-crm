import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  ClipboardList,
  Loader,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  CalendarDays,
} from "lucide-react";
import { toast } from "sonner";
import apiClient from "../api/apiClient";

const EmployeeProjects = () => {
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [employeeId, setEmployeeId] = useState(null);
  const [taskStatusFilter, setTaskStatusFilter] = useState("All");
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [taskSubmitting, setTaskSubmitting] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
    projectId: "",
  });

  const fetchProjectsData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const myEmployeeRes = await apiClient.get("/leaves/my-employee-id");
      const myEmployeeId = myEmployeeRes.data?.employeeId || null;
      setEmployeeId(myEmployeeId);

      if (!myEmployeeId) {
        setAssignedTasks([]);
        setMyProjects([]);
        return;
      }

      const [tasksRes, projectsRes] = await Promise.all([
        apiClient.get("/projects/tasks"),
        apiClient.get("/projects"),
      ]);

      const tasks = (tasksRes.data || []).filter(
        (task) =>
          String(task.assigneeId || task.assignee?.id || "") ===
          String(user?.id || ""),
      );

      const projectIdSet = new Set(
        tasks
          .map((task) => String(task.projectId || task.project?.id || ""))
          .filter(Boolean),
      );

      const projects = (projectsRes.data || []).filter((project) =>
        projectIdSet.has(String(project.id)),
      );

      setAssignedTasks(tasks);
      setMyProjects(projects);
    } catch (fetchError) {
      const message =
        fetchError.response?.data?.message ||
        "Failed to load employee projects data";
      setError(message);
      toast.error(
        Array.isArray(message) ? message.join(", ") : String(message),
      );
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchProjectsData();
  }, [fetchProjectsData]);

  const filteredAssignedTasks = useMemo(
    () =>
      assignedTasks.filter(
        (task) =>
          taskStatusFilter === "All" || task.status === taskStatusFilter,
      ),
    [assignedTasks, taskStatusFilter],
  );

  const projectProgress = useMemo(() => {
    return myProjects.map((project) => {
      const projectTasks = assignedTasks.filter(
        (task) =>
          String(task.projectId || task.project?.id || "") ===
          String(project.id),
      );
      const completed = projectTasks.filter(
        (task) => task.status === "done",
      ).length;
      return {
        ...project,
        assignedCount: projectTasks.length,
        completedCount: completed,
      };
    });
  }, [myProjects, assignedTasks]);

  const handleTaskStatusUpdate = async (taskId, status) => {
    setActionLoading(`task-${taskId}`);
    setError("");
    setSuccessMessage("");

    try {
      await apiClient.patch(`/projects/tasks/${taskId}`, { status });
      setSuccessMessage("Task status updated.");
      toast.success("Task status updated");
      await fetchProjectsData();
    } catch (taskError) {
      const message =
        taskError.response?.data?.message || "Failed to update task status";
      setError(message);
      toast.error(
        Array.isArray(message) ? message.join(", ") : String(message),
      );
    } finally {
      setActionLoading("");
    }
  };

  const resetTaskForm = () => {
    setTaskForm({
      title: "",
      description: "",
      priority: "Medium",
      dueDate: "",
      projectId: myProjects[0]?.id ? String(myProjects[0].id) : "",
    });
  };

  useEffect(() => {
    if (!taskForm.projectId && myProjects.length > 0) {
      setTaskForm((prev) => ({ ...prev, projectId: String(myProjects[0].id) }));
    }
  }, [myProjects, taskForm.projectId]);

  const handleCreateTask = async (event) => {
    event.preventDefault();
    if (!taskForm.title.trim() || !taskForm.projectId) {
      setError("Task title and project are required.");
      toast.error("Task title and project are required");
      return;
    }

    setTaskSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      await apiClient.post("/projects/tasks", {
        title: taskForm.title.trim(),
        description: taskForm.description.trim() || undefined,
        priority: taskForm.priority,
        dueDate: taskForm.dueDate
          ? new Date(taskForm.dueDate).toISOString()
          : undefined,
        projectId: taskForm.projectId,
      });

      setSuccessMessage("Task created successfully.");
      toast.success("Task created successfully");
      setShowCreateTaskModal(false);
      resetTaskForm();
      await fetchProjectsData();
    } catch (createError) {
      const message =
        createError.response?.data?.message || "Failed to create task";
      setError(message);
      toast.error(
        Array.isArray(message) ? message.join(", ") : String(message),
      );
    } finally {
      setTaskSubmitting(false);
    }
  };

  const columns = [
    { id: "todo", title: "To Do" },
    { id: "inprogress", title: "In Progress" },
    { id: "review", title: "Review" },
    { id: "done", title: "Done" },
  ];

  const kanbanTasks =
    taskStatusFilter === "All"
      ? assignedTasks
      : assignedTasks.filter((task) => task.status === taskStatusFilter);

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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <h1
            style={{ fontSize: "28px", fontWeight: "800", marginBottom: "6px" }}
          >
            My Projects
          </h1>
          <button
            className="btn-primary"
            onClick={() => {
              resetTaskForm();
              setShowCreateTaskModal(true);
            }}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <Plus size={16} /> New Task
          </button>
        </div>
        <p style={{ color: "var(--text-muted)" }}>
          Track assigned projects, update task statuses, and monitor completion
          progress.
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
          Your account is not linked to an employee profile yet. Contact
          HR/Admin.
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "14px",
            }}
          >
            {projectProgress.map((project) => (
              <div
                key={project.id}
                className="glass-card"
                style={{ padding: "14px" }}
              >
                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "14px",
                    marginBottom: "4px",
                  }}
                >
                  {project.name}
                </div>
                <div
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "12px",
                    marginBottom: "8px",
                  }}
                >
                  {project.assignedCount} assigned task(s) ·{" "}
                  {project.completedCount} completed
                </div>
                <div
                  style={{
                    height: "8px",
                    borderRadius: "999px",
                    backgroundColor: "var(--input-bg)",
                  }}
                >
                  <div
                    style={{
                      height: "8px",
                      borderRadius: "999px",
                      backgroundColor: "var(--primary)",
                      width:
                        project.assignedCount > 0
                          ? `${Math.round((project.completedCount / project.assignedCount) * 100)}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>
            ))}
            {projectProgress.length === 0 && (
              <div
                className="glass-card"
                style={{ padding: "14px", color: "var(--text-muted)" }}
              >
                No project assignments found.
              </div>
            )}
          </div>

          <div className="glass-card" style={{ padding: "18px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                marginBottom: "14px",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <ClipboardList size={18} />
                <h3 style={{ fontWeight: "700" }}>My Tasks Kanban</h3>
              </div>
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
                  FILTER TASK STATUS
                </span>
                <select
                  value={taskStatusFilter}
                  onChange={(event) => setTaskStatusFilter(event.target.value)}
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
                  <option value="todo">Todo</option>
                  <option value="inprogress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "12px",
              }}
            >
              {columns.map((column) => {
                const columnTasks = kanbanTasks.filter(
                  (task) => task.status === column.id,
                );

                return (
                  <div
                    key={column.id}
                    style={{
                      border: "1px solid var(--border)",
                      borderRadius: "10px",
                      backgroundColor: "var(--column-bg)",
                      padding: "10px",
                      minHeight: "240px",
                      display: "grid",
                      gap: "8px",
                      alignContent: "start",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "4px",
                      }}
                    >
                      <span style={{ fontSize: "12px", fontWeight: "800" }}>
                        {column.title}
                      </span>
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: "999px",
                          fontSize: "11px",
                          backgroundColor: "var(--input-bg)",
                          color: "var(--text-muted)",
                        }}
                      >
                        {columnTasks.length}
                      </span>
                    </div>

                    {columnTasks.length === 0 ? (
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--text-muted)",
                          opacity: 0.85,
                        }}
                      >
                        No tasks
                      </div>
                    ) : (
                      columnTasks.map((task) => (
                        <div
                          key={task.id}
                          className="glass-card"
                          style={{
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                            padding: "10px",
                            display: "grid",
                            gap: "8px",
                          }}
                        >
                          <div style={{ fontSize: "13px", fontWeight: "700" }}>
                            {task.title}
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "var(--text-muted)",
                            }}
                          >
                            {task.project?.name || "Project"} · {task.priority}
                          </div>
                          {task.dueDate ? (
                            <div
                              style={{
                                fontSize: "11px",
                                color: "var(--text-muted)",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <CalendarDays size={12} />
                              Due {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                          ) : null}
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr",
                              gap: "6px",
                            }}
                          >
                            {columns
                              .filter(
                                (nextColumn) => nextColumn.id !== task.status,
                              )
                              .map((nextColumn) => (
                                <button
                                  key={nextColumn.id}
                                  className={
                                    nextColumn.id === "done"
                                      ? "btn-primary"
                                      : "btn-secondary"
                                  }
                                  onClick={() =>
                                    handleTaskStatusUpdate(
                                      task.id,
                                      nextColumn.id,
                                    )
                                  }
                                  disabled={actionLoading === `task-${task.id}`}
                                  style={{
                                    padding: "6px 10px",
                                    fontSize: "11px",
                                  }}
                                >
                                  {actionLoading === `task-${task.id}`
                                    ? "Saving..."
                                    : `Move to ${nextColumn.title}`}
                                </button>
                              ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {showCreateTaskModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            className="glass-card"
            style={{ width: "100%", maxWidth: "520px", padding: "24px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "14px",
              }}
            >
              <h3 style={{ fontSize: "20px", fontWeight: "800" }}>
                Create Task
              </h3>
              <button
                onClick={() => {
                  setShowCreateTaskModal(false);
                  resetTaskForm();
                }}
                style={{ color: "var(--text-muted)" }}
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleCreateTask}
              style={{ display: "grid", gap: "12px" }}
            >
              <input
                required
                placeholder="Task title"
                value={taskForm.title}
                onChange={(event) =>
                  setTaskForm((prev) => ({
                    ...prev,
                    title: event.target.value,
                  }))
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  backgroundColor: "var(--input-bg)",
                  border: "1px solid var(--border)",
                  color: "var(--text-main)",
                }}
              />

              <textarea
                rows={3}
                placeholder="Description (optional)"
                value={taskForm.description}
                onChange={(event) =>
                  setTaskForm((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  backgroundColor: "var(--input-bg)",
                  border: "1px solid var(--border)",
                  color: "var(--text-main)",
                  resize: "vertical",
                }}
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                <select
                  value={taskForm.projectId}
                  onChange={(event) =>
                    setTaskForm((prev) => ({
                      ...prev,
                      projectId: event.target.value,
                    }))
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    backgroundColor: "var(--input-bg)",
                    border: "1px solid var(--border)",
                    color: "var(--text-main)",
                  }}
                >
                  <option value="">Select project</option>
                  {myProjects.map((project) => (
                    <option key={project.id} value={String(project.id)}>
                      {project.name}
                    </option>
                  ))}
                </select>

                <select
                  value={taskForm.priority}
                  onChange={(event) =>
                    setTaskForm((prev) => ({
                      ...prev,
                      priority: event.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    backgroundColor: "var(--input-bg)",
                    border: "1px solid var(--border)",
                    color: "var(--text-main)",
                  }}
                >
                  {["Low", "Medium", "High", "Critical"].map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>

              <input
                type="date"
                value={taskForm.dueDate}
                onChange={(event) =>
                  setTaskForm((prev) => ({
                    ...prev,
                    dueDate: event.target.value,
                  }))
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  backgroundColor: "var(--input-bg)",
                  border: "1px solid var(--border)",
                  color: "var(--text-main)",
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                  marginTop: "4px",
                }}
              >
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setShowCreateTaskModal(false);
                    resetTaskForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={taskSubmitting}
                >
                  {taskSubmitting ? "Creating..." : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeProjects;
