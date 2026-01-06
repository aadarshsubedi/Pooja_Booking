import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 🔒 sync login state ONLY (not role routing)
  const syncLoginState = () => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  };

  useEffect(() => {
    syncLoginState();

    // listen to auth updates (signin/signup/logout)
    window.addEventListener("auth-change", syncLoginState);

    return () => {
      window.removeEventListener("auth-change", syncLoginState);
    };
  }, []);

  // ✅ FIXED: role decided at click time (NO stale React state)
  const handleProfileClick = () => {
    const role = localStorage.getItem("role")?.toLowerCase();

    if (role === "pandit") {
      navigate("/pandit-dashboard");
    } else {
      navigate("/userprofile");
    }
  };

  return (
    <nav className="navbar">
      {/* LOGO */}
      <div className="logo" onClick={() => navigate("/home")}>
        <img src="/images/logo.png" alt="Pooja Booking" />
      </div>

      {/* NAV LINKS */}
      <ul className="nav-links">
        <li><Link to="/home"><img src="/images/home.png" className="nav-icon" /> Home</Link></li>
        <li><Link to="/poojas"><img src="/images/poojas.png" className="nav-icon" /> Poojas</Link></li>
        <li><Link to="/pandits"><img src="/images/pandits.png" className="nav-icon" /> Pandits</Link></li>
        <li><Link to="/aboutus"><img src="/images/aboutus.png" className="nav-icon" /> About Us</Link></li>
      </ul>

      {/* RIGHT SIDE */}
      <div className="nav-buttons">
        {!isLoggedIn ? (
          <>
            <button className="signup" onClick={() => navigate("/signup")}>Sign Up</button>
            <button className="signin" onClick={() => navigate("/signin")}>Sign In</button>
          </>
        ) : (
          <button className="profile-avatar" onClick={handleProfileClick}>
            <img src="/images/profile.jpg" alt="Profile" />
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
