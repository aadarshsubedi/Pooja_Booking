import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import "./Signin.css"; // Create this file for styling
import { signinUser } from "../api/Api"; // Create/update this API file

interface FormData {
  username: string;
  password: string;
}

const Signin: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // API call to the Django signin endpoint
      const result = await signinUser(formData); 
      alert(result.message || `Welcome, ${result.username}!`);
      // You would likely redirect the user or update application state here
    } catch (err: any) {
      alert(err.message || 'An error occurred during signin.');
    }
  };

  return (
    <div className="signin-page">
      <main className="signin-container">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit} className="signin-form">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <button type="submit" className="submit-btn">
            Sign In
          </button>
        </form>
      </main>
    </div>
  );
};

export default Signin;