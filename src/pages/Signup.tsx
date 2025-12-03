// src/components/Signup.tsx
import React, { useState, type ChangeEvent, type FormEvent, useContext } from "react";
import "./Signup.css";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface FormData {
  username: string;
  email: string;
  password: string;
}

const Signup: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({username:"", email:"", password:""});
  const [role, setRole] = useState("");
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const openModal = (r: string) => { setRole(r); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setFormData({username:"", email:"", password:""}); };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const result = await signup(formData.username, formData.email, formData.password, role);
      alert(result?.message || `Signup successful as ${role}`);
      closeModal();
      navigate('/pandits');
    } catch (err: any) {
      alert(err?.message || 'An error occurred during signup.');
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-top"><p className="tagline">Join our community and book poojas with ease!</p></div>
      <div className="signup-container-box">
        <h2>Sign Up</h2>
        <div className="signup-buttons">
          <button className="btn btn-user" onClick={() => openModal("user")}>Sign up as User</button>
          <button className="btn btn-pandit" onClick={() => openModal("pandit")}>Sign up as Pandit</button>
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={closeModal}>&times;</span>
            <h3>Signup as {role === "user" ? "User" : "Pandit"}</h3>
            <form onSubmit={handleSubmit}>
              <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
              <button type="submit" className="submit-btn">Signup</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
