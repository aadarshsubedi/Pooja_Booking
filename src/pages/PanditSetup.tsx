import React, { useState } from "react";
import { saveMyPanditProfile } from "../api/Api";
import { useNavigate } from "react-router-dom";

const PanditSetup: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    city: "",
    experience_years: 0,
    bio: "",
    specializations: "",
    image_url: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveMyPanditProfile(form);
      alert("Profile submitted! Admin will approve it soon.");
      navigate("/pandits");
    } catch (err: any) {
      alert(err.message || "Failed to save profile.");
    }
  };

  return (
    <div className="pandit-setup">
      <h2>Complete Your Pandit Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="full_name"
          placeholder="Full name"
          value={form.full_name}
          onChange={handleChange}
        />
        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
        />
        <input
          name="experience_years"
          type="number"
          placeholder="Years of experience"
          value={form.experience_years}
          onChange={handleChange}
        />
        <textarea
          name="bio"
          placeholder="Short bio"
          value={form.bio}
          onChange={handleChange}
        />
        <input
          name="specializations"
          placeholder="Specializations (comma separated)"
          value={form.specializations}
          onChange={handleChange}
        />
        <input
          name="image_url"
          placeholder="Profile image URL"
          value={form.image_url}
          onChange={handleChange}
        />
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default PanditSetup;
