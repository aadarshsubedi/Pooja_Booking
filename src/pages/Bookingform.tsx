import React, { useState, useEffect, useContext,type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./BookingForm.css";
import { createBooking } from "../api/Api";
import { AuthContext } from "../contexts/AuthContext";

interface LocationState {
  date?: string;
}

const BookingForm: React.FC = () => {
  const navigate = useNavigate();
  const locationHook = useLocation();
  const { isAuthenticated } = useContext(AuthContext);

  const state = (locationHook.state || {}) as LocationState;
  const selectedDateFromCalendar = state.date || "";

  // 👇 Read pandit info from localStorage (set in Pandits.tsx)
  const storedPanditId = localStorage.getItem("selectedPanditId");
  const storedPanditName = localStorage.getItem("selectedPanditName");

  const panditId = storedPanditId ? parseInt(storedPanditId, 10) : undefined;

  const [poojaType, setPoojaType] = useState("");
  const [date, setDate] = useState(selectedDateFromCalendar);
  const [selectedTime, setSelectedTime] = useState("");
  const [location, setLocation] = useState("Detecting your location...");

  useEffect(() => {
    const detectedLocation = localStorage.getItem("detectedLocation");
    if (detectedLocation) {
      setLocation(detectedLocation);
    } else {
      setLocation("");
    }
  }, []);

  // For debugging: see what we actually have
  console.log("BookingForm debug:", {
    stateFromRouter: state,
    storedPanditId,
    storedPanditName,
  });

  const mapSlotToTime = (slot: string): string => {
    switch (slot) {
      case "Morning 6-8 AM":
        return "06:00:00";
      case "Afternoon 1-3 PM":
        return "13:00:00";
      case "Evening 5-7 PM":
        return "17:00:00";
      default:
        return "00:00:00";
    }
  };

  const handleNext = async (e?: FormEvent) => {
    if (e) e.preventDefault();

    if (!poojaType) {
      alert("Please select a pooja type");
      return;
    }
    if (!selectedTime) {
      alert("Please select a time slot");
      return;
    }
    if (!date) {
      alert("Booking date is missing.");
      return;
    }
    if (!isAuthenticated) {
      alert("Please sign in before booking.");
      navigate("/signin");
      return;
    }

    // ✅ Only require panditId now
    if (!panditId) {
      alert("Something went wrong: pandit information is missing.");
      console.log("Debug - panditId is missing. storedPanditId:", storedPanditId);
      return;
    }

    const backendTime = mapSlotToTime(selectedTime);

     try {
    const booking = await createBooking({
      pandit: panditId,
      pooja: null, // 👈 tell backend that pooja relation is empty
      date,
      time: backendTime,
      location,
      notes: `Pooja type: ${poojaType}, Slot: ${selectedTime}, Pandit: ${
        storedPanditName || ""
      }`,
      // price: priceFromStorage, // add if needed
    });

      console.log("Booking created:", booking);

      navigate("/payment", {
        state: {
          bookingId: booking.id,
          poojaType,
          date,
          selectedTime,
          location,
          price: booking.price,
        },
      });
    } catch (err: any) {
      alert(err?.message || "Failed to create booking. Please try again.");
    }
  };

  return (
    <div className="booking-form">
      {/* Pooja Type */}
      <div className="form-section">
        <label>Select Pooja Type</label>
        <select value={poojaType} onChange={(e) => setPoojaType(e.target.value)}>
          <option value="">Select Type</option>
          <option value="Griha Pravesh Pooja">Griha Pravesh Pooja</option>
          <option value="Wedding Ceremony">Wedding Ceremony</option>
          <option value="Shraddha (श्राद्ध)">Shraddha</option>
          <option value="Ghatasthapana (घटस्थापना)">Ghatasthapana</option>
          <option value="Satyanarayan Puja (सत्यनारायण पूजा)">Satyanarayan Puja</option>
          <option value="Annaprashan (Rice Feeding Ceremony)">Annaprashan</option>
          <option value="Bratabandha">Bratabandha</option>
          <option value="Janai Purnima">Janai Purnima</option>
          <option value="Rishi Panchami (ऋषि पंचमी)">Rishi Panchami</option>
          <option value="Graha Shanti Puja">Graha Shanti Puja</option>
          <option value="Rudri Puja">Rudri Puja</option>
          <option value="Kul Puja">Kul Puja</option>
        </select>
      </div>

      {/* Selected Date */}
      <div className="form-section date-section">
        <label>📅 Selected Date</label>
        <input type="text" value={date} readOnly />
      </div>

      {/* Time Slots */}
      <div className="form-section">
        <label>🕒 Select Time Slot</label>
        <div className="time-slots">
          {["Morning 6-8 AM", "Afternoon 1-3 PM", "Evening 5-7 PM"].map((slot) => (
            <button
              key={slot}
              type="button"
              className={selectedTime === slot ? "selected" : ""}
              onClick={() => setSelectedTime(slot)}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="form-section">
        <label>📍 Location</label>
        <input type="text" value={location} readOnly />
      </div>

      {/* Confirm & Pay */}
      <div className="form-section">
        <button className="confirm-pay" onClick={handleNext}>
          Confirm & Pay
        </button>
      </div>
    </div>
  );
};

export default BookingForm;
