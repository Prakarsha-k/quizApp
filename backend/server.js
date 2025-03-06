const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import Routes
const userRoutes = require("./routes/userRoutes");
const quizRoutes = require("./routes/quizRoutes");

const authRoutes = require("./routes/authRoutes"); // ✅ Added authentication routes

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  });

// API Routes
app.use("/api/auth", authRoutes); // ✅ Authentication routes added
app.use("/api/users", userRoutes);
app.use("/api/quizzes", quizRoutes);


// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to the Quiz API 🚀");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
