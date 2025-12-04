import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Mohanjoshi.css";
import PanditCalendar from "./Panditcalendar";

const Mohanjoshi: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const navigate = useNavigate();

  const bookedDates = {
    "2025-02-10": true,
    "2025-02-14": true,
    "2025-02-23": true,
    "2025-03-05": true,
    "2025-03-15": true,
  };

  const handleSelect = () => {
    if (!selectedDate) {
      alert("Please select a date first!");
      return;
    }

    navigate("/booking", {
      state: {
        panditName: "Mohan Joshi",
        date: selectedDate,
      },
    });
  };

  return (
    <div className="page-container">

      {/* Profile Card */}
      <div className="card-wrapper">
        <div className="profile-card-horizontal">
          <div className="avatar-circle"></div>
          <div className="profile-text">
            <h2>Mohan Joshi</h2>
            <p>
              Expert in Satyanarayan Pooja, Janai Purnima, and Kul Puja for Nepali households | 15 years of experience.
            </p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="about-section content-align">
        <h3>About</h3>
        <p>
          Pandit Mohan Joshi performs Satyanarayan Pooja, Janai Purnima, and Kul Puja with complete devotion, following traditional Nepali Vedic procedures to ensure a spiritually fulfilling ceremony.
        </p>
      </div>

      {/* Availability Section */}
      <div className="availability-section content-align">
        <h3>Availability</h3>
        <div className="calendar-container">
          <PanditCalendar
            panditName="Mohan Joshi"
            bookedDates={bookedDates}
            onDateSelect={(date) => setSelectedDate(date)}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="form-buttons content-align">
        <button className="back" onClick={() => navigate(-1)}>Back</button>
        <button className="next" onClick={handleSelect}>Next</button>
      </div>

    </div>
  );
};

export default Mohanjoshi;
