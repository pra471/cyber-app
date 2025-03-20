const express = require("express");
const authMiddleware = require("../middleware/auth");
const Complaint = require("../models/Complaints");

const router = express.Router();

// Create a new complaint
router.post("/create", authMiddleware, async (req, res) => {
    try {
        const { title, description } = req.body;
        const complaint = new Complaint({
            user: req.user.id,
            title,
            description,
        });

        await complaint.save();
        res.status(201).json({ message: "✅ Complaint registered successfully!", complaint });
    } catch (error) {
        res.status(500).json({ message: "❌ Server error", error });
    }
});

// Get all complaints of the logged-in user
router.get("/my-complaints", authMiddleware, async (req, res) => {
    try {
        const complaints = await Complaint.find({ user: req.user.id });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: "❌ Server error", error });
    }
});

// Get a specific complaint by ID
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) return res.status(404).json({ message: "❌ Complaint not found!" });

        res.json(complaint);
    } catch (error) {
        res.status(500).json({ message: "❌ Server error", error });
    }
});

// Admin: Update complaint status
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        const complaint = await Complaint.findByIdAndUpdate(req.params.id, { status }, { new: true });

        if (!complaint) return res.status(404).json({ message: "❌ Complaint not found!" });

        res.json({ message: "✅ Complaint updated!", complaint });
    } catch (error) {
        res.status(500).json({ message: "❌ Server error", error });
    }
});

module.exports = router;
