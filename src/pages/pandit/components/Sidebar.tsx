import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./PanditComponents.css";
import { AuthContext } from "../../../contexts/AuthContext"; 


const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout(); // ✅ clears tokens + triggers auth-change (based on your AuthContext)
    navigate("/home", { replace: true });
  };

  return (
    <aside className="pandit-sidebar">
      <NavLink to="/pandit/dashboard">Dashboard</NavLink>
      <NavLink to="/pandit/bookings">Bookings</NavLink>
      <NavLink to="/pandit/schedule">Schedule</NavLink>
      <NavLink to="/pandit/earnings">Earnings</NavLink>
      <NavLink to="/pandit/profile">Profile</NavLink>

      {/* ✅ Logout at bottom */}
      <button type="button" className="pandit-logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
