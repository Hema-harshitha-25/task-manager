const BASE_URL = "https://task-manager-production-57a6.up.railway.app";
// 👉 For local testing use this instead:
// const BASE_URL = "http://192.168.29.71:5000";

// ================= USERS =================

// REGISTER
export const registerUser = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (error) {
    console.error("Register Error:", error);
    return { error: "Failed to register" };
  }
};

// LOGIN
export const loginUser = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (error) {
    console.error("Login Error:", error);
    return { error: "Failed to login" };
  }
};

// ================= TASKS =================

// GET TASKS
export const getTasks = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/api/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await res.json();
  } catch (error) {
    console.error("Get Tasks Error:", error);
    return [];
  }
};

// CREATE TASK
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

    return await res.json();
  } catch (error) {
    console.error("Create Task Error:", error);
    return { error: "Failed to create task" };
  }
};

// UPDATE TASK
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

    return await res.json();
  } catch (error) {
    console.error("Update Task Error:", error);
    return { error: "Failed to update task" };
  }
};

// DELETE TASK
export const deleteTask = async (token, id) => {
  try {
    const res = await fetch(`${BASE_URL}/api/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await res.json();
  } catch (error) {
    console.error("Delete Task Error:", error);
    return { error: "Failed to delete task" };
  }
};