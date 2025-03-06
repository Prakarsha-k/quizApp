const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Ensure correct model import
require("dotenv").config();

const router = express.Router();

// ✅ **Login or Register User**
router.post("/login", async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        let user = await User.findOne({ username });

        if (!user) {
            if (!["admin", "student"].includes(role)) {
                return res.status(400).json({ error: "Invalid role specified" });
            }

            // ✅ **Register new user**
            const hashedPassword = await bcrypt.hash(password, 10);
            user = new User({ username, password: hashedPassword, role });

            await user.save();
            console.log(`✅ New user registered: ${username} as ${role}`);
        } else {
            if (user.role !== role) {
                return res.status(400).json({ error: "User already exists with a different role" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: "Invalid credentials" });
            }
        }

        // ✅ **Generate JWT Token**
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        // ✅ **Ensure adminId is properly returned**
        const adminId = user.role === "admin" ? user._id.toString() : null;
        console.log(`🔹 Sending Response:`, { token, role: user.role, adminId });

        res.json({ token, role: user.role, adminId });

    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
