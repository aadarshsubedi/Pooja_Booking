import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "./Panditcalendar.css";
import { fetchPanditBookedSlots, type BookedMap } from "../api/Api";

type Props = {
  panditId: number;
  date: string;
  onDateChange: (iso: string) => void;
  onAvailableSlotsChange: (slots: string[]) => void;
};

const ALL_SLOTS = ["Morning 6-8 AM", "Afternoon 1-3 PM", "Evening 5-7 PM"] as const;

const slotToTime = (slot: string) => {
  switch (slot) {
    case "Morning 6-8 AM":
      return "06:00:00";
    case "Afternoon 1-3 PM":
      return "13:00:00";
    case "Evening 5-7 PM":
      return "17:00:00";
    default:
      return "00:00:00";
  }
};

// ✅ LOCAL SAFE: Date -> "YYYY-MM-DD" (NO UTC SHIFT)
const toYMDLocal = (d: Date) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

// ✅ LOCAL SAFE: "YYYY-MM-DD" -> Date (NO UTC SHIFT)
const fromYMDLocal = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const BookingCalendar: React.FC<Props> = ({
  panditId,
  date,
  onDateChange,
  onAvailableSlotsChange,
}) => {
  const [bookedMap, setBookedMap] = useState<BookedMap>({});
  const [activeMonth, setActiveMonth] = useState<Date>(new Date());

  useEffect(() => {
    if (!panditId) return;

    const start = new Date(activeMonth.getFullYear(), activeMonth.getMonth(), 1);
    const end = new Date(activeMonth.getFullYear(), activeMonth.getMonth() + 1, 0);

    // ✅ use LOCAL formatted start/end
    fetchPanditBookedSlots(panditId, toYMDLocal(start), toYMDLocal(end))
      .then(setBookedMap)
      .catch(console.error);
  }, [panditId, activeMonth]);

  const computeFreeSlots = (isoDate: string) => {
    const bookedTimes = bookedMap[isoDate] || [];
    return ALL_SLOTS.filter((s) => !bookedTimes.includes(slotToTime(s)));
  };

  useEffect(() => {
    if (date) onAvailableSlotsChange(computeFreeSlots(date));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, bookedMap]);

  const tileDisabled = ({ date: tileDate, view }: { date: Date; view: string }) => {
    if (view !== "month") return false;

    // ✅ disable past dates (LOCAL)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const d = new Date(tileDate);
    d.setHours(0, 0, 0, 0);

    if (d < today) return true;

    // ✅ disable fully booked days (LOCAL iso key)
    const iso = toYMDLocal(tileDate);
    return computeFreeSlots(iso).length === 0;
  };

  return (
    <Calendar
      value={date ? fromYMDLocal(date) : undefined} // ✅ FIXED
      onChange={(val) => {
        const picked = Array.isArray(val) ? val[0] : val;
        if (!picked) return;
        onDateChange(toYMDLocal(picked)); // ✅ FIXED
      }}
      onActiveStartDateChange={({ activeStartDate }) =>
        setActiveMonth(activeStartDate || new Date())
      }
      tileDisabled={tileDisabled}
    />
  );
};

export default BookingCalendar;
