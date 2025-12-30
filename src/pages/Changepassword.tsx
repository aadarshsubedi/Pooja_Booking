import React, { useState } from "react";
import "./ChangePassword.css";

const ChangePassword: React.FC = () => {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (passwords.new !== passwords.confirm) {
      alert("Passwords do not match");
      return;
    }
    alert("Password updated successfully ✅");
  };

  return (
    <div className="change-password-page">
      <div className="change-password-card">
        <h2>Change Password</h2>

        <input
          type="password"
          name="current"
          placeholder="Current Password"
          onChange={handleChange}
        />

        <input
          type="password"
          name="new"
          placeholder="New Password"
          onChange={handleChange}
        />

        <input
          type="password"
          name="confirm"
          placeholder="Confirm New Password"
          onChange={handleChange}
        />

        <button onClick={handleSubmit}>Update Password</button>
      </div>
    </div>
  );
};

export default ChangePassword;
