import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserProfile.css";

interface UserProfileData {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  avatar?: string;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<UserProfileData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("userProfile");
  if (stored) {
    setUser(JSON.parse(stored));
    return;
  }
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("userEmail") || "";

  if (username) {
    const basicProfile: UserProfileData = {
      fullName: username,
      username,
      email,
      phone: "",
      address: "",
      avatar: "",
    };
    setUser(basicProfile);
    localStorage.setItem("userProfile", JSON.stringify(basicProfile));
  }
}, []);
 
  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedUser = { ...user, avatar: reader.result as string };
      setUser(updatedUser);
      localStorage.setItem("userProfile", JSON.stringify(updatedUser));
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userProfile");
  localStorage.removeItem("userRole");
  localStorage.removeItem("username");
  localStorage.removeItem("userEmail");
  window.dispatchEvent(new Event("auth-change"));
  navigate("/home");
};

  if (!user) return <p className="profile-empty">No profile data found.</p>;

  return (
    <div className="profile-page">
      <div className="profile-card-desktop">
        {/* HEADER */}
        <div className="profile-header-desktop">
          <div className="avatar-wrapper" onClick={handleImageClick}>
            <img src={user.avatar || "/images/profile.jpg"} alt="Profile" />
            <div className="camera-icon">📷</div>
          </div>

          <h2>{user.fullName}</h2>
          <p className="username">@{user.username}</p>
          <p className="location">{user.address}</p>
        </div>

        {/* ACTIONS */}
        <div className="profile-actions-grid">
          <div
            className="action-card"
            onClick={() => navigate("/edit-profile")}
          >
            👤 Edit Profile
          </div>

          <div
            className="action-card"
            onClick={() => navigate("/change-password")}
          >
            🔒 Change Password
          </div>

          <div
            className="action-card"
            onClick={() => navigate("/bookmarks")}
          >
            ⭐ Bookmarks
          </div>

          <div
            className="action-card"
            onClick={() => navigate("/my-location")}
          >
            📍 My Location
          </div>

          <div className="action-card logout" onClick={handleLogout}>
            🚪 Logout
          </div>
        </div>
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        hidden
        onChange={handleImageChange}
      />
    </div>
  );
};

export default UserProfile;
