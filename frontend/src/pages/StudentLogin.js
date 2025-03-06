import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // ✅ Import Link

const StudentLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
        role: "student",
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "student");

      alert("Student Login Successful!");
      navigate("/home");
    } catch (error) {
      alert(error.response?.data?.error || "Login failed!");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Student Login</h2>
      <form onSubmit={handleLogin} className="w-50 mx-auto p-4 border rounded shadow">
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>

      {/* ✅ Add Link for Admins */}
      <p className="text-center mt-3">
        Are you an <b>Teacher</b>?{" "}
        <Link to="/admin-login" className="text-primary">Login here</Link>
      </p>
    </div>
  );
};

export default StudentLogin;
