// Proxy in package.json forwards /api/* → http://localhost:5000
const BASE_URL = "";

// Called by any 401 response to clear session and reload to login
const handleUnauthorized = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/"; // force reload → shows login page
};

// ================= USERS =================

export const registerUser = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return { error: true, message: json.message || "Registration failed" };
    return json;
  } catch (error) {
    console.error("Register Error:", error);
    return { error: true, message: "Cannot reach server. Is the backend running?" };
  }
};

export const loginUser = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return { error: true, message: json.message || "Login failed" };
    return json;
  } catch (error) {
    console.error("Login Error:", error);
    return { error: true, message: "Cannot reach server. Is the backend running?" };
  }
};

// ================= TASKS =================

export const getTasks = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/api/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) { handleUnauthorized(); return []; }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Get Tasks Error:", error);
    return [];
  }
};

export const createTask = async (token, data) => {
  try {
    const res = await fetch(`${BASE_URL}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (res.status === 401) { handleUnauthorized(); return { error: true, message: "Session expired. Please login again." }; }
    const json = await res.json();
    if (!res.ok) return { error: true, message: json.message, errors: json.errors };
    return json;
  } catch (error) {
    console.error("Create Task Error:", error);
    return { error: true, message: "Cannot reach server." };
  }
};

export const updateTask = async (token, id, data) => {
  try {
    const res = await fetch(`${BASE_URL}/api/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (res.status === 401) { handleUnauthorized(); return { error: true }; }
    return await res.json();
  } catch (error) {
    console.error("Update Task Error:", error);
    return { error: "Failed to update task" };
  }
};

export const deleteTask = async (token, id) => {
  try {
    const res = await fetch(`${BASE_URL}/api/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) { handleUnauthorized(); return { error: true }; }
    return await res.json();
  } catch (error) {
    console.error("Delete Task Error:", error);
    return { error: "Failed to delete task" };
  }
};
