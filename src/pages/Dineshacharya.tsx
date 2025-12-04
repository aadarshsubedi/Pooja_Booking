import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dineshacharya.css";
import PanditCalendar from "./Panditcalendar"; 

const Dineshacharya: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const navigate = useNavigate();

  const bookedDatesForDinesh: { [date: string]: boolean } = {
    "2025-11-03": true,
    "2025-11-07": true,
    "2025-11-10": true,
    "2025-11-12": true,
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
        panditName: "Dinesh Acharya",
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
            <h2>Dinesh Acharya</h2>
            <p>
              Specialist in Wedding Ceremonies, Rudri Puja, and Graha Shanti | 16 years experience.
            </p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="about-section content-align">
        <h3>About</h3>
        <p>
          Pandit Dinesh Acharya has been performing traditional Nepali rituals such as weddings, Rudri Puja, and Graha Shanti for 16 years while maintaining accuracy and sanctity.
        </p>
      </div>

      {/* Availability Section */}
      <div className="availability-section content-align">
        <h3>Availability</h3>
        <div className="calendar-container">
          <PanditCalendar
            panditName="Dinesh Acharya"
            bookedDates={bookedDatesForDinesh}
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

export default Dineshacharya;
