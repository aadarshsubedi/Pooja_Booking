import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PanditVerification.css";

const PanditVerification: React.FC = () => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  /* 🔐 HARD GUARD: ONLY PANDIT CAN ACCESS */
  useEffect(() => {
    const role = localStorage.getItem("role");
    const verified = localStorage.getItem("panditVerified");

    // ❌ If not pandit → kick out
    if (role !== "pandit") {
      navigate("/home", { replace: true });
      return;
    }

    // ✅ If already verified → go to dashboard
    if (verified === "true") {
      navigate("/pandit/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreed) {
      alert("Please accept terms & conditions");
      return;
    }

    // ✅ Mark verification complete (frontend flag)
    localStorage.setItem("panditVerified", "true");

    // ✅ GO TO PANDIT DASHBOARD (CORRECT ROUTE)
    navigate("/pandit/dashboard", { replace: true });
  };

  return (
    /* 🔥 PAGE BACKGROUND */
    <div className="pandit-verify-page">
      {/* 🔥 FORM CONTAINER */}
      <div className="pandit-verify-container">
        <h1>Pandit Registration & Verification</h1>
        <p className="subtitle">
          Submit your details for official verification
        </p>

        <form onSubmit={handleSubmit}>
          {/* PERSONAL INFO */}
          <div className="verify-section">
            <h3>Personal Information</h3>
            <div className="verify-grid">
              <input className="verify-input" placeholder="Full Name" required />
              <input
                className="verify-input"
                placeholder="Email Address"
                required
              />
              <input
                className="verify-input"
                placeholder="Phone Number"
                required
              />
            </div>
          </div>

          {/* ADDRESS */}
          <div className="verify-section">
            <h3>Address Details</h3>
            <div className="verify-grid">
              <input className="verify-input" placeholder="Full Address" />
              <input className="verify-input" placeholder="City" />
              <input className="verify-input" placeholder="State" />
            </div>
          </div>

          {/* PROFESSIONAL */}
          <div className="verify-section">
            <h3>Professional Details</h3>
            <div className="verify-grid">
              <input
                className="verify-input"
                placeholder="Temple Affiliation"
              />
              <select className="verify-select">
                <option>Years of Experience</option>
                <option>1–3</option>
                <option>3–5</option>
                <option>5+</option>
              </select>
            </div>

            <textarea
              className="verify-textarea"
              placeholder="Vedic Education & Training"
            />
          </div>

          {/* SPECIALIZATIONS */}
          <div className="verify-section">
            <h3>Specializations</h3>
            <div className="specialization-grid">
              <label className="specialization-item">
                <input type="checkbox" /> Grih Pravesh
              </label>
              <label className="specialization-item">
                <input type="checkbox" /> Vivah Sanskar
              </label>
              <label className="specialization-item">
                <input type="checkbox" /> Satyanarayan Katha
              </label>
            </div>
          </div>

          {/* DOCUMENTS */}
          <div className="verify-section">
            <h3>Documents</h3>
            <div className="upload-box">
              <p>Upload ID Proof, Certificates, or Authorization Letters</p>
              <input type="file" multiple />
            </div>
          </div>

          {/* TERMS */}
          <div className="verify-terms">
            <input
              type="checkbox"
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
            />
            <span>I agree to the terms & conditions</span>
          </div>

          {/* SUBMIT */}
          <button type="submit" className="verify-submit">
            Submit for Verification
          </button>
        </form>
      </div>
    </div>
  );
};

export default PanditVerification;
