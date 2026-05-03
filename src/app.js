require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/database");

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// API Routes
const userRoutes = require("./routes/UserRoutes");
const taskRoutes = require("./routes/TaskRoutes");

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// Serve React build in production
const clientBuild = path.join(__dirname, "..", "client", "build");
app.use(express.static(clientBuild));

// All non-API routes → React app
app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuild, "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
