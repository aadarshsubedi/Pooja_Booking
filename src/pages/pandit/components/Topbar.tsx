import "./PanditComponents.css";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";

const DEFAULT_AVATAR = "/images/profile.jpg";

const PanditTopbar: React.FC = () => {
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);

  const [avatar, setAvatar] = useState<string>(DEFAULT_AVATAR);
  const [name, setName] = useState<string>("Pandit");

  useEffect(() => {
    const sync = () => {
      // Try from localStorage userProfile (your app already uses this)
      const stored = localStorage.getItem("userProfile");
      if (stored) {
        try {
          const p = JSON.parse(stored);
          setAvatar(p?.avatar || DEFAULT_AVATAR);
          setName(p?.fullName || p?.username || user?.username || "Pandit");
          return;
        } catch {
          // ignore
        }
      }

      // fallback
      setAvatar(DEFAULT_AVATAR);
      setName(user?.username || "Pandit");
    };

    sync();
    window.addEventListener("auth-change", sync);
    return () => window.removeEventListener("auth-change", sync);
  }, [user?.username]);

  const handleLogout = async () => {
    await logout();
    // Optional extra cleanup (safe)
    localStorage.removeItem("panditVerified");
    navigate("/home", { replace: true });
  };

  return (
    <header className="pandit-topbar">
      <div className="pandit-topbar-left" onClick={() => navigate("/pandit/dashboard")}>
        <div className="pandit-brand">Pandit Dashboard</div>
      </div>

      <div className="pandit-topbar-right">
        <button
          type="button"
          className="pandit-avatar-btn"
          title="Profile"
          onClick={() => navigate("/pandit/profile")}
        >
          <img src={avatar} alt="Avatar" className="pandit-avatar" />
          <span className="pandit-name">{name}</span>
        </button>

        <button type="button" className="pandit-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default PanditTopbar;
