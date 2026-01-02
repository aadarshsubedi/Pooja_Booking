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

const ALL_SLOTS = ["Morning 6-8 AM", "Afternoon 1-3 PM", "Evening 5-7 PM"];

const slotToTime = (slot: string) => {
  switch (slot) {
    case "Morning 6-8 AM": return "06:00:00";
    case "Afternoon 1-3 PM": return "13:00:00";
    case "Evening 5-7 PM": return "17:00:00";
    default: return "00:00:00";
  }
};

const toISO = (d: Date) => d.toISOString().slice(0, 10);

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

    fetchPanditBookedSlots(panditId, toISO(start), toISO(end))
      .then(setBookedMap)
      .catch(console.error);
  }, [panditId, activeMonth]);

  const computeFreeSlots = (isoDate: string) => {
    const bookedTimes = bookedMap[isoDate] || [];
    return ALL_SLOTS.filter((s) => !bookedTimes.includes(slotToTime(s)));
  };

  useEffect(() => {
    if (date) onAvailableSlotsChange(computeFreeSlots(date));
  }, [date, bookedMap]);

  const tileDisabled = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return false;

    // ✅ disable past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    if (d < today) return true;

    // ✅ disable fully booked days
    const iso = toISO(date);
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
