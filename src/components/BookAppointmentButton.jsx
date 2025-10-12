import React from "react";
import { useNavigate } from "react-router-dom";

export default function BookAppointmentButton({ doctorId }) {
  const navigate = useNavigate();

  return (
    <div className="button-container">
      <button
        onClick={() => navigate(`/book-appointment/${doctorId}`)}
        className="book-button"
      >
        Book Appointment
      </button>
    </div>
  );
}
