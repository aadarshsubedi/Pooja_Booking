import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Pandits.css";
import { AuthContext } from "../contexts/AuthContext";
import { fetchPandits, type PanditProfile } from "../api/Api";

const PanditCard: React.FC<{ pandit: PanditProfile }> = ({ pandit }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const isAuthenticated = !!user;

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate("/signin");
      return;
    }

    // store profile id (or later you can add user_id field in serializer)
    localStorage.setItem("selectedPanditId", String(pandit.user_id));
    localStorage.setItem(
      "selectedPanditName",
      pandit.full_name || pandit.username
    );

    // go straight to booking flow or a detail page
    // navigate(`/pandit/${pandit.id}`);
    navigate("/booking");
  };

  const handleCall = () => {
    if (!isAuthenticated) {
      navigate("/signin");
      return;
    }
    navigate("/call", { state: { pandit } });
  };

  return (
    <div className="pandit-card">
      <img
        src={pandit.image_url || "/images/pandit-default.png"}
        alt={pandit.full_name || pandit.username}
        className="pandit-image"
      />
      <div className="pandit-details">
        <h3 className="pandit-name">
          {pandit.full_name || pandit.username}
        </h3>
        <p className="pandit-experience">
          {pandit.experience_years}+ years experience
        </p>
        <div className="pandit-rating">
          {"★".repeat(Math.round(pandit.rating || 0))}{" "}
          <span>
            {pandit.rating.toFixed(1)} ({pandit.reviews_count} reviews)
          </span>
        </div>
        <div className="pandit-specializations">
          {(pandit.specializations_list || []).map((spec, index) => (
            <div key={index} className="specialty-box">
              <span className="specialty-icon">🕉️</span>
              {spec}
            </div>
          ))}
        </div>
        <div className="pandit-footer">
          <button className="call-btn" onClick={handleCall}>
            📞 Call
          </button>
          <button className="book-btn" onClick={handleBookNow}>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

const Pandits: React.FC = () => {
  const [pandits, setPandits] = useState<PanditProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPandits()
      .then((data) => {
        setPandits(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load pandits.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading pandits...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="pandits-section">
      <h2 className="pandits-title">Our Experienced Pandits</h2>
      <p className="pandits-subtitle">
        Book trusted and experienced pandits for your rituals
      </p>
      <div className="pandits-grid">
        {pandits.map((p) => (
          <PanditCard key={p.id} pandit={p} />
        ))}
      </div>
    </section>
  );
};

export default Pandits;
