import "./PanditPages.css";
import React, { useEffect, useState } from "react";
import { fetchPanditSummary } from "../../../api/Api";

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetchPanditSummary()
      .then(setData)
      .catch((e) => setErr(e.message));
  }, []);

  if (err) return <p>{err}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div className="pandit-dashboard">
      <h2 className="dashboard-title">
        🙏 Welcome, {data.pandit_username}
      </h2>

      {/* CARD GRID */}
      <div className="dashboard-cards">

        {/* ROW 1 */}
        <div className="stat-card card">
          <div className="stat-icon">📅</div>
          <div>
            <p className="stat-label">Upcoming</p>
            <h2>{data.upcoming}</h2>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon">⏳</div>
          <div>
            <p className="stat-label">Pending</p>
            <h2>{data.pending}</h2>
          </div>
        </div>

        {/* ROW 2 */}
        <div className="stat-card card">
          <div className="stat-icon">✅</div>
          <div>
            <p className="stat-label">Confirmed</p>
            <h2>{data.confirmed}</h2>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon">✔️</div>
          <div>
            <p className="stat-label">Completed</p>
            <h2>{data.completed}</h2>
          </div>
        </div>

        {/* ROW 3 */}
        <div className="stat-card card">
          <div className="stat-icon">❌</div>
          <div>
            <p className="stat-label">Cancelled</p>
            <h2>{data.cancelled}</h2>
          </div>
        </div>

        <div className="stat-card card earnings-card">
          <div className="stat-icon">💰</div>
          <div>
            <p className="stat-label">Total Earnings</p>
            <h2>Rs. {data.earnings}</h2>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
