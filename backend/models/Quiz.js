const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
  title: { type: String, unique: true, required: true }, // Unique constraint added
  questions: [
    {
      question: String,
      options: [String],
      answer: String,
    },
  ],
  timeLimit: { type: Number, required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Track admin
  secretKey: { type: String, required: true }, // Secret key for student access
});

module.exports = mongoose.model("Quiz", QuizSchema);
