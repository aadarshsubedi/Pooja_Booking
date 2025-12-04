import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Ramsharma.css";
import PanditCalendar from "./Panditcalendar";

const Ramsharma: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const navigate = useNavigate();

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
    <div className="page-container">

      {/* Profile Card */}
      <div className="card-wrapper">
        <div className="profile-card-horizontal">
          <div className="avatar-circle"></div>
          <div className="profile-text">
            <h2>Ram Sharma</h2>
            <p>
              Expert in Graha Shanti, Rudri Puja, and Satyanarayan Pooja for Nepali households | 10 years of experience.
            </p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="about-section content-align">
        <h3>About</h3>
        <p>
          Pandit Ram Sharma performs Graha Shanti, Rudri Puja, and Satyanarayan Pooja with devotion, following traditional Vedic procedures to ensure spiritually fulfilling ceremonies.
        </p>
      </div>

      {/* Availability Section */}
      <div className="availability-section content-align">
        <h3>Availability</h3>
        <div className="calendar-container">
          <PanditCalendar
            panditName="Ram Sharma"
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

export default Ramsharma;
