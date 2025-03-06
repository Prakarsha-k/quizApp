import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation(); 
  const hideOptions = location.pathname.startsWith("/quiz/");
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Quiz App</Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            {!hideOptions && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin-login">Teacher</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/student-login">Student</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
