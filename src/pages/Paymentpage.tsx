import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentPage.css";
import { payBooking } from "../api/Api";

interface LocationState {
  pooja?: string;
  amount?: number;
  bookingId?: number;
}

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [amount] = useState<number>(state?.amount || 1100);
  const [paymentId, setPaymentId] = useState("");

const handlePayNow = async () => {
  if (!paymentId) {
    alert("Please enter your eSewa/Khalti ID");
    return;
  }

  if (!state?.bookingId) {
    alert("Booking ID missing. Please book again.");
    navigate("/pandits");
    return;
  }

  try {
    const result = await payBooking(state.bookingId, {
      method: "demo", // or "khalti" / "esewa"
      payer_id: paymentId,
      amount: amount,
    });

    alert(`✅ ${result.message}`);
    navigate("/home");
  } catch (err: any) {
    alert(err?.message || "Payment failed");
  }
};

  return (
    <div className="payment-wrapper">
      <h2 className="payment-title">Payment Confirmation</h2>

      <div className="payment-box">

        {/* LEFT SIDE */}
        <div className="payment-left">
          <h3 className="section-heading">Customer Details</h3>
          <input className="input-field" type="text" placeholder="Name" />
          <input className="input-field" type="text" placeholder="Phone" />
          <input className="input-field" type="email" placeholder="Email" />

          <h3 className="section-heading">Payment Gateways</h3>
          <button className="pay-option">
            <img src="/images/esewa.jpeg" alt="eSewa" />
            eSewa
          </button>
          <button className="pay-option">
            <img src="/images/khalti.jpg" alt="Khalti" />
            Khalti
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="payment-right">
          <h3 className="section-heading">Order Summary</h3>
          {state?.pooja && (
            <div className="summary-row">
              <span>Pooja</span>
              <span>{state.pooja}</span>
            </div>
          )}
          <div className="summary-row">
            <span>Total</span>
            <span>Rs. {amount}</span>
          </div>

          <div className="form-section">
            <label>🆔 eSewa/Khalti ID</label>
            <input
              type="text"
              placeholder="Enter your eSewa or Khalti ID"
              value={paymentId}
              onChange={(e) => setPaymentId(e.target.value)}
              className="input-field"
            />
          </div>

          <button className="pay-now-btn" onClick={handlePayNow}>
            Pay Now
          </button>

          <div className="secure-text">🔒 Your payment is secure</div>
          <div className="secure-box">
            Secured By<br />
            Nepal Rastra Bank <br />
            PCI-DSS Compliant SSL Encryption
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
