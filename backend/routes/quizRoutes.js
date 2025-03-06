const express = require("express");
const router = express.Router();
const authMiddleware  = require("../middleware/authMiddleware");
const Quiz = require("../models/Quiz");

// ✅ Route to fetch quizzes created by the logged-in admin
router.get("/admin", authMiddleware, async (req, res) => {
  try {
    console.log("🔹 Request to /api/quizzes/admin - User:", req.user);
    
    if (!req.user || req.user.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized: Admins only" });
    }

    const quizzes = await Quiz.find({ adminId: req.user.id });
    res.json(quizzes);
  } catch (error) {
    console.error("❌ Error fetching quizzes:", error);
    res.status(500).json({ error: "Error fetching quizzes" });
  }
});

router.get("/", async (req, res) => {
  try {
  
    
    const quizzes = await Quiz.find({});
    

    res.json(quizzes);
  } catch (error) {
    console.error("❌ Error fetching quizzes:", error);
    res.status(500).json({ error: "Server error fetching quizzes" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json(quiz);
  } catch (err) {
    console.error("Error fetching quiz:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/admin/:adminId", authMiddleware, async (req, res) => {
  try {
    const { adminId } = req.params;
    console.log("🔹 Fetching quizzes for Admin ID:", adminId);

    if (!req.user || req.user.role !== "admin" || req.user.userId !== adminId) {
      return res.status(401).json({ error: "Unauthorized: Admins only" });
    }

    const quizzes = await Quiz.find({ adminId });
    res.json(quizzes);
  } catch (error) {
    console.error("❌ Error fetching quizzes:", error);
    res.status(500).json({ error: "Error fetching quizzes" });
  }
});


// ✅ Route to create a new quiz
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, questions, timeLimit, secretKey } = req.body;
    const adminId = req.user.userId;

    if (!title || !questions.length || !timeLimit || !secretKey) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newQuiz = new Quiz({
      title,
      questions,
      timeLimit,
      secretKey,
      adminId, // ✅ Ensure adminId is set
    });

    await newQuiz.save();
    res.status(201).json({ message: "Quiz added successfully!" });
  } catch (error) {
    console.error("❌ Error adding quiz:", error);
    res.status(500).json({ error: "Error adding quiz" });
  }
});

// ✅ Route to delete a quiz
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    console.log("🔹 Quiz Creator ID:", quiz.adminId.toString());
    console.log("🔹 Logged-in Admin ID:", req.user.userId); // Debugging

    // ✅ Corrected condition
    if (quiz.adminId.toString() !== req.user.userId) { 
      return res.status(403).json({ error: "Unauthorized: Cannot delete this quiz" });
    }

    await quiz.deleteOne();
    res.json({ message: "Quiz deleted successfully!" });
  } catch (error) {
    console.error("❌ Error deleting quiz:", error);
    res.status(500).json({ error: "Error deleting quiz" });
  }
});



module.exports = router;
