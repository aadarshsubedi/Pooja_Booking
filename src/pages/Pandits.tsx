// // src/components/Pandits.tsx
// import React, { useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Pandits.css";
// import { AuthContext } from "../contexts/AuthContext";

// type Pandit = {
//   id: number;
//   name: string;
//   experience: string;
//   rating: number;
//   reviews: number;
//   specializations: string[];
//   image: string;
// };

// const PanditCard: React.FC<{ pandit: Pandit }> = ({ pandit }) => {
//   const navigate = useNavigate();
//   const { user } = useContext(AuthContext);
//   const isAuthenticated = !!user;

//   // Map Pandit names to their route paths
//   const panditRoutes: Record<string, string> = {
//     "Pandit Ram Sharma": "/ramsharma",
//     "Pandit Suresh Mishra": "/sureshmishra",
//     "Pandit Ramesh Tiwari": "/rameshtiwari",
//     "Pandit Anil Sharma": "/anilsharma",
//     "Pandit Ram Tripathi": "/ramtripathi",
//     "Pandit Mohan Joshi": "/mohanjoshi",
//     "Pandit Bhola Koirala": "/bholakoirala",
//     "Pandit Dinesh Acharya": "/dineshacharya",
//   };

//  const handleBookNow = () => {
//   if (!isAuthenticated) {
//     navigate("/signin");
//     return;
//   }

//   // 1️⃣ Store selected pandit info for BookingForm/backend
//   localStorage.setItem("selectedPanditId", String(pandit.id));
//   localStorage.setItem("selectedPanditName", pandit.name);

//   // 2️⃣ (Optional) you can still go to the pandit detail page **if you like**
//   //    BUT we MUST end up at the booking flow later using the stored ID.
//   const path = panditRoutes[pandit.name];

//   if (path) {
//     // If you want a detail page first, keep this:
//     navigate(path);
//   } else {
//     // If you want to jump directly to the booking/calendar page instead, use:
//     // navigate("/booking"); or navigate("/calendar");
//     navigate("/booking");
//   }
// };

//   const handleCall = () => {
//     if (!isAuthenticated) {
//       navigate("/signin");
//       return;
//     }

//     navigate("/call", { state: { pandit } });
//   };

//   return (
//     <div className="pandit-card">
//       <img src={pandit.image} alt={pandit.name} className="pandit-image" />
//       <div className="pandit-details">
//         <h3 className="pandit-name">{pandit.name}</h3>
//         <p className="pandit-experience">{pandit.experience}</p>
//         <div className="pandit-rating">
//           {"★".repeat(Math.round(pandit.rating))}{" "}
//           <span>
//             {pandit.rating} ({pandit.reviews} reviews)
//           </span>
//         </div>
//         <div className="pandit-specializations">
//           {pandit.specializations.map((spec, index) => (
//             <div key={index} className="specialty-box">
//               <span className="specialty-icon">🕉️</span>
//               {spec}
//             </div>
//           ))}
//         </div>
//         <div className="pandit-footer">
//           <button className="call-btn" onClick={handleCall}>
//             📞 Call
//           </button>
//           <button className="book-btn" onClick={handleBookNow}>
//             Book Now
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Pandits: React.FC = () => {
//   const pandits: Pandit[] = [
//     {
//       id: 1,
//       name: "Pandit Ram Sharma",
//       experience: "10+ years experience",
//       rating: 4.8,
//       reviews: 120,
//       specializations: ["Griha Pravesh", "Satyanarayan Pooja", "Wedding Rituals"],
//       image: "/images/pandit5.png",
//     },
//     {
//       id: 2,
//       name: "Pandit Suresh Mishra",
//       experience: "10+ years experience",
//       rating: 4.6,
//       reviews: 90,
//       specializations: ["Naamkaran", "Vastu Shanti", "Mundan Ceremony"],
//       image: "/images/pandit2.png",
//     },
//     {
//       id: 3,
//       name: "Pandit Ramesh Tiwari",
//       experience: "20+ years experience",
//       rating: 4.9,
//       reviews: 200,
//       specializations: ["Navagraha Pooja", "Marriage", "Annaprashan"],
//       image: "/images/pandit3.png",
//     },
//     {
//       id: 4,
//       name: "Pandit Anil Sharma",
//       experience: "10+ years experience",
//       rating: 4.9,
//       reviews: 200,
//       specializations: ["Navagraha Pooja", "Marriage", "Annaprashan"],
//       image: "/images/pandit4.png",
//     },
//     {
//       id: 5,
//       name: "Pandit Ram Tripathi",
//       experience: "15+ years experience",
//       rating: 4.9,
//       reviews: 200,
//       specializations: ["Navagraha Pooja", "Marriage", "Annaprashan"],
//       image: "/images/pandit5.png",
//     },
//     {
//       id: 6,
//       name: "Pandit Mohan Joshi",
//       experience: "15+ years experience",
//       rating: 4.9,
//       reviews: 200,
//       specializations: ["Navagraha Pooja", "Marriage", "Annaprashan"],
//       image: "/images/pandit3.png",
//     },
//     {
//       id: 7,
//       name: "Pandit Bhola Koirala",
//       experience: "10+ years experience",
//       rating: 4.9,
//       reviews: 200,
//       specializations: ["Navagraha Pooja", "Marriage", "Annaprashan"],
//       image: "/images/pandit3.png",
//     },
//     {
//       id: 8,
//       name: "Pandit Dinesh Acharya",
//       experience: "15+ years experience",
//       rating: 4.9,
//       reviews: 200,
//       specializations: ["Navagraha Pooja", "Marriage", "Annaprashan"],
//       image: "/images/pandit3.png",
//     },
//   ];

//   return (
//     <section className="pandits-section">
//       <h2 className="pandits-title">Our Experienced Pandits</h2>
//       <p className="pandits-subtitle">
//         Book trusted and experienced pandits for your rituals
//       </p>
//       <div className="pandits-grid">
//         {pandits.map((p) => (
//           <PanditCard key={p.id} pandit={p} />
//         ))}
//       </div>
//       <div className="browse-pandits-section">
//         <p className="browse-text">
//           Looking for a specific type of ceremony or location?
//         </p>
//         <button className="browse-btn">Browse All Pandits</button>
//       </div>
//     </section>
//   );
// };

// export default Pandits;
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
    localStorage.setItem("selectedPanditId", String(pandit.id));
    localStorage.setItem(
      "selectedPanditName",
      pandit.full_name || pandit.username
    );

    // go straight to booking flow or a detail page
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
