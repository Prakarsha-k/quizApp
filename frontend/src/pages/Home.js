import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/quizzes")
      .then((res) => {
        setQuizzes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching quizzes:", err);
        setError("Failed to load quizzes. Please try again later.");
        setLoading(false);
      });
  }, []);

  // ✅ Filter quizzes based on search input
  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Handle quiz selection with secret key verification
  const handleQuizClick = (quiz) => {
    const enteredKey = prompt(`Enter the secret key for "${quiz.title}":`);
    if (enteredKey === quiz.secretKey) {
      navigate(`/quiz/${quiz._id}`);
    } else {
      alert("❌ Incorrect secret key! Access denied.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Welcome to the Quiz App</h2>

      {/* ✅ Search Bar */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="🔍 Search for a quiz..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* ✅ Show loading state */}
      {loading && <p className="text-center">Loading quizzes...</p>}

      {/* ✅ Show error message if request fails */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* ✅ Display Filtered Quizzes */}
      {!loading && !error && (
        <ul className="list-group">
          {filteredQuizzes.length === 0 ? (
            <p className="text-center">No quizzes found.</p>
          ) : (
            filteredQuizzes.map((quiz) => (
              <li
                key={quiz._id}
                className="list-group-item d-flex justify-content-between align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => handleQuizClick(quiz)}
              >
                {quiz.title}
                <span className="badge bg-primary">{quiz.questions.length} Questions</span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default Home;
