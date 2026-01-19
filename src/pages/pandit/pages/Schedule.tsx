import "./PanditPages.css";

const Schedule = () => {
  return (
    <div className="pandit-page schedule-page">
      <h2 className="page-title">Schedule</h2>

      <div className="schedule-container">
        <div className="schedule-card">
          <h3>Availability Calendar</h3>
          <div className="calendar-placeholder">
            📅 Calendar goes here
          </div>

          <button className="block-date-btn">+ Block a Date</button>
        </div>

        <div className="schedule-card">
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
    </div>
  );
};

export default Schedule;
