// Ramsharma.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Ramsharma.css";
import PanditCalendar from "./Panditcalendar";

const Ramsharma: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const navigate = useNavigate();

  // DIFFERENT BOOKED DATES FOR RAM SHARMA
  const bookedDates = {
    "2025-02-08": true,
    "2025-02-16": true,
    "2025-02-21": true,
    "2025-03-04": true,
    "2025-03-11": true,
  };

  const handleSelect = () => {
    if (!selectedDate) {
      alert("Please select a date first!");
      return;
    }

    navigate("/booking", {
      state: {
        panditName: "Ram Sharma",
        date: selectedDate,
      },
    });
  };

  return (
    <div className="profile-section">
      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-pic" />
        <div className="profile-info">
          <h2>Ram Sharma</h2>
          <p>
            Experienced Vedic Pandit delivering sacred rituals with devotion and authenticity | 10 years of experience.
          </p>
        </div>
      </div>

      {/* About Section */}
      <div className="about-section">
        <h3>About</h3>
        <p>
          Pandit Ram Sharma is a dedicated priest known for performing traditional Hindu rituals with accuracy and devotion. He has guided families through important ceremonies for over a decade.
        </p>
      </div>

      {/* Availability Section */}
      <div className="availability-section">
        <h3>Availability</h3>
        <div className="calendar-container">
          <PanditCalendar
            panditName="Ram Sharma"
            bookedDates={bookedDates}      // 📌 UNIQUE BOOKED DATES FOR THIS PANDIT
            onDateSelect={(date) => setSelectedDate(date)}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="form-buttons">
        <button className="back">Back</button>
        <button className="next" onClick={handleSelect}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Ramsharma;