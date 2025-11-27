import { useState, useEffect } from "react";
import { Mic, MicOff, Volume2, VolumeX, FileText, PhoneOff, ArrowLeft, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom"; // <-- import
import "./CallInterface.css";

interface CallInterfaceProps {
  pandit: { name: string; image: string };
  onBack: () => void;
  onEndCall: () => void;
}

const CallInterface = ({ pandit, onBack, onEndCall }: CallInterfaceProps) => {
  const navigate = useNavigate(); // <-- hook to navigate

  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [callStatus, setCallStatus] = useState<"connecting" | "connected">("connecting");

  useEffect(() => {
    if (callStatus !== "connected") return;
    const timer = setInterval(() => setCallDuration(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [callStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const goToMessageInterface = () => {
    // Navigate to the message interface route
    navigate("/messages"); 
  };

  return (
    <div className="call-container">
      <button className="back-btn" onClick={onBack}>
        <ArrowLeft size={22} />
      </button>

      <div className="call-card">
        <div className="profile-section">
          <div className={`profile-ring ${callStatus === "connecting" ? "ring-pulse" : "ring-connected"}`}>
            <img src={pandit.image} className="profile-img" alt={pandit.name} />
          </div>

          {callStatus === "connected" && (
            <div className="connected-badge">
              <span className="dot"></span> Connected
            </div>
          )}

          <h2 className="pandit-name">{pandit.name}</h2>

          <p className="call-status">
            {callStatus === "connecting" ? "Connecting..." : formatDuration(callDuration)}
          </p>

          <div className="tag">🕉️ <span>Consultation Call</span></div>
        </div>

        <div className="controls">
          <button className={`icon-btn ${isMuted ? "active" : ""}`} onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? <MicOff size={30} /> : <Mic size={30} />}
          </button>

          <button className={`icon-btn ${isSpeaker ? "active" : ""}`} onClick={() => setIsSpeaker(!isSpeaker)}>
            {isSpeaker ? <Volume2 size={30} /> : <VolumeX size={30} />}
          </button>

          {/* Message Icon */}
          <button className="icon-btn" onClick={goToMessageInterface}>
            <MessageSquare size={30} />
          </button>
        </div>

        <button className="end-call-btn" onClick={onEndCall}>
          <PhoneOff size={22} /> End Call
        </button>

        <p className="secure-text">Your call is encrypted and secure</p>
      </div>
    </div>
  );
};

export default CallInterface;
