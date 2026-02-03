import React from "react";
import { useSearchParams } from "react-router-dom";
import { downloadReceipt } from "../api/Api";
import "./PaymentResultPage.css";

const PaymentResultPage: React.FC = () => {
  const [params] = useSearchParams();
  const status = params.get("status");
  const bookingId = Number(params.get("booking_id"));

  const isSuccess = status === "success";

  const handleDownload = async () => {
    if (!bookingId) return alert("Booking id missing");
    try {
      await downloadReceipt(bookingId);
    } catch (e: any) {
      alert(e?.message || "Failed to download receipt");
    }
  };

  return (
    <div className="pr-wrap">
      <div className="pr-card">
        <h2>{isSuccess ? "✅ Payment Successful" : "❌ Payment Failed"}</h2>
        <p>Booking ID: #{bookingId}</p>

        {isSuccess ? (
          <>
            <p>Your payment is completed. You can download your receipt as proof.</p>
            <button className="pr-btn" onClick={handleDownload}>
              Download Receipt (PDF)
            </button>
          </>
        ) : (
          <p>Please try again. No receipt is available for failed payments.</p>
        )}
      </div>
    </div>
  );
};

export default PaymentResultPage;
