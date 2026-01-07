import React, { useEffect, useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./UserProfile.css";
import { getMyProfile, uploadAvatar } from "../api/Api";
import { AuthContext } from "../contexts/AuthContext";

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

  // ✅ important: refresh Navbar after avatar upload
  const { checkAuth, logout } = useContext(AuthContext);

  // ✅ Load profile from backend on refresh
  useEffect(() => {
    const init = async () => {
      try {
        const username = localStorage.getItem("username") || "";
        const email = localStorage.getItem("userEmail") || "";

        // ✅ GET profile from backend (needs token)
        const profile = await getMyProfile();
        // profile => { full_name, phone, address, avatar_url }

        const merged: UserProfileData = {
          fullName: profile.full_name || username,
          username,
          email,
          phone: profile.phone || "",
          address: profile.address || "",
          avatar: profile.avatar_url || "",
        };

        setUser(merged);
        localStorage.setItem("userProfile", JSON.stringify(merged));
      } catch (err) {
        // fallback to localStorage if backend fails
        const stored = localStorage.getItem("userProfile");
        if (stored) setUser(JSON.parse(stored));
      }
    };

    init();
  }, []);

  const handleImageClick = () => fileInputRef.current?.click();

  // ✅ Upload avatar and persist + update Navbar instantly
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await uploadAvatar(file); // expects { avatar_url: "http://..." }

      setUser((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, avatar: data.avatar_url || "" };
        localStorage.setItem("userProfile", JSON.stringify(updated));
        return updated;
      });

      // ✅ refresh AuthContext so Navbar shows new avatar without refresh
      await checkAuth();
    } catch (err: any) {
      alert(err?.message || "Failed to upload avatar");
    }
  };

  const handleLogout = async () => {
  await logout();
  localStorage.removeItem("userProfile");
  window.dispatchEvent(new Event("auth-change")); // ✅ add this
  navigate("/home");
};

  if (!user) return <p className="profile-empty">No profile data found.</p>;

  return (
    <div className="profile-page">
      <div className="profile-card-desktop">
        <div className="profile-header-desktop">
          <div className="avatar-wrapper" onClick={handleImageClick}>
            <img src={user.avatar || "/images/profile.jpg"} alt="Profile" />
            <div className="camera-icon">📷</div>
          </div>

          <h2>{user.fullName}</h2>
          <p className="username">@{user.username}</p>
          <p className="location">{user.address}</p>
        </div>

        <div className="profile-actions-grid">
          <div className="action-card" onClick={() => navigate("/edit-profile")}>
            👤 Edit Profile
          </div>

          <div className="action-card" onClick={() => navigate("/change-password")}>
            🔒 Change Password
          </div>

          <div className="action-card" onClick={() => navigate("/bookmarks")}>
            ⭐ Bookmarks
          </div>

          <div className="action-card" onClick={() => navigate("/my-location")}>
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
   