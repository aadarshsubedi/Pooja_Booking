// src/pages/Rameshtiwari.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Rameshtiwari.css";
import PanditCalendar from "./Panditcalendar";

const Rameshtiwari: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const navigate = useNavigate();

  const bookedDates: Record<string, boolean> = {
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

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="pandit-page">

      {/* PROFILE CARD */}
      <div className="profile-card">
        <div className="profile-pic"></div>

        <div className="profile-info">
          <h3 className="profile-name">Anil Sharma</h3>
          <p className="profile-text">
            Experienced Vedic Pandit delivering sacred rituals with devotion and authenticity. |
            10 years of experience.
          </p>
        </div>
      </div>

      {/* ABOUT */}
      <div className="card">
        <h3>About</h3>
        <p>
          Pandit Ramesh Tiwari specializes in traditional Nepali rituals such as
          Graha Shanti, Rudri Puja, and Satyanarayan Pooja. With over two decades
          of experience, he is known for performing ceremonies with devotion,
          clarity, and adherence to authentic Vedic procedures.
        </p>
      </div>

      {/* AVAILABILITY */}
      <div className="card">
        <h3>Availability</h3>
        <div className="calendar-container">
          <PanditCalendar
            panditName="Ramesh Tiwari"
            bookedDates={bookedDates}
            onDateSelect={(date) => setSelectedDate(date)}
          />
        </div>

        {selectedDate && (
          <p className="selected-date">
            Selected date: <strong>{selectedDate}</strong>
          </p>
        )}
      </div>

      {/* BUTTONS */}
      <div className="buttons">
        <button className="btn back" onClick={handleBack}>
          Back
        </button>
        <button className="btn next" onClick={handleSelect}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Rameshtiwari;
