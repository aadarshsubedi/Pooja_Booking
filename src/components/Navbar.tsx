import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);

  const handleLogoClick = () => {
    navigate("/home");
    window.location.reload();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setProfileOpen(false);
    navigate("/home");
  };

  return (
    <nav className="navbar">
      {/* === LOGO === */}
      <div className="logo" onClick={handleLogoClick}>
        <img src="/images/logo.png" alt="Pooja Booking" />
      </div>

      {/* === NAV LINKS === */}
      <ul className="nav-links">
        <li>
          <Link to="/home">
            <img src="/images/home.png" className="nav-icon" /> Home
          </Link>
        </li>
        <li>
          <Link to="/poojas">
            <img src="/images/poojas.png" className="nav-icon" /> Poojas
          </Link>
        </li>
        <li>
          <Link to="/pandits">
            <img src="/images/pandits.png" className="nav-icon" /> Pandits
          </Link>
        </li>
        <li>
          <Link to="/aboutus">
            <img src="/images/aboutus.png" className="nav-icon" /> About Us
          </Link>
        </li>
      </ul>

      {/* === BUTTONS / PROFILE === */}
      <div className="nav-buttons">
        {!isLoggedIn ? (
          <>
            <button className="signup" onClick={() => navigate("/signup")}>
              Sign Up
            </button>
            <button className="signin" onClick={() => navigate("/signin")}>
              Sign In
            </button>
          </>
        ) : (
          <div className="profile-dropdown">
            <button
              className="profile-btn"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              Profile
            </button>

            {profileOpen && (
              <div className="dropdown-menu">
                <button
                  className="dropdown-item"
                  onClick={() => navigate("/userprofile")}
                >
                  My Profile
                </button>
                <button className="dropdown-item" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
