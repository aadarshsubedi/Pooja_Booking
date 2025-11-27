import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Phone, MessageCircle } from "lucide-react";

import CallInterface from "./callinterface";
import MessageInterface from "./messageinterface";

import "./CallPage.css";

type ViewMode = "selection" | "call" | "message";

const CallPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pandit = location.state?.pandit; // get pandit from navigate state
  const [viewMode, setViewMode] = useState<ViewMode>("selection");

  const handleEndCall = () => navigate("/"); 
  const handleBack = () => setViewMode("selection");

  if (!pandit) return <p>Pandit data not found. Go back and select a pandit.</p>;

  if (viewMode === "call")
    return <CallInterface pandit={pandit} onBack={handleBack} onEndCall={handleEndCall} />;

  if (viewMode === "message")
    return <MessageInterface onBack={handleBack} />;

  return (
    <div className="call-page-container">
      <div className="profile-card">
        <div className="profile-section">
          <div className="profile-image">
            <img src={pandit.image} alt={pandit.name} />
          </div>
          <h2 className="profile-name">{pandit.name}</h2>
          <p className="profile-experience">{pandit.experience}</p>
          <div className="profile-badge">
            <span>🕉️ Spiritual Guide</span>
          </div>
        </div>

        <div className="action-section">
          <p className="action-text">Choose how you'd like to connect</p>
          <div className="action-buttons">
            <button className="action-button" onClick={() => setViewMode("call")}>
              <div className="icon-circle"><Phone className="icon" /></div>
              Voice Call
            </button>
            <button className="action-button" onClick={() => setViewMode("message")}>
              <div className="icon-circle accent"><MessageCircle className="icon accent" /></div>
              Message
            </button>
          </div>
          <button className="back-button" onClick={() => navigate("/")}>Go Back</button>
        </div>

        <div className="info-section">
          Available for consultation • Secure & Private
        </div>
      </div>
    </div>
  );
};

export default CallPage;
