import React, { useEffect, useState } from "react";
import { fetchPanditBookings, updatePanditBookingStatus, type PanditBooking } from "../../../api/Api";

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
    <div>
      <h3>Bookings</h3>

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>

      {err && <p>{err}</p>}

      <table style={{ width: "100%", marginTop: 10 }}>
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
              <td>{b.status}</td>
              <td>{b.payment_status}</td>
              <td>
                <button onClick={() => changeStatus(b.id, "confirmed")}>Confirm</button>{" "}
                <button onClick={() => changeStatus(b.id, "completed")}>Complete</button>{" "}
                <button onClick={() => changeStatus(b.id, "cancelled")}>Cancel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Bookings;
