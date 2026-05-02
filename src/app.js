require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/database");
const userRoutes = require("./routes/UserRoutes");
const taskRoutes = require("./routes/TaskRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route (IMPORTANT)
app.get("/", (req, res) => {
  res.send("API is working 🚀");
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// Connect DB
connectDB();

// PORT FIX (VERY IMPORTANT)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});