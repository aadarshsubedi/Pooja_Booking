import { useEffect, useState } from "react";
import { fetchPanditEarnings } from "../../../api/Api";
import "./PanditPages.css";

const Earnings = () => {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchPanditEarnings().then(d => setTotal(d.total_earnings));
  }, []);

  return (
    <div className="pandit-page earnings-page">
      <h2 className="page-title">Earnings</h2>

      <div className="earnings-container">
        <div className="earnings-card">
          <span className="earnings-label">Total Earnings</span>
          <h1 className="earnings-amount">Rs. {total}</h1>
          <p className="earnings-subtext">
            Total earnings from completed bookings
          </p>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
