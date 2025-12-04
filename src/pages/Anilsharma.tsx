import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Anilsharma.css";
import PanditCalendar from "./Panditcalendar";

const Anilsharma: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const navigate = useNavigate();

  const panditName = "Anil Sharma"; // Use variable to avoid copy-paste errors

  // Booked dates for Anil Sharma
  const bookedDates = {
    "2025-11-04": true,
    "2025-11-09": true,
    "2025-11-13": true,
    "2025-11-18": true,
    "2025-11-22": true,
  };

  const handleSelect = () => {
    if (!selectedDate) {
      alert("Please select a date first!");
      return;
    }

    navigate("/booking", {
      state: {
        panditName,
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
            <h2>{panditName}</h2>
            <p>
              Specialist in Wedding Ceremonies, Rudri Puja, and Graha Shanti |
              16 years experience.
            </p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="about-section content-align">
        <h3>About</h3>
        <p>
          Pandit {panditName} performs Nepali rituals like Ghatasthapana,
          traditional weddings, and Bratabandha with devotion and strict
          adherence to tradition.
        </p>
      </div>

      {/* Availability Section */}
      <div className="availability-section content-align">
        <h3>Availability</h3>
        <div className="calendar-container">
          <PanditCalendar
            panditName={panditName}
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

export default Anilsharma;
