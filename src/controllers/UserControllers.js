const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

// ================= REGISTER =================
exports.createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Password is hashed by the UserModel pre-save hook — do NOT hash here
    const user = new User({ name, email, password });
    await user.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= LOGIN =================
exports.loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL USERS =================
exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= GET USER BY ID =================
exports.getUserById = async (req, res) => {
  try {
    return res.status(200).json(res.user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE USER (PARTIAL) =================
exports.updateUserPartial = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (name !== undefined) res.user.name = name;
    if (email !== undefined) res.user.email = email;
    // Assign plain password — pre-save hook will hash it
    if (password !== undefined) res.user.password = password;
    await res.user.save();
    return res.status(200).json({
      id: res.user._id,
      name: res.user.name,
      email: res.user.email,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE USER (COMPLETE) =================
exports.updateUserComplete = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    res.user.name = name;
    res.user.email = email;
    // Assign plain password — pre-save hook will hash it
    if (password) res.user.password = password;
    await res.user.save();
    return res.status(200).json({
      id: res.user._id,
      name: res.user.name,
      email: res.user.email,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= DELETE USER =================
exports.deleteUser = async (req, res) => {
  try {
    await res.user.deleteOne();
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
