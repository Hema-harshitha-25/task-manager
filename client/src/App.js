import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
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