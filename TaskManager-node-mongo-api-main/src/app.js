require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
const userRoutes = require("./routes/UserRoutes");
const taskRoutes = require("./routes/TaskRoutes");

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// PORT with fallback to avoid EADDRINUSE
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
