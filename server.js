require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const authenticateUser = require("./middleware/auth"); // Authentication Middleware

const app = express();
app.use(express.json()); // Allow JSON data
app.use(cors()); // Enable CORS for frontend

// 🛠️ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// 🔑 Authentication Route - Login (Generates JWT Token)
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  // Check if user exists (Replace with Database Users later)
  const users = [{ id: 1, username: "admin", password: "password123" }];
  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) return res.status(401).json({ message: "❌ Invalid Credentials" });

  // Generate JWT Token
  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ message: "✅ Login Successful", token });
});

// 🛡️ Protected Route Example
app.get("/api/protected", authenticateUser, (req, res) => {
  res.json({ message: "✅ Access granted!", user: req.user });
});

// 🔍 Test MongoDB Connection Route
app.get("/api/test-db", async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.json({ message: "✅ MongoDB Connected Successfully!" });
  } catch (error) {
    res.status(500).json({ message: "❌ MongoDB Connection Failed", error });
  }
});

// 🚔 Complaints Route (Newly Added)
app.use("/api/complaints", require("./routes/complaints"));

// 🌍 Default Route
app.get("/", (req, res) => {
  res.send("🚀 Cybersecurity App Running!");
});

// 🚀 Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
