require("dotenv").config();

const express = require("express");
const connectDB = require("./config/database");

const userRoutes = require("./routes/UserRoutes");
const taskRoutes = require("./routes/TaskRoutes");

const app = express();

// Middleware
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});