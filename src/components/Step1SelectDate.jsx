import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

const Step1SelectDate = ({ appointment, setAppointment, nextStep, doctorId, doctor }) => {
  const [dates, setDates] = useState([]);
  const [times, setTimes] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const fetchAvailableTimes = async (dateValue) => {
    if (!doctorId) {
      console.warn("doctorId missing, cannot fetch availability");
      setTimes([]);
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
      // expecting array of { date: "YYYY-MM-DD", times: [...] }
      const selected = Array.isArray(data) ? data.find((item) => item.date === dateValue) : null;
      setTimes(selected ? selected.times : []);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Error fetching available times:", err);
        alert("Failed to load available slots. Please try again.");
      }
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  };

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
        <div className="avatar">{(doctor?.initials) || "LK"}</div>
        <div className="doc-details">
          <h3>{doctor?.fullName || "Dr. Name"}</h3>
          <small>{(doctor?.specialties?.[0]?.name) || doctor?.specialties?.[0] || "Specialty"}</small>
        </div>
        <div className="price">{doctor?.price || "$150"}</div>
      </div>

      <div className="section">
        <h4>Select Date</h4>
        <div className="date-grid">
          {dates.map((d) => (
            <button
              key={d.value}
              className={appointment?.date === d.value ? "date-btn active" : "date-btn"}
              onClick={() => {
                setAppointment({ ...appointment, date: d.value, time: null });
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
                  key={t}
                  className={appointment?.time === t ? "time-btn active" : "time-btn"}
                  onClick={() => setAppointment({ ...appointment, time: t })}
                  type="button"
                >
                  {t}
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
