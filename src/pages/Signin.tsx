// // src/pages/Signin.tsx
// import React, {
//   useState,
//   type ChangeEvent,
//   type FormEvent,
//   useContext
// } from "react";
// import "./Signin.css";
// import { AuthContext } from "../contexts/AuthContext";
// import { useNavigate } from "react-router-dom";

// interface FormData {
//   username: string;
//   password: string;
// }

// const Signin: React.FC = () => {
//   const [formData, setFormData] = useState<FormData>({
//     username: "",
//     password: ""
//   });

//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();

//     try {
//       // 🔥 HARD RESET OLD AUTH
//       localStorage.removeItem("isLoggedIn");
//       localStorage.removeItem("role");

//       /**
//        * EXPECTED BACKEND RESPONSE:
//        * {
//        *   username: string,
//        *   role: "user" | "pandit"
//        * }
//        */
//       const result = await login(formData.username, formData.password);

//       // ✅ AUTH FLAG
//       // localStorage.setItem("isLoggedIn", "true");

//       // ✅ STRICT ROLE NORMALIZATION (VERY IMPORTANT)
//       const backendRole = String(result?.role || "user")
//         .trim()
//         .toLowerCase();

//       const safeRole =
//         backendRole === "pandit" ? "pandit" : "user";

//       localStorage.setItem("userRole", safeRole);

//       // ✅ UPDATE NAVBAR WITHOUT REFRESH
//       // window.dispatchEvent(new Event("auth-change"));

//       alert(
//         result?.message ||
//           `Welcome back, ${result?.username || formData.username}!`
//       );

//       // ✅ ROLE-BASED REDIRECT (BULLETPROOF)
//       if (safeRole === "pandit") {
//         navigate("/pandit-dashboard");
//       } else {
//         navigate("/home");
//       }
//     } catch (err: any) {
//       alert(err?.message || "An error occurred during signin.");
//     }

//     console.log("After login tokens:", {
//       access: localStorage.getItem("accessToken"),
//       refresh: localStorage.getItem("refreshToken"),
//     });
//   };

//   return (
//     <div className="signin-page">
//       <main className="signin-container">
//         <h2>Sign In</h2>

//         <form onSubmit={handleSubmit} className="signin-form">
//           <input
//             type="text"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//             placeholder="Username"
//             required
//           />

//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             placeholder="Password"
//             required
//           />

//           <button type="submit" className="submit-btn">
//             Sign In
//           </button>
//         </form>
//       </main>
//     </div>
//   );
// };

// export default Signin;
// src/pages/Signin.tsx
import React, { useState, type ChangeEvent, type FormEvent, useContext } from "react";
import "./Signin.css";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getMyPanditProfile } from "../api/Api";


interface FormData {
  username: string;
  password: string;
}

const Signin: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
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

// ✅ normalize role from backend
const backendRole = String(result?.role || "user").trim().toLowerCase();
const safeRole = backendRole === "pandit" ? "pandit" : "user";

// ✅ store role in ONE place only
localStorage.setItem("userRole", safeRole);

// ✅ update navbar immediately
window.dispatchEvent(new Event("auth-change"));

// ✅ redirect based on approval (backend)
if (safeRole === "pandit") {
  try {
    const profile = await getMyPanditProfile(); // GET /api/pandits/me/
    if (profile?.is_approved) {
      navigate("/pandit/dashboard");
    } else {
      navigate("/pandit-verification");
    }
  } catch (e) {
    // if profile doesn't exist or fails, send to verification
    navigate("/pandit-verification");
  }
} else {
  navigate("/home");
}
    } catch (err: any) {
      alert(err?.message || "An error occurred during signin.");
    }

    console.log("After login tokens:", {
      access: localStorage.getItem("accessToken"),
      refresh: localStorage.getItem("refreshToken"),
      userRole: localStorage.getItem("userRole"),
    });
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
