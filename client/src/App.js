import React, { useState, useEffect } from "react";
import {
  registerUser,
  loginUser,
  getTasks,
  createTask,
  deleteTask,
  updateTask,
} from "./api";

// ─── AUTH PAGE ────────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isLogin) {
      const res = await loginUser({ email: form.email, password: form.password });
      setLoading(false);
      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        onLogin(res.token, res.user);
      } else {
        setError(res.message || "Login failed. Check your credentials.");
      }
    } else {
      const res = await registerUser(form);
      setLoading(false);
      if (res.message === "User registered successfully") {
        setError("");
        setIsLogin(true);
        alert("Registered! Please log in.");
      } else {
        setError(res.message || "Registration failed.");
      }
    }  };

  return (
    <div style={s.page}>
      <div style={s.authCard}>
        {/* Logo */}
        <div style={s.logo}>✅</div>
        <h1 style={s.appName}>TaskFlow</h1>
        <p style={s.tagline}>Manage your tasks, effortlessly.</p>

        {/* Tabs */}
        <div style={s.tabs}>
          <button
            style={{ ...s.tab, ...(isLogin ? s.tabActive : {}) }}
            onClick={() => { setIsLogin(true); setError(""); }}
          >
            Login
          </button>
          <button
            style={{ ...s.tab, ...(!isLogin ? s.tabActive : {}) }}
            onClick={() => { setIsLogin(false); setError(""); }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={s.inputGroup}>
              <label style={s.label}>Full Name</label>
              <input
                style={s.input}
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handle}
                required
              />
            </div>
          )}
          <div style={s.inputGroup}>
            <label style={s.label}>Email</label>
            <input
              style={s.input}
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handle}
              required
            />
          </div>
          <div style={s.inputGroup}>
            <label style={s.label}>Password</label>
            <input
              style={s.input}
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handle}
              required
            />
          </div>

          {error && <div style={s.errorBox}>{error}</div>}

          <button style={s.submitBtn} type="submit" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        <p style={s.switchText}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span style={s.switchLink} onClick={() => { setIsLogin(!isLogin); setError(""); }}>
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ token, user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [filter, setFilter] = useState("all"); // all | active | completed
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const fetchTasks = React.useCallback(async () => {
    const data = await getTasks(token);
    setTasks(data);
    setLoading(false);
  }, [token]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    if (taskTitle.trim().length < 5) {
      setError("Task title must be at least 5 characters.");
      return;
    }
    setError("");
    setAdding(true);
    await createTask(token, { title: taskTitle.trim() });
    setTaskTitle("");
    setAdding(false);
    fetchTasks();
  };

  const handleToggle = async (id, completed) => {
    await updateTask(token, id, { completed: !completed });
    fetchTasks();
  };

  const handleDelete = async (id) => {
    await deleteTask(token, id);
    fetchTasks();
  };

  const filtered = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;
  const pending = total - done;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div style={s.dashPage}>
      {/* ── SIDEBAR ── */}
      <aside style={s.sidebar}>
        <div style={s.sideTop}>
          <div style={s.logo}>✅</div>
          <h2 style={s.sideAppName}>TaskFlow</h2>
        </div>

        <div style={s.userInfo}>
          <div style={s.avatar}>{user?.name?.[0]?.toUpperCase() || "U"}</div>
          <div>
            <div style={s.userName}>{user?.name || "User"}</div>
            <div style={s.userEmail}>{user?.email || ""}</div>
          </div>
        </div>

        <nav style={s.nav}>
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              style={{ ...s.navBtn, ...(filter === f ? s.navBtnActive : {}) }}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "📋 All Tasks" : f === "active" ? "🔵 Active" : "✅ Completed"}
              <span style={s.navCount}>
                {f === "all" ? total : f === "active" ? pending : done}
              </span>
            </button>
          ))}
        </nav>

        <button style={s.logoutBtn} onClick={onLogout}>
          🚪 Logout
        </button>
      </aside>

      {/* ── MAIN ── */}
      <main style={s.main}>
        {/* Header */}
        <div style={s.mainHeader}>
          <div>
            <h1 style={s.greeting}>
              Hello, {user?.name?.split(" ")[0] || "there"} 👋
            </h1>
            <p style={s.subGreeting}>Here's what's on your plate today.</p>
          </div>
          <div style={s.dateBox}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long", month: "long", day: "numeric",
            })}
          </div>
        </div>

        {/* Stats */}
        <div style={s.statsRow}>
          <div style={{ ...s.statCard, background: "linear-gradient(135deg,#667eea,#764ba2)" }}>
            <div style={s.statNum}>{total}</div>
            <div style={s.statLabel}>Total Tasks</div>
          </div>
          <div style={{ ...s.statCard, background: "linear-gradient(135deg,#f093fb,#f5576c)" }}>
            <div style={s.statNum}>{pending}</div>
            <div style={s.statLabel}>Pending</div>
          </div>
          <div style={{ ...s.statCard, background: "linear-gradient(135deg,#4facfe,#00f2fe)" }}>
            <div style={s.statNum}>{done}</div>
            <div style={s.statLabel}>Completed</div>
          </div>
          <div style={{ ...s.statCard, background: "linear-gradient(135deg,#43e97b,#38f9d7)" }}>
            <div style={s.statNum}>{percent}%</div>
            <div style={s.statLabel}>Progress</div>
          </div>
        </div>

        {/* Progress bar */}
        {total > 0 && (
          <div style={s.progressWrap}>
            <div style={s.progressBar}>
              <div style={{ ...s.progressFill, width: `${percent}%` }} />
            </div>
            <span style={s.progressText}>{percent}% complete</span>
          </div>
        )}

        {/* Add task */}
        <form onSubmit={handleAdd} style={s.addForm}>
          <input
            style={s.addInput}
            placeholder="Add a new task... (min 5 characters)"
            value={taskTitle}
            onChange={(e) => { setTaskTitle(e.target.value); setError(""); }}
          />
          <button style={s.addBtn} type="submit" disabled={adding}>
            {adding ? "Adding..." : "+ Add Task"}
          </button>
        </form>
        {error && <div style={s.errorBox}>{error}</div>}

        {/* Task list */}
        <div style={s.taskList}>
          {loading ? (
            <div style={s.emptyState}>Loading tasks...</div>
          ) : filtered.length === 0 ? (
            <div style={s.emptyState}>
              {filter === "all"
                ? "No tasks yet. Add one above! 🎯"
                : filter === "active"
                ? "No active tasks. Great job! 🎉"
                : "No completed tasks yet."}
            </div>
          ) : (
            filtered.map((task) => (
              <div
                key={task._id}
                style={{
                  ...s.taskCard,
                  ...(task.completed ? s.taskCardDone : {}),
                }}
              >
                <button
                  style={{
                    ...s.checkbox,
                    ...(task.completed ? s.checkboxDone : {}),
                  }}
                  onClick={() => handleToggle(task._id, task.completed)}
                  title="Toggle complete"
                >
                  {task.completed ? "✓" : ""}
                </button>

                <span
                  style={{
                    ...s.taskTitle,
                    ...(task.completed ? s.taskTitleDone : {}),
                  }}
                >
                  {task.title}
                </span>

                <span style={s.taskDate}>
                  {new Date(task.createdAt).toLocaleDateString()}
                </span>

                <button
                  style={s.deleteBtn}
                  onClick={() => handleDelete(task._id)}
                  title="Delete task"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")) || null; }
    catch { return null; }
  });

  const handleLogin = (tok, usr) => {
    setToken(tok);
    setUser(usr);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
  };

  if (!token) return <AuthPage onLogin={handleLogin} />;
  return <Dashboard token={token} user={user} onLogout={handleLogout} />;
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const s = {
  // Auth
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "'Segoe UI', sans-serif",
  },
  authCard: {
    background: "#fff",
    borderRadius: 20,
    padding: "40px 36px",
    width: 400,
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
  },
  logo: { fontSize: 40, textAlign: "center" },
  appName: {
    textAlign: "center",
    margin: "6px 0 4px",
    fontSize: 26,
    fontWeight: 700,
    color: "#333",
  },
  tagline: {
    textAlign: "center",
    color: "#888",
    fontSize: 14,
    marginBottom: 24,
  },
  tabs: {
    display: "flex",
    background: "#f0f0f0",
    borderRadius: 10,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    padding: "8px 0",
    border: "none",
    background: "transparent",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    color: "#888",
    fontSize: 14,
    transition: "all 0.2s",
  },
  tabActive: {
    background: "#fff",
    color: "#667eea",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  inputGroup: { marginBottom: 16 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 6 },
  input: {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    border: "1.5px solid #e0e0e0",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    transition: "border 0.2s",
  },
  errorBox: {
    background: "#fff0f0",
    border: "1px solid #ffcccc",
    color: "#cc0000",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    marginBottom: 14,
  },
  submitBtn: {
    width: "100%",
    padding: "13px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 4,
  },
  switchText: { textAlign: "center", marginTop: 18, fontSize: 13, color: "#888" },
  switchLink: { color: "#667eea", fontWeight: 700, cursor: "pointer" },

  // Dashboard
  dashPage: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', sans-serif",
    background: "#f4f6fb",
  },
  sidebar: {
    width: 260,
    background: "linear-gradient(180deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    flexDirection: "column",
    padding: "28px 20px",
    color: "#fff",
    position: "sticky",
    top: 0,
    height: "100vh",
  },
  sideTop: { display: "flex", alignItems: "center", gap: 10, marginBottom: 28 },
  sideAppName: { fontSize: 20, fontWeight: 700, margin: 0 },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: "12px 14px",
    marginBottom: 28,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "#fff",
    color: "#764ba2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 18,
    flexShrink: 0,
  },
  userName: { fontWeight: 700, fontSize: 14 },
  userEmail: { fontSize: 11, opacity: 0.8, marginTop: 2 },
  nav: { display: "flex", flexDirection: "column", gap: 6, flex: 1 },
  navBtn: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "11px 14px",
    borderRadius: 10,
    border: "none",
    background: "transparent",
    color: "rgba(255,255,255,0.75)",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    textAlign: "left",
    transition: "all 0.2s",
  },
  navBtnActive: {
    background: "rgba(255,255,255,0.2)",
    color: "#fff",
    fontWeight: 700,
  },
  navCount: {
    background: "rgba(255,255,255,0.25)",
    borderRadius: 20,
    padding: "2px 8px",
    fontSize: 12,
    fontWeight: 700,
  },
  logoutBtn: {
    padding: "11px 14px",
    borderRadius: 10,
    border: "1.5px solid rgba(255,255,255,0.3)",
    background: "transparent",
    color: "#fff",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    marginTop: 10,
    textAlign: "left",
  },

  // Main
  main: { flex: 1, padding: "32px 36px", overflowY: "auto" },
  mainHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
  },
  greeting: { fontSize: 26, fontWeight: 700, color: "#222", margin: 0 },
  subGreeting: { color: "#888", fontSize: 14, marginTop: 4 },
  dateBox: {
    background: "#fff",
    borderRadius: 10,
    padding: "8px 16px",
    fontSize: 13,
    color: "#667eea",
    fontWeight: 600,
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },

  // Stats
  statsRow: { display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" },
  statCard: {
    flex: "1 1 120px",
    borderRadius: 14,
    padding: "20px 22px",
    color: "#fff",
    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
  },
  statNum: { fontSize: 32, fontWeight: 800, lineHeight: 1 },
  statLabel: { fontSize: 13, opacity: 0.9, marginTop: 6 },

  // Progress
  progressWrap: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 24,
  },
  progressBar: {
    flex: 1,
    height: 10,
    background: "#e0e0e0",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #667eea, #764ba2)",
    borderRadius: 10,
    transition: "width 0.4s ease",
  },
  progressText: { fontSize: 13, color: "#667eea", fontWeight: 700, whiteSpace: "nowrap" },

  // Add form
  addForm: {
    display: "flex",
    gap: 12,
    marginBottom: 8,
  },
  addInput: {
    flex: 1,
    padding: "13px 16px",
    borderRadius: 12,
    border: "1.5px solid #e0e0e0",
    fontSize: 14,
    outline: "none",
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  addBtn: {
    padding: "13px 22px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  // Task list
  taskList: { display: "flex", flexDirection: "column", gap: 10, marginTop: 16 },
  emptyState: {
    textAlign: "center",
    color: "#aaa",
    fontSize: 15,
    padding: "40px 0",
  },
  taskCard: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    background: "#fff",
    borderRadius: 12,
    padding: "14px 18px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    transition: "all 0.2s",
    border: "1.5px solid transparent",
  },
  taskCardDone: {
    background: "#f9f9f9",
    border: "1.5px solid #e8e8e8",
    opacity: 0.75,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: "50%",
    border: "2px solid #667eea",
    background: "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    color: "#fff",
    flexShrink: 0,
    transition: "all 0.2s",
  },
  checkboxDone: {
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    border: "2px solid #667eea",
  },
  taskTitle: { flex: 1, fontSize: 15, color: "#333", fontWeight: 500 },
  taskTitleDone: { textDecoration: "line-through", color: "#aaa" },
  taskDate: { fontSize: 12, color: "#bbb", whiteSpace: "nowrap" },
  deleteBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    opacity: 0.5,
    transition: "opacity 0.2s",
    padding: "0 4px",
  },
};
