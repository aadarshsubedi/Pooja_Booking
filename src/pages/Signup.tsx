import React, {
  useState,
  type ChangeEvent,
  type FormEvent,
  useContext
} from "react";
import "./Signup.css";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

/* ---------------- TYPES ---------------- */

interface UserFormData {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  address: string;
  password: string;
}

interface PanditFormData {
  username: string;
  email: string;
  password: string;
}

/* ---------------- COMPONENT ---------------- */

const Signup: React.FC = () => {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [role, setRole] = useState<"user" | "pandit" | "">("");

  const [userData, setUserData] = useState<UserFormData>({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    address: "",
    password: ""
  });

  const [panditData, setPanditData] = useState<PanditFormData>({
    username: "",
    email: "",
    password: ""
  });

  /* ---------------- HANDLERS ---------------- */

  const openModal = (r: "user" | "pandit") => {
    setRole(r);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleUserChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handlePanditChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPanditData({ ...panditData, [e.target.name]: e.target.value });
  };

  /* ---------------- SUBMIT (FIXED) ---------------- */

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // 🔥 CLEAR PREVIOUS SESSION (CRITICAL)
      localStorage.clear();

      /* ================= USER SIGNUP ================= */
      if (role === "user") {
        await signup(
          userData.username,
          userData.email,
          userData.password,
          "user"
        );

        localStorage.setItem(
          "userProfile",
          JSON.stringify({
            fullName: userData.fullName,
            username: userData.username,
            email: userData.email,
            phone: userData.phone,
            gender: userData.gender,
            dob: userData.dob,
            address: userData.address
          })
        );

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", "user");

        window.dispatchEvent(new Event("auth-change"));

        navigate("/home");
      }

      /* ================= PANDIT SIGNUP ================= */
      else if (role === "pandit") {
        await signup(
          panditData.username,
          panditData.email,
          panditData.password,
          "pandit"
        );

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", "pandit");

        // 🔑 verification gate
        localStorage.setItem("panditVerified", "false");

        window.dispatchEvent(new Event("auth-change"));

        navigate("/pandit-verification");
      }
    } catch (err: any) {
      alert(err?.message || "Signup failed.");
    }
  };

  /* ---------------- JSX ---------------- */

  return (
    <div className="signup-page">
      <div className="signup-top">
        <p className="tagline">
          Join our community and book poojas with ease!
        </p>
      </div>

      <div className="signup-container-box">
        <h2>Sign Up</h2>
        <div className="signup-buttons">
          <button className="btn btn-user" onClick={() => openModal("user")}>
            Sign up as User
          </button>

          <button className="btn btn-pandit" onClick={() => openModal("pandit")}>
            Sign up as Pandit
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={closeModal}>
              &times;
            </span>

            <h3>
              {role === "user"
                ? "User Registration"
                : "Pandit Registration"}
            </h3>

            <form onSubmit={handleSubmit} className="signup-form">
              {role === "user" && (
                <>
                  <input name="fullName" placeholder="Full Name" onChange={handleUserChange} required />
                  <input name="username" placeholder="Username" onChange={handleUserChange} required />
                  <input type="email" name="email" placeholder="Email" onChange={handleUserChange} required />
                  <input name="phone" placeholder="Phone Number" onChange={handleUserChange} required />

                  <select name="gender" onChange={handleUserChange} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>

                  <input type="date" name="dob" onChange={handleUserChange} required />
                  <input name="address" placeholder="Address" onChange={handleUserChange} required />
                  <input type="password" name="password" placeholder="Password" onChange={handleUserChange} required />
                </>
              )}

              {role === "pandit" && (
                <>
                  <input name="username" placeholder="Username" onChange={handlePanditChange} required />
                  <input type="email" name="email" placeholder="Email" onChange={handlePanditChange} required />
                  <input type="password" name="password" placeholder="Password" onChange={handlePanditChange} required />
                </>
              )}

              <button type="submit" className="submit-btn">
                Create Account
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
