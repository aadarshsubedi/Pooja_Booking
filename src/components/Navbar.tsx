import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Navbar.css";
import { AuthContext } from "../contexts/AuthContext";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/home")}>
        <img src="/images/logo.png" alt="Pooja Booking" />
      </div>

      <ul className="nav-links">
        <li><Link to="/home"><img src="/images/home.png" className="nav-icon" /> Home</Link></li>
        <li><Link to="/poojas"><img src="/images/poojas.png" className="nav-icon" /> Poojas</Link></li>
        <li><Link to="/pandits"><img src="/images/pandits.png" className="nav-icon" /> Pandits</Link></li>
        <li><Link to="/aboutus"><img src="/images/aboutus.png" className="nav-icon" /> About Us</Link></li>
      </ul>

      <div className="nav-buttons">
        {!isAuthenticated ? (
          <>
            <button className="signup" onClick={() => navigate("/signup")}>Sign Up</button>
            <button className="signin" onClick={() => navigate("/signin")}>Sign In</button>
          </>
        ) : (
          <button
            className="profile-avatar"
            type="button"
            title={user?.username || "Profile"}
            onClick={() => navigate("/userprofile")}
          >
            {/* ✅ Dynamic avatar */}
            <img src={user?.avatarUrl || "/images/profile.jpg"} alt="Profile" />
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
