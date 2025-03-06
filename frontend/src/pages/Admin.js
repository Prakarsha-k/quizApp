import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([{ question: "", options: ["", "", "", ""], answer: "" }]);
  const [timeLimit, setTimeLimit] = useState(60);
  const [secretKey, setSecretKey] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ Retrieve logged-in admin ID
  const adminId = localStorage.getItem("adminId");

  // ✅ Fetch only quizzes created by this admin
  useEffect(() => {
    const storedAdminId = localStorage.getItem("adminId");

    if (!storedAdminId) {
      setError("Admin ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    console.log("Retrieved adminId:", storedAdminId); // Debugging

    const fetchQuizzes = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/quizzes/admin/${storedAdminId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setQuizzes(res.data);
      } catch (err) {
        setError("Failed to load quizzes.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  // ✅ Handle input changes
  const handleQuestionChange = (index, field, value) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      if (field === "question") updatedQuestions[index].question = value;
      else if (field.startsWith("option")) updatedQuestions[index].options[parseInt(field.replace("option", ""))] = value;
      else if (field === "answer") updatedQuestions[index].answer = value;
      return updatedQuestions;
    });
  };

  // ✅ Add a new question
  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], answer: "" }]);
  };

  // ✅ Submit new quiz
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adminId) {
      setError("Admin ID missing. Please log in again.");
      return;
    }

    const newQuiz = { title, questions, timeLimit, secretKey, adminId }; // ✅ Store `adminId`

    try {
      const res = await axios.post("http://localhost:5000/api/quizzes", newQuiz, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      alert("Quiz added successfully!");

      // ✅ Reset form fields
      setTitle("");
      setSecretKey("");
      setTimeLimit(60);
      setQuestions([{ question: "", options: ["", "", "", ""], answer: "" }]);

      // ✅ Update quizzes list with new quiz without re-fetching
      setQuizzes((prevQuizzes) => [...prevQuizzes, res.data]);
    } catch (error) {
      alert(error.response?.data?.error || "Error adding quiz");
    }
  };

  // ✅ Delete a quiz
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/quizzes/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Quiz deleted successfully!");

      // ✅ Remove deleted quiz from UI without refetching
      setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz._id !== id));
    } catch (error) {
      alert(error.response?.data?.error || "Error deleting quiz");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Admin Panel - Add Quiz</h2>

      {/* ✅ Display error message if any */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* ✅ Display loading spinner */}
      {loading ? <p>Loading quizzes...</p> : (
        <>
          {/* ✅ Create New Quiz Form */}
          <form onSubmit={handleSubmit}>
            <input className="form-control mb-2" type="text" placeholder="Quiz Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <input className="form-control mb-2" type="number" placeholder="Time Limit (seconds)" value={timeLimit} onChange={(e) => setTimeLimit(Number(e.target.value))} required />
            <input className="form-control mb-2" type="text" placeholder="Secret Key (for students)" value={secretKey} onChange={(e) => setSecretKey(e.target.value)} required />

            {questions.map((q, index) => (
              <div key={index} className="mb-3">
                <input className="form-control mb-2" type="text" placeholder={`Question ${index + 1}`} value={q.question} onChange={(e) => handleQuestionChange(index, "question", e.target.value)} required />
                {q.options.map((opt, optIndex) => (
                  <input key={optIndex} className="form-control mb-2" type="text" placeholder={`Option ${optIndex + 1}`} value={opt} onChange={(e) => handleQuestionChange(index, `option${optIndex}`, e.target.value)} required />
                ))}
                <input className="form-control mb-2" type="text" placeholder="Correct Answer" value={q.answer} onChange={(e) => handleQuestionChange(index, "answer", e.target.value)} required />
              </div>
            ))}

            <button type="button" className="btn btn-secondary mb-2" onClick={addQuestion}>Add Question</button>
            <button type="submit" className="btn btn-success">Submit Quiz</button>
          </form>

          {/* ✅ Display Existing Quizzes */}
          <h3 className="mt-4">Your Quizzes</h3>
          {quizzes.length === 0 ? (
            <p>No quizzes found.</p>
          ) : (
            <ul className="list-group">
              {quizzes.map((quiz) => (
                <li key={quiz._id} className="list-group-item d-flex justify-content-between align-items-center">
                  <span onClick={() => navigate(`/quiz/${quiz._id}`)} style={{ cursor: "pointer" }}>{quiz.title}</span>
                  <div>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(quiz._id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default Admin;
