import React, { useState, useEffect } from "react";

const Step1SelectDate = ({ appointment, setAppointment, nextStep }) => {
  const [dates, setDates] = useState([]);
  const [times, setTimes] = useState([]);

  // Generate next 7 days dynamically
  useEffect(() => {
    const generateDates = () => {
      const today = new Date();
      const next7Days = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const day = d.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
        next7Days.push(day);
      }
      setDates(next7Days);
    };
    generateDates();
  }, []);

  // Generate time slots dynamically (9:00 AM → 5:00 PM, every 30 mins)
  const generateTimes = () => {
    const startHour = 9;
    const endHour = 17;
    const interval = 30;
    const slots = [];

    for (let hour = startHour; hour < endHour; hour++) {
      for (let min = 0; min < 60; min += interval) {
        const date = new Date();
        date.setHours(hour, min, 0);
        slots.push(
          date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      }
    }
    setTimes(slots);
  };

  return (
    <div className="appointment-container">
      <div className="book-card">
        <button className="back-btn">←</button>

        <h2 className="title">Book Appointment</h2>
        <div className="dots">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>

      <div className="doctor-info">
        <div className="avatar">LK</div>
        <div className="doc-details">
          <h3>Dr. Layla Khoury</h3>
          <small>Cardiology</small>
        </div>
        <div className="price">$150</div>
      </div>

      <div className="section">
        <h4>Select Date</h4>
        <div className="date-grid">
          {dates.map((d) => (
            <button
              key={d}
              className={appointment.date === d ? "date-btn active" : "date-btn"}
              onClick={() => {
                setAppointment({ ...appointment, date: d, time: null });
                generateTimes(); // 👈 only generate times after date is clicked
              }}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* 👇 Only show available times after selecting a date */}
      {appointment.date && (
        <div className="section">
          <h4>Available Times</h4>
          <div className="time-grid">
            {times.map((t) => (
              <button
                key={t}
                className={
                  appointment.time === t ? "time-btn active" : "time-btn"
                }
                onClick={() => setAppointment({ ...appointment, time: t })}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        className="next-btn"
        onClick={() => {
          if (appointment.date && appointment.time) nextStep();
          else alert("Please select date and time");
        }}
      >
        Next
      </button>
    </div>
  );
};

export default Step1SelectDate;
