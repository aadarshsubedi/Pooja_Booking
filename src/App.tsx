import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

/* ================= USER LAYOUT ================= */
import Navbar from "./components/Navbar";
import Footer from "./components/footer";

/* ================= USER PAGES ================= */
import Home from "./pages/home";
import Poojas from "./pages/Poojas";
import Pandits from "./pages/Pandits";
import AboutUs from "./pages/Aboutus";

import BookingForm from "./pages/Bookingform";
import PaymentPage from "./pages/Paymentpage";

import Signup from "./pages/Signup";
import Signin from "./pages/Signin";

import Userprofile from "./pages/Userprofile";
import Editprofile from "./pages/Editprofile";
import Changepassword from "./pages/Changepassword";
import Mylocation from "./pages/Mylocation";
import Bookmarks from "./pages/Bookmarks";

import CallPage from "./pages/callpage";
import MessageInterface from "./pages/messageinterface";

/* ================= PANDIT ================= */
import PanditLayout from "./pages/pandit/layout/PanditLayout";

import Dashboard from "./pages/pandit/pages/Dashboard";
import Bookings from "./pages/pandit/pages/Bookings";
import Schedule from "./pages/pandit/pages/Schedule";
import Earnings from "./pages/pandit/pages/Earnings";
import Profile from "./pages/pandit/pages/Profile";
import PanditVerification from "./pages/pandit/PanditVerification";

/* ================= UTILS ================= */
import ScrollToTop from "./utils/scrolltotop";
import "./App.css";

/* ================= CONTENT ================= */

const AppContent: React.FC = () => {
  const location = useLocation();

  // 🔒 Hide USER navbar/footer for ALL pandit routes
  const isPanditRoute = location.pathname.startsWith("/pandit");

  return (
    <>
      <ScrollToTop />

      {/* USER NAVBAR */}
      {!isPanditRoute && <Navbar />}

      <main>
        <Routes>
          {/* ================= DEFAULT ================= */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* ================= USER ================= */}
          <Route path="/home" element={<Home />} />
          <Route path="/poojas" element={<Poojas />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/pandits" element={<Pandits />} />

          <Route path="/booking" element={<BookingForm />} />
          <Route path="/payment" element={<PaymentPage />} />

          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />

          <Route path="/userprofile" element={<Userprofile />} />
          <Route path="/edit-profile" element={<Editprofile />} />
          <Route path="/change-password" element={<Changepassword />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/my-location" element={<Mylocation />} />
          <Route path="pandit-verification" element={<PanditVerification />} />

          <Route path="/call" element={<CallPage />} />
          <Route
            path="/message"
            element={<MessageInterface onBack={() => window.history.back()} />}
          />

          {/* ================= PANDIT (ISOLATED APP) ================= */}
          <Route path="/pandit" element={<PanditLayout />}>
            
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="earnings" element={<Earnings />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>

      {/* USER FOOTER */}
      {!isPanditRoute && <Footer />}
    </>
  );
};

/* ================= ROOT ================= */

const App: React.FC = () => {
  const [locationAllowed, setLocationAllowed] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          localStorage.setItem("lat", String(pos.coords.latitude));
          localStorage.setItem("lng", String(pos.coords.longitude));
          setLocationAllowed(true);
        },
        () => setLocationAllowed(true)
      );
    } else {
      setLocationAllowed(true);
    }
  }, []);

  if (!locationAllowed) {
    return (
      <div className="location-loader">
        <div className="loader"></div>
        <h2>📍 Getting your location…</h2>
        <p>Please allow location access.</p>
      </div>
    );
  }

  return <AppContent />;
};

export default App;
