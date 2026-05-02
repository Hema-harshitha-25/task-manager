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

  // Register
  const handleRegister = async () => {
    const res = await registerUser(form);
    alert(JSON.stringify(res));
  };

  // Login
  const handleLogin = async () => {
    const res = await loginUser(form);
    if (res.token) {
      setToken(res.token);
      localStorage.setItem("token", res.token);
    } else {
      alert("Login failed");
    }
  };

  // Load tasks
  const loadTasks = async () => {
    const res = await getTasks(token);
    setTasks(res);
  };

  // Create task
  const handleCreate = async () => {
    await createTask(token, { title: taskText });
    setTaskText("");
    loadTasks();
  };

  // Delete task
  const handleDelete = async (id) => {
    await deleteTask(token, id);
    loadTasks();
  };

  // Toggle complete
  const handleToggle = async (id, completed) => {
    await updateTask(token, id, { completed: !completed });
    loadTasks();
  };

  // Load token from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("token");
    if (saved) setToken(saved);
  }, []);

  useEffect(() => {
  const loadTasks = async () => {
    const res = await getTasks(token);
    setTasks(res);
  };

  if (token) loadTasks();
}, [token]);
  return (
    <div style={{ padding: 20 }}>
      <h2>Task Manager</h2>

      {!token && (
        <>
          <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <br /><br />
          <button onClick={handleRegister}>Register</button>
          <button onClick={handleLogin}>Login</button>
        </>
      )}

      {token && (
        <>
          <h3>Tasks</h3>
          <input value={taskText} onChange={(e) => setTaskText(e.target.value)} placeholder="New Task" />
          <button onClick={handleCreate}>Add</button>

          <div style={{ marginTop: 20 }}>
            {tasks.map((task) => (
              <div key={task._id}>
                <span
                  onClick={() => handleToggle(task._id, task.completed)}
                  style={{ cursor: "pointer" }}
                >
                  {task.title} ({task.completed ? "✔" : "❌"})
                </span>
                <button onClick={() => handleDelete(task._id)}>Delete</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;