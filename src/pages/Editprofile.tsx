import React, { useEffect, useRef, useState } from "react";
import "./Editprofile.css";
import { getMyProfile, updateMyProfile, uploadAvatar } from "../api/Api";

type UserProfileState = {
  full_name: string;
  phone: string;
  address: string;
  dob: string;      // "YYYY-MM-DD"
  gender: string;
  avatar_url?: string;
};

const EditProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfileState>({
    full_name: "",
    phone: "",
    address: "",
    dob: "",
    gender: "",
    avatar_url: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ Load from backend (source of truth)
  useEffect(() => {
    const init = async () => {
      try {
        const p = await getMyProfile();
        setProfile({
          full_name: p.full_name || "",
          phone: p.phone || "",
          address: p.address || "",
          dob: p.dob || "",
          gender: p.gender || "",
          avatar_url: p.avatar_url || "",
        });

        // cache for navbar/avatar usage if you want
        localStorage.setItem(
          "userProfile",
          JSON.stringify({
            fullName: p.full_name || localStorage.getItem("username") || "",
            username: localStorage.getItem("username") || "",
            email: localStorage.getItem("userEmail") || "",
            phone: p.phone || "",
            address: p.address || "",
            dob: p.dob || "",
            gender: p.gender || "",
            avatar: p.avatar_url || "",
          })
        );

        window.dispatchEvent(new Event("auth-change"));
      } catch (e: any) {
        console.error(e);
        alert(e?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await uploadAvatar(file); // returns avatar_url
      setProfile((prev) => ({ ...prev, avatar_url: res.avatar_url || "" }));

      // update cache for navbar instantly
      const stored = localStorage.getItem("userProfile");
      const p = stored ? JSON.parse(stored) : {};
      localStorage.setItem(
        "userProfile",
        JSON.stringify({ ...p, avatar: res.avatar_url || "" })
      );

      window.dispatchEvent(new Event("auth-change"));
    } catch (e: any) {
      alert(e?.message || "Avatar upload failed");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateMyProfile({
        full_name: profile.full_name,
        phone: profile.phone,
        address: profile.address,
        dob: profile.dob || undefined,
        gender: profile.gender,
      });

      // update UI
      setProfile((prev) => ({
        ...prev,
        full_name: updated.full_name || "",
        phone: updated.phone || "",
        address: updated.address || "",
        dob: updated.dob || "",
        gender: updated.gender || "",
        avatar_url: updated.avatar_url || prev.avatar_url || "",
      }));

      // update cache for navbar
      localStorage.setItem(
        "userProfile",
        JSON.stringify({
          fullName: updated.full_name || localStorage.getItem("username") || "",
          username: localStorage.getItem("username") || "",
          email: localStorage.getItem("userEmail") || "",
          phone: updated.phone || "",
          address: updated.address || "",
          dob: updated.dob || "",
          gender: updated.gender || "",
          avatar: updated.avatar_url || profile.avatar_url || "",
        })
      );

      window.dispatchEvent(new Event("auth-change"));
      alert("Profile updated successfully ✅");
    } catch (e: any) {
      alert(e?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading profile...</p>;

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-card">
        <h2>Edit Profile</h2>

        <div className="edit-avatar" onClick={handleImageClick}>
          <img
            src={profile.avatar_url || "/images/profile.jpg"}
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

        <input
          name="full_name"
          value={profile.full_name}
          onChange={handleChange}
          placeholder="Full Name"
        />

        <input
          name="phone"
          value={profile.phone}
          onChange={handleChange}
          placeholder="Phone Number"
        />

        <input
          name="address"
          value={profile.address}
          onChange={handleChange}
          placeholder="Address"
        />

        <input
          type="date"
          name="dob"
          value={profile.dob}
          onChange={handleChange}
        />

        <select
          name="gender"
          value={profile.gender}
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
