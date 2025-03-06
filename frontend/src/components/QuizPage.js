import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/quizzes/${id}`)
      .then((res) => {
        if (res.data) {
          setQuiz(res.data);
          setTimeLeft(res.data.timeLimit || 60);
        } else {
          setError("Quiz not found!");
        }
      })
      .catch(() => setError("Quiz not found!"));
  }, [id]);

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0 && !submitted) {
      const interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            handleSubmit();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timeLeft, submitted]);

  const handleAnswerChange = (questionIndex, selectedOption) => {
    setAnswers({ ...answers, [questionIndex]: selectedOption });
  };

  const handleSubmit = () => {
    if (!quiz || submitted) return;

    // ✅ Stop Timer After Submission
    setTimeLeft(0);

    // ✅ Prevent Submission if No Answers Given
    if (Object.keys(answers).length === 0) {
      setError("⚠️ Please answer at least one question before submitting!");
      return;
    }

    const newScore = quiz.questions.reduce((acc, question, index) => {
      return acc + (answers[index] === question.answer ? 1 : 0);
    }, 0);

    setScore(newScore);
    setSubmitted(true);
    setError(null);
  };

  const handleRetake = () => {
    setAnswers({});
    setScore(null);
    setSubmitted(false);
    setTimeLeft(quiz.timeLimit || 60);
    setError(null);
  };

  if (error) return <h3 className="text-danger">{error}</h3>;
  if (!quiz) return <h3>Loading quiz...</h3>;

  return (
    <div className="container mt-4">
      <h2>{quiz.title}</h2>
      <h5 className="text-danger">Time Left: {timeLeft !== null ? `${timeLeft}s` : "Loading..."}</h5>

      {quiz.questions.map((q, index) => (
        <div key={index} className="mb-3">
          <h5>{index + 1}. {q.question}</h5>
          {q.options.map((option, optIndex) => (
            <div key={optIndex} className="form-check">
              <input
                type="radio"
                className="form-check-input"
                name={`question-${index}`}
                value={option}
                checked={answers[index] === option}
                onChange={() => handleAnswerChange(index, option)}
                disabled={submitted}
              />
              <label className="form-check-label">{option}</label>
            </div>
          ))}
        </div>
      ))}

      {error && <p className="text-danger mt-2">{error}</p>}

      {!submitted ? (
        <button className="btn btn-success mt-3" onClick={handleSubmit}>Submit</button>
      ) : (
        <div className="mt-4">
          <h4 className="text-success">Your Score: {score} / {quiz.questions.length}</h4>
          <button className="btn btn-primary mt-3" onClick={handleRetake}>Retake Test</button>
          <button className="btn btn-secondary mt-3 ms-2" onClick={() => navigate("/home")}>Go to Home</button>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
