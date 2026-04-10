import React, { useState, useEffect } from "react";
import { MoreHorizontal, Plus, Calendar, User as UserIcon, Loader, Trash2, CheckCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "../../api/apiClient";

const ProjectKanban = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "Medium" });
  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // ID of task being updated

  const fetchData = async () => {
    try {
      const [projectsRes, tasksRes] = await Promise.all([
        apiClient.get("/projects"),
        apiClient.get("/projects/tasks")
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

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!selectedProject) return;
    setSubmitting(true);
    try {
      await apiClient.post("/projects/tasks", { 
        ...newTask, 
        projectId: selectedProject.id 
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
      case "Critical": return "#ef4444";
      case "High": return "#f59e0b";
      case "Medium": return "#3b82f6";
      default: return "var(--text-muted)";
    }
  };

  if (loading) return <div style={{ height: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}><Loader className="spinner" size={32} /></div>;

  const columns = [
    { id: "todo", title: "To Do" },
    { id: "inprogress", title: "In Progress" },
    { id: "review", title: "Review" },
    { id: "done", title: "Done" }
  ];

  const filteredTasks = tasks.filter(t => !selectedProject || t.projectId === selectedProject.id);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Project Selector & Actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div className="glass-card" style={{ padding: "8px 16px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
            <span style={{ fontWeight: "600" }}>{selectedProject?.name || "Select Project"}</span>
            <ChevronDown size={16} />
          </div>
          <button className="btn-secondary" style={{ padding: "8px 16px", borderRadius: "8px" }}>+ New Project</button>
        </div>
        <button className="btn-primary" onClick={() => setShowTaskModal(true)} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Plus size={18} /> Add Task
        </button>
      </div>

      <div className="responsive-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
        {columns.map(col => (
          <div key={col.id} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontWeight: "700", fontSize: "14px" }}>{col.title}</span>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", backgroundColor: "var(--tag-bg)", padding: "2px 8px", borderRadius: "10px" }}>
                  {filteredTasks.filter(t => t.status === col.id).length}
                </span>
              </div>
            </div>

            <div style={{ backgroundColor: "var(--tag-bg)", borderRadius: "12px", padding: "12px", minHeight: "400px", border: "1px solid var(--border)" }}>
              {filteredTasks.filter(t => t.status === col.id).map(task => (
                <motion.div layout id={task.id} key={task.id} className="glass-card" style={{ padding: "16px", marginBottom: "12px", cursor: "grab" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "10px", fontWeight: "800", color: getPriorityColor(task.priority), backgroundColor: `${getPriorityColor(task.priority)}15`, padding: "2px 8px", borderRadius: "4px" }}>
                      {task.priority.toUpperCase()}
                    </span>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => handleDeleteTask(task.id)} style={{ color: "var(--text-muted)", hover: { color: "#ef4444" } }}><Trash2 size={14} /></button>
                      <button style={{ color: "var(--text-muted)" }}><MoreHorizontal size={14} /></button>
                    </div>
                  </div>
                  <p style={{ fontSize: "14px", fontWeight: "600", marginBottom: "16px" }}>{task.title}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", color: "var(--text-muted)" }}>
                      <Calendar size={12} /> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No Date"}
                    </div>
                    <div style={{ display: "flex", gap: "4px" }}>
                      {columns.map(target => target.id !== col.id && (
                        <button key={target.id} onClick={() => handleStatusChange(task.id, target.id)} style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", backgroundColor: "var(--input-bg)", color: "var(--text-muted)" }}>
                          {target.title.split(" ")[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Create Task Modal */}
      <AnimatePresence>
        {showTaskModal && (
          <div className="modal-overlay" style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card" style={{ width: "100%", maxWidth: "500px", padding: "32px", position: "relative" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "20px" }}>Add New Task</h2>
              <form onSubmit={handleCreateTask} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>Task Title</label>
                  <input required value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "var(--input-bg)", border: "1px solid var(--border)", color: "white" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>Priority</label>
                  <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "var(--input-bg)", border: "1px solid var(--border)", color: "white" }}>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>Description</label>
                  <textarea rows={3} value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "var(--input-bg)", border: "1px solid var(--border)", color: "white" }} />
                </div>
                <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                  <button type="button" onClick={() => setShowTaskModal(false)} style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "1px solid var(--border)" }}>Cancel</button>
                  <button 
                    type="submit" 
                    className="btn-primary" 
                    disabled={submitting}
                    style={{ flex: 2, padding: "12px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                  >
                    {submitting ? <Loader size={18} className="spinner" /> : <><Plus size={18} /> Create Task</>}
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
