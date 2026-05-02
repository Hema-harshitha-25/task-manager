const BASE_URL = "http://localhost:5000"; // use your local backend

// REGISTER
export const registerUser = async (data) => {
  const res = await fetch(`${BASE_URL}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

// LOGIN
export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/api/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

// GET TASKS
export const getTasks = async (token) => {
  const res = await fetch(`${BASE_URL}/api/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

// CREATE TASK
export const createTask = async (token, data) => {
  const res = await fetch(`${BASE_URL}/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

// UPDATE TASK
export const updateTask = async (token, id, data) => {
  const res = await fetch(`${BASE_URL}/api/tasks/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

// DELETE TASK
export const deleteTask = async (token, id) => {
  const res = await fetch(`${BASE_URL}/api/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};