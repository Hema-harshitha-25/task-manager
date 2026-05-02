import React, { useState, useEffect } from "react";
import {
  registerUser,
  loginUser,
  getTasks,
  createTask,
  deleteTask,
  updateTask,
} from "./api";


function App() {
  const [token, setToken] = useState("");
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [taskText, setTaskText] = useState("");

  // REGISTER
  const handleRegister = async () => {
    const res = await registerUser(form);
    alert(res.message || "Registered successfully");
  };

  // LOGIN
  const handleLogin = async () => {
    const res = await loginUser(form);
    if (res.token) {
      setToken(res.token);
      localStorage.setItem("token", res.token);
    } else {
      alert("Login failed");
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  // REFRESH TASKS
  const refreshTasks = async () => {
    const res = await getTasks(token);
    setTasks(res);
  };

  // CREATE TASK
  const handleCreate = async () => {
    if (!taskText) return;
    await createTask(token, { title: taskText });
    setTaskText("");
    refreshTasks();
  };

  // DELETE TASK
  const handleDelete = async (id) => {
    await deleteTask(token, id);
    refreshTasks();
  };

  // UPDATE TASK
  const handleToggle = async (id, completed) => {
    await updateTask(token, id, { completed: !completed });
    refreshTasks();
  };

  // LOAD TOKEN ON START
  useEffect(() => {
    const saved = localStorage.getItem("token");
    if (saved) setToken(saved);
  }, []);

  // LOAD TASKS WHEN TOKEN CHANGES
  useEffect(() => {
    const fetchTasks = async () => {
      const res = await getTasks(token);
      setTasks(res);
    };

    if (token) fetchTasks();
  }, [token]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2>Task Manager 🚀</h2>
          {token && (
            <button style={styles.logout} onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>

        {!token ? (
          <>
            <input
              style={styles.input}
              placeholder="Name"
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
            <input
              style={styles.input}
              placeholder="Email"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <div style={styles.buttonGroup}>
              <button style={styles.primary} onClick={handleRegister}>
                Register
              </button>
              <button style={styles.secondary} onClick={handleLogin}>
                Login
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={styles.taskInput}>
              <input
                style={styles.input}
                value={taskText}
                placeholder="Add new task..."
                onChange={(e) => setTaskText(e.target.value)}
              />
              <button style={styles.primary} onClick={handleCreate}>
                Add
              </button>
            </div>

            <div>
              {tasks.map((task) => (
                <div key={task._id} style={styles.task}>
                  <span
                    onClick={() =>
                      handleToggle(task._id, task.completed)
                    }
                    style={{
                      cursor: "pointer",
                      textDecoration: task.completed
                        ? "line-through"
                        : "none",
                    }}
                  >
                    {task.title}
                  </span>

                  <button
                    style={styles.delete}
                    onClick={() => handleDelete(task._id)}
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// 🎨 STYLES
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "15px",
    width: "360px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
  },
  primary: {
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    background: "#667eea",
    color: "white",
    cursor: "pointer",
    flex: 1,
    marginRight: "5px",
  },
  secondary: {
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    background: "#764ba2",
    color: "white",
    cursor: "pointer",
    flex: 1,
  },
  logout: {
    padding: "5px 10px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  taskInput: {
    display: "flex",
    gap: "10px",
  },
  task: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#f3f3f3",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "8px",
  },
  delete: {
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default App;