import React from "react";
import "./Poojas.css";
import { useNavigate } from "react-router-dom";

type Service = {
  id: number;
  category: string;
  title: string;
  description: string;
  duration: string;
  bookings: string;
  // rating: number;
  // reviews: number;
};

const services: Service[] = [
  {
    id: 1,
    category: "Home Ceremonies",
    title: "Griha Pravesh Pooja",
    description:
      "Sacred ceremony for entering a new home, bringing peace and prosperity to your family.",
    duration: "2-3 hours",
    bookings: "",
    // rating: 4.8,
    // reviews: 245,
  },
  {
    id: 2,
    category: "Marriage",
    title: "Wedding Ceremony",
    description:
      "Complete Hindu wedding rituals performed by experienced pandits with authentic traditions.",
    duration: "4-6 hours",
    bookings: "",
    // rating: 4.9,
    // reviews: 156,
  },
  {
    id: 3,
    category: "Death Rites",
    title: "Shraddha (श्राद्ध)",
    description:
      "Shraddha Pooja is a deeply significant ritual in Nepali and Hindu tradition, performed to honor ancestors.",
    duration: "1-3 hours",
    bookings: "",
    // rating: 4.9,
    // reviews: 156,
  },
  {
    id: 4,
    category: "Festival Pooja",
    title: "Ghatasthapana (घटस्थापना)",
    description:
      "Ritual to invoke divine energy at the start of Navratri, symbolizing the goddess residing in the household.",
    duration: "1–2 hours",
    bookings: "",
    // rating: 4.9,
    // reviews: 156,
  },
  {
    id: 5,
    category: "Religious Pooja",
    title: "Satyanarayan Puja (सत्यनारायण पूजा)",
    description:
      "Auspicious ritual for devotees of Lord Vishnu, performed during festivals or special occasions.",
    duration: "1.5–2 hours",
    bookings: "",
    // rating: 4.9,
    // reviews: 156,
  },
  {
    id: 6,
    category: "Life-cycle ritual",
    title: "Annaprashan (Rice Feeding Ceremony)",
    description:
      "First rice feeding ceremony for infants, performed with prayers and blessings.",
    duration: "1–1.5 hours",
    bookings: "",
    // rating: 4.9,
    // reviews: 156,
  },
  {
    id: 7,
    category: "Life-cycle initiation",
    title: "Bratabandha",
    description:
      "Sacred thread ceremony initiating boys into Vedic studies with rituals and blessings.",
    duration: "2–3 hours",
    bookings: "",
    // rating: 4.9,
    // reviews: 156,
  },
  {
    id: 8,
    category: "Life-cycle festival",
    title: "Janai Purnima",
    description:
      "Festival where men renew their sacred thread, performed with prayers and blessings.",
    duration: "1–2 hours",
    bookings: "",
    // rating: 4.9,
    // reviews: 156,
  },
  {
    id: 9,
    category: "Religious observance",
    title: "Rishi Panchami (ऋषि पंचमी)",
    description:
      "Festival honoring the seven sages, observed with prayers, fasting, and purification.",
    duration: "4–6 hours",
    bookings: "",
    // rating: 4.9,
    // reviews: 156,
  },
  {
    id: 10,
    category: "Astrological ritual",
    title: "Graha Shanti Puja",
    description:
      "Performed to appease planetary deities (Navagrahas) and reduce negative effects.",
    duration: "2–3 hours",
    bookings: "",
    // rating: 4.9,
    // reviews: 156,
  },
  {
    id: 11,
    category: "Vedic ritual",
    title: "Rudri Puja",
    description:
      "Powerful Vedic ritual popular among Brahmin and Chhetri communities.",
    duration: "3–6 hours",
    bookings: "",
    // rating: 4.9,
    // reviews: 156,
  },
  {
    id: 12,
    category: "Ancestral ritual",
    title: "Kul Puja",
    description:
      "Important ritual for Hindu households, especially Brahmin and Chhetri communities.",
    duration: "2–3 hours",
    bookings: "",
    // rating: 4.9,
    // reviews: 156,
  },
];

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    const isSignedUp = localStorage.getItem("isSignedUp") === "true";
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (isLoggedIn) {
      navigate("/pandits"); // already signed up and logged in
    } else if (isSignedUp) {
      navigate("/signin"); // signed up but not logged in
    } else {
      navigate("/signup"); // not signed up
    }
  };

  return (
    <div className="service-card">
      <span className="service-category">{service.category}</span>

      <h3 className="service-title">{service.title}</h3>
      <p className="service-description">{service.description}</p>

      <div className="service-meta">
        <span>⏰ {service.duration}</span>
        <span>👥 {service.bookings}</span>
      </div>

      <div className="service-rating">
        {"★".repeat(5)}{" "}
        {/* <span>
          {service.rating} ({service.reviews} reviews)
        </span> */}
      </div>

      <div className="service-footer">
        <button className="service-button" onClick={handleBookNow}>
          Book Now
        </button>
      </div>
    </div>
  );
};

const Poojas: React.FC = () => {
  return (
    <section className="services-section">
      <div className="services-header">
        <h2>Our Sacred Services</h2>
        <p>
          From intimate home poojas to grand celebrations, find the perfect
          spiritual service performed by our verified and experienced pandits.
        </p>
      </div>

      <div className="services-container">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
};

export default Poojas;
