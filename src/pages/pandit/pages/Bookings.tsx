import React, { useEffect, useState } from "react";
import {
  fetchPanditBookings,
  updatePanditBookingStatus,
  type PanditBooking
} from "../../../api/Api";
import "./PanditPages.css";

const Bookings: React.FC = () => {
  const [status, setStatus] = useState("");
  const [list, setList] = useState<PanditBooking[]>([]);
  const [err, setErr] = useState("");

  const load = () => {
    fetchPanditBookings(status || undefined)
      .then(setList)
      .catch((e) => setErr(e.message));
  };

  useEffect(() => {
    load();
  }, [status]);

  const changeStatus = async (id: number, newStatus: string) => {
    try {
      await updatePanditBookingStatus(id, newStatus);
      load();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="bookings-page">
      <h3>Pooja Bookings</h3>

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>

      {err && <p className="bookings-error">{err}</p>}

      <table className="bookings-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Date</th>
            <th>Time</th>
            <th>Location</th>
            <th>Price</th>
            <th>Status</th>
            <th>Payment</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {list.map((b) => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.user_username}</td>
              <td>{b.date}</td>
              <td>{b.time}</td>
              <td>{b.location}</td>
              <td>Rs. {b.price}</td>

              <td>
                <span className={`status-badge status-${b.status}`}>
                  {b.status}
                </span>
              </td>

              <td
                className={
                  b.payment_status === "paid"
                    ? "payment-paid"
                    : "payment-unpaid"
                }
              >
                {b.payment_status}
              </td>

              <td className="action-buttons">
                <button
                  className="btn-confirm"
                  onClick={() => changeStatus(b.id, "confirmed")}
                >
                  Confirm
                </button>
                <button
                  className="btn-complete"
                  onClick={() => changeStatus(b.id, "completed")}
                >
                  Complete
                </button>
                <button
                  className="btn-cancel"
                  onClick={() => changeStatus(b.id, "cancelled")}
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Bookings;
