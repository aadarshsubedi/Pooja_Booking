
// import React, { useEffect, useState } from "react";
// import Calendar from "react-calendar";
// import "./Panditcalendar.css";
// import { fetchPanditBookedSlots, type BookedMap } from "../api/Api";

// type Props = {
//   panditId: number;
//   date: string;
//   onDateChange: (iso: string) => void;
//   onAvailableSlotsChange: (slots: string[]) => void;
// };

// const ALL_SLOTS = ["Morning 6-8 AM", "Afternoon 1-3 PM", "Evening 5-7 PM"];

// // slot -> backend time
// const slotToTime = (slot: string) => {
//   switch (slot) {
//     case "Morning 6-8 AM":
//       return "06:00:00";
//     case "Afternoon 1-3 PM":
//       return "13:00:00";
//     case "Evening 5-7 PM":
//       return "17:00:00";
//     default:
//       return "00:00:00";
//   }
// };

// // slot -> start hour (STRICT: disable slot after start hour passed)
// const SLOT_START_HOUR: Record<string, number> = {
//   "Morning 6-8 AM": 6,
//   "Afternoon 1-3 PM": 13,
//   "Evening 5-7 PM": 17,
// };

// // ✅ FIX timezone issue: DO NOT use toISOString()
// // This prevents selecting 15 and getting 14
// const toISO = (d: Date) => {
//   const y = d.getFullYear();
//   const m = String(d.getMonth() + 1).padStart(2, "0");
//   const day = String(d.getDate()).padStart(2, "0");
//   return `${y}-${m}-${day}`;
// };

// // helper: same local day
// const isSameDay = (a: Date, b: Date) =>
//   a.getFullYear() === b.getFullYear() &&
//   a.getMonth() === b.getMonth() &&
//   a.getDate() === b.getDate();

// const BookingCalendar: React.FC<Props> = ({
//   panditId,
//   date,
//   onDateChange,
//   onAvailableSlotsChange,
// }) => {
//   const [bookedMap, setBookedMap] = useState<BookedMap>({});
//   const [activeMonth, setActiveMonth] = useState<Date>(new Date());

//   // fetch booked slots for the month
//   useEffect(() => {
//     if (!panditId) return;

//     const start = new Date(activeMonth.getFullYear(), activeMonth.getMonth(), 1);
//     const end = new Date(activeMonth.getFullYear(), activeMonth.getMonth() + 1, 0);

//     fetchPanditBookedSlots(panditId, toISO(start), toISO(end))
//       .then(setBookedMap)
//       .catch(console.error);
//   }, [panditId, activeMonth]);

//   // ✅ compute free slots for a selected date
//   const computeFreeSlots = (isoDate: string) => {
//     // 1) remove booked slots
//     const bookedTimes = bookedMap[isoDate] || [];
//     let free = ALL_SLOTS.filter((s) => !bookedTimes.includes(slotToTime(s)));

//     // 2) if selected date is today -> remove slots whose START time has passed
//     const selected = new Date(isoDate + "T00:00:00"); // safe local day
//     const now = new Date();

//     if (isSameDay(selected, now)) {
//       const currentHour = now.getHours();
//       const currentMinute = now.getMinutes();

//       free = free.filter((slot) => {
//         const startHour = SLOT_START_HOUR[slot] ?? 0;

//         // STRICT rule:
//         // if current time is AFTER start hour -> disable
//         if (currentHour > startHour) return false;

//         // if current time is EXACT start hour -> start has passed (even at minute 0)
//         if (currentHour === startHour && currentMinute >= 0) return false;

//         return true;
//       });
//     }

//     return free;
//   };

//   // update available slots when date changes or bookedMap changes
//   useEffect(() => {
//     if (date) onAvailableSlotsChange(computeFreeSlots(date));
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [date, bookedMap]);

//   // disable tiles in calendar
//   const tileDisabled = ({ date, view }: { date: Date; view: string }) => {
//     if (view !== "month") return false;

//     // disable past dates
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const d = new Date(date);
//     d.setHours(0, 0, 0, 0);

//     if (d < today) return true;

//     // disable fully booked days (AND today if all slots already passed)
//     const iso = toISO(date);
//     return computeFreeSlots(iso).length === 0;
//   };

//   return (
//     <Calendar
//       value={date ? new Date(date + "T00:00:00") : undefined}
//       onChange={(val) => onDateChange(toISO(val as Date))}
//       onActiveStartDateChange={({ activeStartDate }) =>
//         setActiveMonth(activeStartDate || new Date())
//       }
//       tileDisabled={tileDisabled}
//     />
//   );
// };

// export default BookingCalendar;
import React, { useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import "./Panditcalendar.css";
import {
  fetchPanditBookedSlots,
  fetchPanditBlockedDatesPublic,
  type BookedMap,
} from "../api/Api";

type Props = {
  panditId: number;
  date: string;
  onDateChange: (iso: string) => void;
  onAvailableSlotsChange: (slots: string[]) => void;
};

const ALL_SLOTS = ["Morning 6-8 AM", "Afternoon 1-3 PM", "Evening 5-7 PM"];

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

// ✅ timezone-safe date
const toISO = (d: Date) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const BookingCalendar: React.FC<Props> = ({
  panditId,
  date,
  onDateChange,
  onAvailableSlotsChange,
}) => {
  const [bookedMap, setBookedMap] = useState<BookedMap>({});
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [activeMonth, setActiveMonth] = useState<Date>(new Date());

  const monthStart = useMemo(
    () => new Date(activeMonth.getFullYear(), activeMonth.getMonth(), 1),
    [activeMonth]
  );

  const monthEnd = useMemo(
    () => new Date(activeMonth.getFullYear(), activeMonth.getMonth() + 1, 0),
    [activeMonth]
  );

  useEffect(() => {
    if (!panditId) return;

    const startISO = toISO(monthStart);
    const endISO = toISO(monthEnd);

    // booked slots
    fetchPanditBookedSlots(panditId, startISO, endISO)
      .then(setBookedMap)
      .catch(console.error);

    // ✅ blocked dates (PUBLIC endpoint)
    fetchPanditBlockedDatesPublic(panditId, startISO, endISO)
      .then(setBlockedDates)
      .catch(console.error);
  }, [panditId, monthStart, monthEnd]);

  const computeFreeSlots = (isoDate: string) => {
    const bookedTimes = bookedMap[isoDate] || [];
    return ALL_SLOTS.filter((s) => !bookedTimes.includes(slotToTime(s)));
  };

  useEffect(() => {
    if (date) onAvailableSlotsChange(computeFreeSlots(date));
  }, [date, bookedMap]);

  const tileDisabled = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return false;

    const iso = toISO(date);

    // disable past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    if (d < today) return true;

    // ✅ disable blocked dates
    if (blockedDates.includes(iso)) return true;

    // disable fully booked days
    return computeFreeSlots(iso).length === 0;
  };

  return (
    <Calendar
      value={date ? new Date(date) : undefined}
      onChange={(val) => onDateChange(toISO(val as Date))}
      onActiveStartDateChange={({ activeStartDate }) =>
        setActiveMonth(activeStartDate || new Date())
      }
      tileDisabled={tileDisabled}
    />
  );
};

export default BookingCalendar;
