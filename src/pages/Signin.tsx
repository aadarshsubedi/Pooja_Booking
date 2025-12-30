// src/components/Signin.tsx
import React, {
  useState,
  type ChangeEvent,
  type FormEvent,
  useContext
} from "react";
import "./Signin.css";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface FormData {
  username: string;
  password: string;
}

const Signin: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: ""
  });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const result = await login(formData.username, formData.password);

      // ✅ SET LOGIN STATE
      localStorage.setItem("isLoggedIn", "true");
      window.dispatchEvent(new Event("auth-change"));

      alert(
        result?.message ||
          `Welcome, ${result?.username || formData.username}!`
      );

      navigate("/pandits");
    } catch (err: any) {
      alert(err?.message || "An error occurred during signin.");
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
