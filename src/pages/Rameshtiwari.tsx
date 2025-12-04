import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Rameshtiwari.css";
import PanditCalendar from "./Panditcalendar";

const Rameshtiwari: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const navigate = useNavigate();

  const bookedDates = {
    "2025-02-09": true,
    "2025-02-18": true,
    "2025-02-26": true,
    "2025-03-02": true,
    "2025-03-12": true,
  };

  const handleSelect = () => {
    if (!selectedDate) {
      alert("Please select a date first!");
      return;
    }

    navigate("/booking", {
      state: {
        panditName: "Ramesh Tiwari",
        date: selectedDate,
      },
    });
  };

  return (
    <div className="page-container">

      {/* PROFILE CARD */}
      <div className="card-wrapper">
        <div className="profile-card-horizontal">
          <div className="avatar-circle"></div>
          <div className="profile-text">
            <h2>Ramesh Tiwari</h2>
            <p>
              Experienced Vedic Pandit delivering sacred rituals with devotion and authenticity. | 10 years of experience.
            </p>
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <div className="about-section content-align">
        <h3>About</h3>
        <p>
          Pandit Ramesh Tiwari specializes in traditional Nepali rituals such as Graha Shanti, Rudri Puja, and Satyanarayan Pooja. 
          With over two decades of experience, he is known for performing ceremonies with devotion, clarity, and adherence to authentic Vedic procedures.
        </p>
      </div>

      {/* AVAILABILITY */}
      <div className="availability-section content-align">
        <h3>Availability</h3>
        <div className="calendar-container">
          <PanditCalendar
            panditName="Ramesh Tiwari"
            bookedDates={bookedDates}
            onDateSelect={(date) => setSelectedDate(date)}
          />
        </div>
      </div>

      {/* BUTTONS */}
      <div className="form-buttons content-align">
        <button className="back" onClick={() => navigate(-1)}>Back</button>
        <button className="next" onClick={handleSelect}>Next</button>
      </div>

    </div>
  );
};

export default Rameshtiwari;
