import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentPage.css";
import { payBooking } from "../api/Api";

type LocationState = {
  bookingId: number;
  poojaType?: string;
  date?: string;
  selectedTime?: string;
  location?: string;
  price?: number;
};

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const data = (state || {}) as LocationState;

  const bookingId = data.bookingId;
  const amount = useMemo(() => Number(data.price || 1100), [data.price]);

  const [method, setMethod] = useState<"khalti" | "esewa">("khalti");
  const [payerId, setPayerId] = useState("");
  const [loading, setLoading] = useState(false);

  const submitEsewaForm = (action: string, fields: Record<string, string>) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = action;

    Object.entries(fields).forEach(([k, v]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = k;
      input.value = String(v);
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  const handlePayNow = async () => {
    if (!bookingId) {
      alert("Booking id missing. Please go back and try again.");
      return;
    }

    if (!payerId.trim()) {
      alert("Please enter your eSewa/Khalti ID (demo field).");
      return;
    }

    setLoading(true);
    try {
      const res = await payBooking(bookingId, { method, amount });

      // ✅ eSewa (form submit)
      if (res.type === "form" && (res.action_url || res.action) && res.fields) {
        submitEsewaForm(res.action_url || res.action, res.fields);
        return;
      }

      // ✅ Khalti demo
      if (res.type === "demo") {
      navigate("/khalti-demo", { state: { bookingId, amount } });
      return;
      }

    throw new Error("Invalid payment response from server.");




// ✅ SUPPORT BOTH RESPONSE FORMATS (old + new)

// 1) Khalti redirect (new format OR old format)
const paymentUrl = res.payment_url || res.paymentUrl;
if (paymentUrl) {
  window.location.href = paymentUrl;
  return;
}

// 2) eSewa form submit (new format OR old format)
const action = res.action || res.action_url || res.actionUrl;
const fields = res.fields;

if (action && fields) {
  submitEsewaForm(action, fields);
  return;
}

// 3) fallback error
console.log("Payment response (debug):", res);
throw new Error("Invalid payment response from server.");
    } catch (e: any) {
      alert(e?.message || "Payment initiation failed.");
    }
  };


  return (
    <div className="payment-wrapper">
      <h2 className="payment-title">Payment Confirmation</h2>

      <div className="payment-box">
        <div className="payment-left">
          <h3 className="section-heading">Payment Method</h3>

          <button
            type="button"
            className={`pay-option ${method === "khalti" ? "active" : ""}`}
            onClick={() => setMethod("khalti")}
          >
            <img src="/images/khalti.jpg" alt="Khalti" />
            Khalti (Demo/Sandbox)
          </button>

          <button
            type="button"
            className={`pay-option ${method === "esewa" ? "active" : ""}`}
            onClick={() => setMethod("esewa")}
          >
            <img src="/images/esewa.jpeg" alt="eSewa" />
            eSewa (UAT/Sandbox)
          </button>

          <h3 className="section-heading" style={{ marginTop: 16 }}>
            Demo ID
          </h3>
          <input
            className="input-field"
            type="text"
            placeholder="Enter your eSewa/Khalti ID (demo)"
            value={payerId}
            onChange={(e) => setPayerId(e.target.value)}
          />

          <div className="secure-text">🔒 Secure redirect to gateway</div>
        </div>

        <div className="payment-right">
          <h3 className="section-heading">Order Summary</h3>

          <div className="summary-row">
            <span>Booking ID</span>
            <span>#{bookingId || "—"}</span>
          </div>

          {data.poojaType && (
            <div className="summary-row">
              <span>Pooja</span>
              <span>{data.poojaType}</span>
            </div>
          )}

          {data.date && (
            <div className="summary-row">
              <span>Date</span>
              <span>{data.date}</span>
            </div>
          )}

          {data.selectedTime && (
            <div className="summary-row">
              <span>Time</span>
              <span>{data.selectedTime}</span>
            </div>
          )}

          {data.location && (
            <div className="summary-row">
              <span>Location</span>
              <span>{data.location}</span>
            </div>
          )}

          <div className="summary-row total">
            <span>Total</span>
            <span>Rs. {amount}</span>
          </div>

          <button
            className="pay-now-btn"
            onClick={handlePayNow}
            disabled={loading}
          >
            {loading ? "Redirecting..." : "Pay Now"}
          </button>

          <button
            type="button"
            className="pay-now-btn secondary"
            onClick={() => navigate("/home")}
            disabled={loading}
            style={{ marginTop: 10 }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
