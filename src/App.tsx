import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/footer";

import Home from "./pages/home";
import Poojas from "./pages/Poojas";
import Pandits from "./pages/Pandits";
import AboutUs from "./pages/Aboutus";

import Ramsharma from "./pages/Ramsharma";
import Sureshmishra from "./pages/Sureshmishra";
import Rameshtiwari from "./pages/Rameshtiwari";
import Anilsharma from "./pages/Anilsharma";
import Ramtripathi from "./pages/Ramtripathi";
import Mohanjoshi from "./pages/Mohanjoshi";
import Bholakoirala from "./pages/Bholakoirala";
import Dineshacharya from "./pages/Dineshacharya";

import BookingForm from "./pages/Bookingform";
import PaymentPage from "./pages/Paymentpage";

import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import CallPage from "./pages/callpage";
import MessageInterface from "./pages/messageinterface";
import ScrollToTop from "./utils/scrolltotop";

import "./App.css";

const App: React.FC = () => {
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          localStorage.setItem("lat", String(pos.coords.latitude));
          localStorage.setItem("lng", String(pos.coords.longitude));
          setLocationAllowed(true);
        },
        () => setError("Please allow location access to continue.")
      );
    } else {
      setError("Your browser does not support location.");
    }
  }, []);

  if (!locationAllowed) {
    return (
      <div className="location-loader">
        <div className="loader"></div>
        <h2>📍 Getting your location…</h2>
        <p>Please allow location access.</p>
        {error && <p className="error-text">{error}</p>}
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />

          <Route path="/home" element={<Home />} />
          <Route path="/poojas" element={<Poojas />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/pandits" element={<Pandits />} />
          <Route path="/ramsharma" element={<Ramsharma />} />
          <Route path="/sureshmishra" element={<Sureshmishra />} />
          <Route path="/rameshtiwari" element={<Rameshtiwari />} />
          <Route path="/anilsharma" element={<Anilsharma />} />
          <Route path="/ramtripathi" element={<Ramtripathi />} />
          <Route path="/mohanjoshi" element={<Mohanjoshi />} />
          <Route path="/bholakoirala" element={<Bholakoirala />} />
          <Route path="/dineshacharya" element={<Dineshacharya />} />

          {/* Booking + Payment */}
          <Route path="/booking" element={<BookingForm />} />
          <Route path="/payment" element={<PaymentPage />} />

          {/* Auth */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />

          {/* Call & Message */}
          <Route path="/call" element={<CallPage />} />
          <Route
            path="/message"
            element={<MessageInterface onBack={() => window.history.back()} />}
          />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
};

export default App;
