import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Bholakoirala.css";
import PanditCalendar from "./Panditcalendar";

const Bholakoirala: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const navigate = useNavigate();

  const bookedDates = {
    "2025-11-03": true,
    "2025-11-07": true,
    "2025-11-12": true,
    "2025-11-15": true,
    "2025-11-20": true,
  };

  const handleSelect = () => {
    if (!selectedDate) {
      alert("Please select a date first!");
      return;
    }

    navigate("/booking", {
      state: {
        panditName: "Bhola Koirala",
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
            <h2>Bhola Koirala</h2>
            <p>
              Experienced in Griha Pravesh, Bratabandha, and Annaprashan ceremonies | 14 years of experience.
            </p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="about-section content-align">
        <h3>About</h3>
        <p>
          Pandit Bhola Koirala brings 14 years of experience in conducting Nepali rituals including Griha Pravesh, Bratabandha, and Annaprashan, ensuring each ceremony is auspicious and smooth.
        </p>
      </div>

      {/* Availability Section */}
      <div className="availability-section content-align">
        <h3>Availability</h3>
        <div className="calendar-container">
          <PanditCalendar
            panditName="Bhola Koirala"
            bookedDates={bookedDates}
            onDateSelect={(date) => setSelectedDate(date)}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="form-buttons content-align">
        <button className="back">Back</button>
        <button className="next" onClick={handleSelect}>Next</button>
      </div>

    </div>
  );
};

export default Bholakoirala;
