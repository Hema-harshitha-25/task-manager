require("dotenv").config();

const express = require("express");
const connectDB = require("./config/database");

const app = express();

// ✅ Connect DB
connectDB();

// ✅ Middleware
app.use(express.json());

// ✅ Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Routes
const userRoutes = require("./routes/UserRoutes");
const taskRoutes = require("./routes/TaskRoutes");

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// ✅ PORT (important for Railway)
const PORT = 5000;

// ❌ Remove this after testing
// console.log("ENV CHECK:", process.env.MONGO_URI);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const cors = require("cors");

app.use(cors({
  origin: "*"
}));

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
