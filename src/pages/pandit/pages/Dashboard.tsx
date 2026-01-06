// src/pages/pandit/pages/Dashboard.tsx
import "./PanditPages.css";
import StatCard from "../components/StatCard";

const Dashboard = () => {
  return (
    <div className="pandit-dashboard">

      {/* ⚠️ APPROVAL WARNING */}
      <div className="approval-banner">
        ⚠️ Your profile is pending approval. You will appear after admin approves.
      </div>

      {/* 📊 STATS */}
      <div className="stats-row">
        <StatCard title="Pending Requests" value="3" color="yellow" />
        <StatCard title="Today's Bookings" value="2" color="blue" />
        <StatCard title="Upcoming (7 Days)" value="5" color="green" />
        <StatCard title="Earnings This Month" value="Rs. 12,500" color="purple" />
      </div>

      {/* MAIN GRID */}
      <div className="dashboard-grid">

        {/* LEFT COLUMN */}
        <div className="left-column">

          {/* BOOKING REQUESTS */}
          <div className="card booking-requests">
            <div className="card-header">
              <h3>Booking Requests</h3>
              <span>3 pending</span>
            </div>

            {["Griha Pravesh", "Satyanarayan Pooja", "Rudra Abhishek"].map(
              (pooja, i) => (
                <div className="booking-row" key={i}>
                  <div>
                    <h4>{pooja}</h4>
                    <p>May 15, 2024 | 10:00 AM – 12:00 PM</p>
                    <p>Kathmandu, Nepal</p>
                    <strong>Rs. 2,500</strong>
                  </div>

                  <div className="actions">
                    <button className="accept">Accept</button>
                    <button className="reject">Reject</button>
                    <button className="message">Message</button>
                    <button className="call">Call</button>
                  </div>
                </div>
              )
            )}
          </div>

          {/* TODAY SCHEDULE */}
          <div className="card today-schedule">
            <h3>Today’s Schedule</h3>

            <div className="schedule-row">
              <span>08:00 – 10:00</span>
              <span>Satyanarayan Pooja</span>
              <span className="status confirmed">Confirmed</span>
            </div>

            <div className="schedule-row">
              <span>01:00 – 03:00</span>
              <span>Free Slot</span>
              <span className="status available">Available</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="right-column">

          {/* CALENDAR */}
          <div className="card calendar">
            <h3>Availability</h3>
            <div className="calendar-box">
              📅 May 2024 (static UI)
            </div>
            <button className="block-date">+ Block a Date</button>
          </div>

          {/* ANNOUNCEMENTS */}
          <div className="card announcements">
            <h3>Announcements</h3>
            <ul>
              <li>🔔 Tips for Conducting Pujas</li>
              <li>⚠️ Update your profile</li>
              <li>📅 Holiday Notice: May 25</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
