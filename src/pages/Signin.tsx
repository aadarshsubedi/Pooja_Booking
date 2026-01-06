// src/pages/Signin.tsx
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
      // 🔥 HARD RESET OLD AUTH
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("role");

      /**
       * EXPECTED BACKEND RESPONSE:
       * {
       *   username: string,
       *   role: "user" | "pandit"
       * }
       */
      const result = await login(formData.username, formData.password);

      // ✅ AUTH FLAG
      localStorage.setItem("isLoggedIn", "true");

      // ✅ STRICT ROLE NORMALIZATION (VERY IMPORTANT)
      const backendRole = String(result?.role || "user")
        .trim()
        .toLowerCase();

      const safeRole =
        backendRole === "pandit" ? "pandit" : "user";

      localStorage.setItem("role", safeRole);

      // ✅ UPDATE NAVBAR WITHOUT REFRESH
      window.dispatchEvent(new Event("auth-change"));

      alert(
        result?.message ||
          `Welcome back, ${result?.username || formData.username}!`
      );

      // ✅ ROLE-BASED REDIRECT (BULLETPROOF)
      if (safeRole === "pandit") {
        navigate("/pandit-dashboard");
      } else {
        navigate("/home");
      }
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
