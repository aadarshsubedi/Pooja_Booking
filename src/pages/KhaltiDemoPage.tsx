import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { khaltiDemoConfirm } from "../api/Api";
import "./KhaltiDemoPage.css";

type LocationState = { bookingId: number; amount: number };

const KhaltiDemoPage: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const data = (state || {}) as LocationState;

  const [loading, setLoading] = useState(false);

  const finish = async (status: "paid" | "failed") => {
    try {
      setLoading(true);
      await khaltiDemoConfirm(data.bookingId, status);
      navigate(`/payment-result?status=${status === "paid" ? "success" : "failed"}&booking_id=${data.bookingId}`);
    } catch (e: any) {
      alert(e?.message || "Failed to confirm demo payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="khalti-demo-wrap">
      <div className="khalti-card">
        <h2>Khalti Demo Payment</h2>
        <p>This is a demo payment for your project (no real money).</p>

        <div className="row"><span>Booking</span><b>#{data.bookingId}</b></div>
        <div className="row"><span>Amount</span><b>Rs. {data.amount}</b></div>

        <button disabled={loading} className="btn success" onClick={() => finish("paid")}>
          ✅ Pay Success
        </button>
        <button disabled={loading} className="btn fail" onClick={() => finish("failed")}>
          ❌ Pay Failed
        </button>
      </div>
    </div>
  );
};

export default KhaltiDemoPage;
