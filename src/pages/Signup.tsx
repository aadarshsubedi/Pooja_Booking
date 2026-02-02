import React, {
  useState,
  type ChangeEvent,
  type FormEvent,
  useContext
} from "react";
import "./Signup.css";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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

  const isValidPhone = (phone: string) => /^9\d{9}$/.test(phone);

  const isValidPassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);
  const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  return email.length >= 6 && email.length <= 254 && emailRegex.test(email);
};

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (role === "user") {
        if (!isValidPhone(userData.phone)) {
          alert("Phone number must start with 9 and be exactly 10 digits.");
          return;
        }

        if (!isValidPassword(userData.password)) {
          alert(
            "Password must contain uppercase, lowercase, number & special character."
          );
          return;
        }
        if(!isValidEmail(userData.email)){
          alert("Invalid email");
          return;
        }

        await signup(
          userData.username,
          userData.email,
          userData.password,
          "user",
          {
            full_name: userData.fullName,
            phone: userData.phone,
            address: userData.address,
            dob: userData.dob,
            gender: userData.gender,
          }
        );

        localStorage.setItem("userRole", "user");
        window.dispatchEvent(new Event("auth-change"));
        navigate("/home");
      }

      if (role === "pandit") {
        if (!isValidPassword(panditData.password)) {
          alert("Password must be strong.");
          return;
        }

        await signup(
          panditData.username,
          panditData.email,
          panditData.password,
          "pandit"
        );

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", "pandit");
        localStorage.setItem("panditVerified", "false");

        window.dispatchEvent(new Event("auth-change"));
        navigate("/pandit-verification");
      }

      closeModal();
    } catch (err: any) {
      alert(err?.message || "Signup failed.");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-top">
        <p className="tagline">Join our community and book poojas with ease!</p>
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

            <h3>{role === "user" ? "User Registration" : "Pandit Registration"}</h3>

            <form onSubmit={handleSubmit} className="signup-form">
              {role === "user" && (
                <>
                  <div className="form-row">
                    <div>
                      <label>Full Name</label>
                      <input name="fullName" onChange={handleUserChange} required />
                    </div>
                    <div>
                      <label>Username</label>
                      <input name="username" onChange={handleUserChange} required />
                    </div>
                  </div>

                  <div className="form-row">
                    <div>
                      <label>Email</label>
                      <input type="email" name="email" onChange={handleUserChange} required />
                    </div>
                    <div>
                      <label>Phone Number</label>
                      <input name="phone" onChange={handleUserChange} required />
                    </div>
                  </div>

                  <div className="form-row">
                    <div>
                      <label>Gender</label>
                      <select name="gender" onChange={handleUserChange} required>
                        <option value="">Select Gender</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label>Date of Birth</label>
                      <input type="date" name="dob" onChange={handleUserChange} required />
                    </div>
                  </div>

                  <label>Address</label>
                  <input name="address" onChange={handleUserChange} required />

                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    onChange={handleUserChange}
                    required
                  />
                </>
              )}

              {role === "pandit" && (
                <>
                  <label>Username</label>
                  <input name="username" onChange={handlePanditChange} required />

                  <label>Email</label>
                  <input type="email" name="email" onChange={handlePanditChange} required />

                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    onChange={handlePanditChange}
                    required
                  />
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
