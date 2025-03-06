import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import StudentLogin from "./pages/StudentLogin";
import AdminLogin from "./pages/AdminLogin";
import QuizPage from "./components/QuizPage";
import Navbar from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

// 🔹 Protected Route Component
const ProtectedRoute = ({ element, allowedRoles, redirectTo }) => {
  const userRole = localStorage.getItem("role");

  return allowedRoles.includes(userRole) ? (
    element
  ) : (
    <Navigate to={redirectTo} replace />
  );
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* 🔹 Default redirect to Student Login */}
        <Route path="/" element={<Navigate to="/student-login" />} />

        {/* 🔹 Separate Login Pages */}
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* 🔹 Student Routes */}
        <Route
          path="/home"
          element={<ProtectedRoute element={<Home />} allowedRoles={["student"]} redirectTo="/student-login" />}
        />
        <Route
          path="/quiz/:id"
          element={<ProtectedRoute element={<QuizPage />} allowedRoles={["student"]} redirectTo="/student-login" />}
        />

        {/* 🔹 Admin Routes */}
        <Route
          path="/admin"
          element={<ProtectedRoute element={<Admin />} allowedRoles={["admin"]} redirectTo="/admin-login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
