import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sureshmishra.css";
import PanditCalendar from "./Panditcalendar";

const Sureshmishra: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const navigate = useNavigate();

  const bookedDates = {
    "2025-02-15": true,
    "2025-02-20": true,
    "2025-02-25": true,
    "2025-03-05": true,
    "2025-03-12": true,
  };

  const handleSelect = () => {
    if (!selectedDate) {
      alert("Please select a date first!");
      return;
    }

    navigate("/booking", {
      state: {
        panditName: "Suresh Mishra",
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
            <h2>Suresh Mishra</h2>
            <p>
              Specialist in Annaprashan, Janai Purnima, and Rishi Panchami ceremonies for Nepali families | 10 years experience.
            </p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="about-section content-align">
        <h3>About</h3>
        <p>
          Pandit Suresh Mishra has a decade of experience performing Nepali rituals like Annaprashan, Janai Purnima, and Rishi Panchami, ensuring every ceremony is done with devotion and accuracy.
        </p>
      </div>

      {/* Availability Section */}
      <div className="availability-section content-align">
        <h3>Availability</h3>
        <div className="calendar-container">
          <PanditCalendar
            panditName="Suresh Mishra"
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

export default Sureshmishra;
