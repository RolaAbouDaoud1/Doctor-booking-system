import Cookies from "js-cookie";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

const DEFAULT_TIME_SLOTS = [
  { id: "mock-09:00", value: "09:00", label: "09:00 AM" },
  { id: "mock-09:30", value: "09:30", label: "09:30 AM" },
  { id: "mock-10:00", value: "10:00", label: "10:00 AM" },
  { id: "mock-10:30", value: "10:30", label: "10:30 AM" },
  { id: "mock-11:00", value: "11:00", label: "11:00 AM" },
  { id: "mock-11:30", value: "11:30", label: "11:30 AM" },
  { id: "mock-14:00", value: "14:00", label: "02:00 PM" },
  { id: "mock-14:30", value: "14:30", label: "02:30 PM" },
  { id: "mock-15:00", value: "15:00", label: "03:00 PM" },
  { id: "mock-16:30", value: "16:30", label: "04:30 PM" },
];

const Step1SelectDate = ({
  appointment,
  setAppointment,
  nextStep,
  doctor,
  doctorId: propDoctorId,
  doctorLoading,
  doctorError,
}) => {
  const [dates, setDates] = useState([]);
  const [times, setTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const params = useParams();

  const doctorId = useMemo(() => {
    return (
      propDoctorId ||
      doctor?.id ||
      doctor?.doctorId ||
      params.doctorId ||
      params.id ||
      localStorage.getItem("doctorId") ||
      null
    );
  }, [doctor?.doctorId, doctor?.id, params.doctorId, params.id, propDoctorId]);

  // Generate next 7 days dynamically (value = YYYY-MM-DD, label = human readable)
  useEffect(() => {
    const today = new Date();
    const next7Days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const value = d.toISOString().split("T")[0]; // 2025-10-30
      const label = d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      next7Days.push({ label, value });
    }
    setDates(next7Days);
  }, []);

  const normalizeTimeOption = (entry) => {
    if (!entry) return null;

    const resolveValue = (raw) => {
      if (!raw) return "";
      const str = String(raw).trim();
      if (str.includes("T")) return str;

      const ampmMatch = str.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (ampmMatch) {
        let hours = parseInt(ampmMatch[1], 10);
        const minutes = ampmMatch[2];
        const period = ampmMatch[3].toUpperCase();
        if (period === "PM" && hours < 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;
        return `${String(hours).padStart(2, "0")}:${minutes}`;
      }

      const hhmmMatch = str.match(/^(\d{1,2}):(\d{2})$/);
      if (hhmmMatch) {
        return `${hhmmMatch[1].padStart(2, "0")}:${hhmmMatch[2]}`;
      }

      return str;
    };

    const formatDisplayTime = (raw) => {
      if (!raw) return "--";
      const str = String(raw).trim();
      if (str.includes("T")) {
        const date = new Date(str);
        if (!Number.isNaN(date.getTime())) {
          return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
        }
      }
      if (/am|pm/i.test(str)) {
        return str.toUpperCase();
      }
      const hhmmMatch = str.match(/^(\d{1,2}):(\d{2})$/);
      if (hhmmMatch) {
        const date = new Date();
        date.setHours(parseInt(hhmmMatch[1], 10));
        date.setMinutes(parseInt(hhmmMatch[2], 10));
        return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      }
      return str;
    };

    if (typeof entry === "string") {
      const value = resolveValue(entry);
      return {
        id: value || entry,
        value,
        label: formatDisplayTime(entry),
      };
    }

    if (typeof entry === "object") {
      const rawValue = entry.value || entry.start || entry.time || entry.id || entry.label;
      const value = resolveValue(rawValue);
      const label = entry.label || formatDisplayTime(rawValue);
      return {
        id: entry.id || entry.slotId || entry.slotID || entry._id || value,
        value,
        label,
      };
    }

    return null;
  };

  const buildMockSlots = () => DEFAULT_TIME_SLOTS.map((slot) => ({ ...slot }));

  const fetchAvailableTimes = async (dateValue) => {
    if (!doctorId) {
      console.warn("doctorId missing, cannot fetch availability");
      setTimes(buildMockSlots());
      return;
    }

    if (typeof navigator !== "undefined" && navigator && navigator.onLine === false) {
      setTimes(buildMockSlots());
      return;
    }

    const controller = new AbortController();
    try {
      setLoading(true);
      setTimes([]);
      const token = Cookies.get("token");
      const response = await fetch(
        `http://localhost:8080/api/availability-slots/doctor/${doctorId}/all`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
          signal: controller.signal,
        }
      );
      if (!response.ok) throw new Error("Failed to fetch slots");
      const data = await response.json();
      // expecting array of { date: "YYYY-MM-DD", times: [...] } or similar
      const normalizedTimes = [];

      const tryPush = (entry) => {
        const option = normalizeTimeOption(entry);
        if (!option || !option.value) return;
        if (
          normalizedTimes.some((item) =>
            option.id && item.id ? item.id === option.id : item.value === option.value
          )
        )
          return;
        normalizedTimes.push(option);
      };

      const selected = Array.isArray(data)
        ? data.find((item) => item.date === dateValue || item.date?.startsWith?.(dateValue))
        : data && typeof data === "object" && data.date === dateValue
        ? data
        : null;

      const candidateTimes = selected?.times || selected?.slots || data?.times || data?.slots || [];

      if (Array.isArray(candidateTimes)) {
        candidateTimes.forEach((entry) => tryPush(entry));
      } else if (candidateTimes) {
        Object.values(candidateTimes).forEach((entry) => tryPush(entry));
      }

      if (!normalizedTimes.length) {
        buildMockSlots().forEach((slot) => tryPush(slot));
      }

      setTimes(normalizedTimes);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Error fetching available times:", err);
      }
      const fallback = buildMockSlots().map((slot) => ({ ...slot }));
      setTimes(fallback);
    } finally {
      setLoading(false);
    }

    // no return cleanup from this async helper
  };

  const doctorName = doctor?.fullName || doctor?.name || "Dr. Name";
  const doctorSpecialty =
    (doctor?.specialties && (doctor.specialties[0]?.name || doctor.specialties[0])) || "Specialty";
  const doctorPrice = doctor?.price || "--";
  const doctorInitials = useMemo(() => {
    const fallback = "DR";
    if (!doctorName) return fallback;
    return doctorName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase?.())
      .slice(0, 2)
      .join("") || fallback;
  }, [doctorName]);

  return (
    <div className="appointment-container">
      <div className="book-card">
        <button className="back-btn" onClick={() => window.history.back()}>
          ←
        </button>

        <h2 className="title">Book Appointment</h2>
        <div className="dots">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>

      <div className="doctor-info">
        <div className="avatar">{doctor?.initials || doctorInitials}</div>
        <div className="doc-details">
          <h3>
            {doctorLoading ? "Loading doctor..." : doctorError ? "Doctor unavailable" : doctorName}
          </h3>
          <small>
            {doctorLoading
              ? "Fetching specialty..."
              : doctorError
              ? "Unknown specialty"
              : doctorSpecialty}
          </small>
        </div>
        <div className="price">{doctorPrice}</div>
      </div>

      <div className="section">
        <h4>Select Date</h4>
        <div className="date-grid">
          {dates.map((d) => (
            <button
              key={d.value}
              className={appointment?.date === d.value ? "date-btn active" : "date-btn"}
              onClick={() => {
                setAppointment({ ...appointment, date: d.value, time: null, timeLabel: null, slotId: null });
                fetchAvailableTimes(d.value); // fetch times for selected date
              }}
              type="button"
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* show loader when fetching */}
      {loading && (
        <div className="section">
          <p>Loading available times…</p>
        </div>
      )}

      {/* show available times after selecting a date */}
      {appointment?.date && !loading && (
        <div className="section">
          <h4>Available Times</h4>
          <div className="time-grid">
            {times.length ? (
              times.map((t) => (
                <button
                  key={t.id || t.value}
                  className={appointment?.time === t.value ? "time-btn active" : "time-btn"}
                  onClick={() =>
                    setAppointment({
                      ...appointment,
                      time: t.value,
                      timeLabel: t.label,
                      slotId: t.id || t.value,
                    })
                  }
                  type="button"
                >
                  {t.label}
                </button>
              ))
            ) : (
              <div className="text-gray-500">No slots available for this date</div>
            )}
          </div>
        </div>
      )}

      <button
        className="next-btn"
        onClick={() => {
          if (appointment?.date && appointment?.time) nextStep();
          else alert("Please select date and time");
        }}
        type="button"
      >
        Next
      </button>
    </div>
  );
};

export default Step1SelectDate;
