const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const users = [
    { email: "john@example.com", password: "securepassword" } // Example user
];

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"; // Use .env secret

// ✅ User Registration
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "❌ All fields are required!" });
        }

        users.push({ email, password });
        console.log(`📌 User Registered: ${name}, ${email}`);

        res.status(201).json({ message: "✅ User registered successfully!" });
    } catch (error) {
        console.error("🔥 Error in /register:", error);
        res.status(500).json({ message: "❌ Server error", error: error.message });
    }
});

// ✅ User Login with JWT Token
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "❌ Email and password are required!" });
        }

        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            return res.status(401).json({ message: "❌ Invalid email or password!" });
        }

        // ✅ Generate JWT Token
        const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ message: "✅ Login successful!", token });
    } catch (error) {
        console.error("🔥 Error in /login:", error);
        res.status(500).json({ message: "❌ Server error", error: error.message });
    }
});

module.exports = router;
