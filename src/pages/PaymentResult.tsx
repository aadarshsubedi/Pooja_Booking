import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./PaymentPage.css";

const PaymentResult: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const status = params.get("status"); // success / failed
  const bookingId = params.get("booking_id");
  const method = params.get("method");

  return (
    <div className="payment-wrapper">
      <h2 className="payment-title">
        {status === "success" ? "✅ Payment Successful" : "❌ Payment Failed"}
      </h2>

      <div className="payment-box">
        <div className="payment-right" style={{ width: "100%" }}>
          <p><b>Method:</b> {method || "-"}</p>
          <p><b>Booking:</b> {bookingId ? `#${bookingId}` : "-"}</p>

          <button className="pay-now-btn" onClick={() => navigate("/home")}>
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;
