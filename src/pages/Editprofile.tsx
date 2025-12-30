import React, { useEffect, useRef, useState } from "react";
import "./Editprofile.css";

interface UserProfile {
  fullName?: string;
  phone?: string;
  address?: string;
  dob?: string;
  gender?: string;
  avatar?: string;
}

const EditProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const data = localStorage.getItem("userProfile");
    if (data) setProfile(JSON.parse(data));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile({ ...profile, avatar: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    alert("Profile updated successfully ✅");
  };

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-card">
        <h2>Edit Profile</h2>

        {/* PROFILE IMAGE */}
        <div className="edit-avatar" onClick={handleImageClick}>
          <img
            src={profile.avatar || "/images/profile.jpg"}
            alt="Profile"
          />
          <span className="change-photo">Change Photo</span>
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          hidden
          onChange={handleImageChange}
        />

        {/* FORM FIELDS */}
        <input
          name="fullName"
          value={profile.fullName || ""}
          onChange={handleChange}
          placeholder="Full Name"
        />

        <input
          name="phone"
          value={profile.phone || ""}
          onChange={handleChange}
          placeholder="Phone Number"
        />

        <input
          name="address"
          value={profile.address || ""}
          onChange={handleChange}
          placeholder="Address"
        />

        <input
          type="date"
          name="dob"
          value={profile.dob || ""}
          onChange={handleChange}
        />

        <select
          name="gender"
          value={profile.gender || ""}
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <button onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  );
};

export default EditProfile;
