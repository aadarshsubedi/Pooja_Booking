import React, { useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./PanditPages.css";

import {
  blockMyPanditDate,
  fetchMyBlockedDates,
  unblockMyPanditDate,
  type BlockedDate,
} from "../../../api/Api";

const toISO = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Schedule: React.FC = () => {
  const [activeMonth, setActiveMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [blocked, setBlocked] = useState<BlockedDate[]>([]);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const { startISO, endISO } = useMemo(() => {
    const start = new Date(activeMonth.getFullYear(), activeMonth.getMonth(), 1);
    const end = new Date(activeMonth.getFullYear(), activeMonth.getMonth() + 1, 0);
    return { startISO: toISO(start), endISO: toISO(end) };
  }, [activeMonth]);

  const blockedMap = useMemo(() => {
    const map = new Map<string, BlockedDate>();
    blocked.forEach((b) => map.set(b.date, b));
    return map;
  }, [blocked]);

  const loadBlocked = async () => {
    setLoading(true);
    try {
      const data = await fetchMyBlockedDates(startISO, endISO);
      setBlocked(data);
    } catch (e: any) {
      alert(e?.message || "Failed to load blocked dates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlocked();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startISO, endISO]);

  const handleBlock = async () => {
    const iso = toISO(selectedDate);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const picked = new Date(selectedDate);
    picked.setHours(0, 0, 0, 0);

    if (picked < today) {
      alert("You cannot block past dates.");
      return;
    }

    try {
      await blockMyPanditDate({ date: iso, reason: reason.trim() });
      setReason("");
      await loadBlocked();
      alert(`✅ Blocked ${iso}`);
    } catch (e: any) {
      alert(e?.message || "Failed to block date");
    }
  };

  const handleUnblock = async () => {
    const iso = toISO(selectedDate);
    if (!blockedMap.has(iso)) {
      alert("This date is not blocked.");
      return;
    }

    try {
      await unblockMyPanditDate({ date: iso });
      await loadBlocked();
      alert(`✅ Unblocked ${iso}`);
    } catch (e: any) {
      alert(e?.message || "Failed to unblock date");
    }
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return "";
    const iso = toISO(date);
    return blockedMap.has(iso) ? "blocked-day" : "";
  };

  const tileDisabled = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d < today;
  };

  const selectedISO = toISO(selectedDate);
  const isSelectedBlocked = blockedMap.has(selectedISO);

  return (
    <div className="pandit-page schedule-page">
      <h2 className="page-title">Schedule</h2>

      <div className="schedule-container">
        <div className="schedule-card">
          <h3>Availability Calendar</h3>

          <div className="calendar-wrap">
            <Calendar
              value={selectedDate}
              onChange={(val) => setSelectedDate(val as Date)}
              onActiveStartDateChange={({ activeStartDate }) =>
                setActiveMonth(activeStartDate || new Date())
              }
              tileClassName={tileClassName}
              tileDisabled={tileDisabled}
            />
          </div>

          <div className="selected-info">
            <div>
              <strong>Selected:</strong> {selectedISO}
            </div>
            <div className={`badge ${isSelectedBlocked ? "badge-red" : "badge-green"}`}>
              {isSelectedBlocked ? "Blocked" : "Available"}
            </div>
          </div>

          <input
            className="reason-input"
            placeholder="Reason (optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />

          <div className="btn-row">
            {!isSelectedBlocked ? (
              <button className="block-btn" onClick={handleBlock} disabled={loading}>
                {loading ? "Saving..." : "+ Block this date"}
              </button>
            ) : (
              <button className="unblock-btn" onClick={handleUnblock} disabled={loading}>
                {loading ? "Saving..." : "Unblock this date"}
              </button>
            )}
          </div>

          <p className="hint">Blocked dates will not accept any bookings.</p>
        </div>

        <div className="schedule-card">
          <h3>Blocked Dates (This Month)</h3>

          {loading ? (
            <p className="muted">Loading...</p>
          ) : blocked.length === 0 ? (
            <p className="muted">No blocked dates.</p>
          ) : (
            <div className="blocked-list">
              {blocked.map((b) => (
                <div key={b.id} className="blocked-row">
                  <div>
                    <div className="blocked-date">{b.date}</div>
                    {b.reason ? <div className="blocked-reason">{b.reason}</div> : null}
                  </div>

                  <button
                    className="mini-unblock"
                    onClick={async () => {
                      try {
                        await unblockMyPanditDate({ date: b.date });
                        await loadBlocked();
                      } catch (e: any) {
                        alert(e?.message || "Failed to unblock");
                      }
                    }}
                  >
                    Unblock
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
