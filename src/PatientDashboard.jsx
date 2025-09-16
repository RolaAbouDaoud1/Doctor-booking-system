import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PatientDashboard.css";

function Modal({ title, message, onConfirm, onCancel, confirmText }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="confirm-btn coral" onClick={onConfirm}>
            {confirmText || "Yes"}
          </button>
          <button className="confirm-btn gray" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PatientDashboard() {
  const [modalData, setModalData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [newNotifId, setNewNotifId] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // 👉 API: Replace with GET `/api/patient/:id/appointments`
  const doctors = [
    { name: "Dr. Layla Khoury", spec: "Cardiology", time: "Today • 2:30 PM" },
    { name: "Dr. Omar Khalil", spec: "General Medicine", time: "Tomorrow • 10:00 AM" },
  ];

  useEffect(() => {
    // 👉 API: (Optional) Fetch motivational messages from backend if dynamic
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    const messages = [
      "Take a deep breath and relax.",
      "Remember to drink water today!",
      "Stay positive and keep smiling.",
      "Focus on your health and wellbeing.",
      "Time for a short walk!"
    ];
    const today = new Date().getDate();
    setMessage(messages[today % messages.length]);
  }, []);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  // 👉 API: You could also POST `/api/patient/:id/notifications` here
  const addNotification = (text) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message: text }]);
    setNewNotifId(id);
    setShowDropdown(true);
    setTimeout(() => setNewNotifId(null), 1500);
  };

  // 👉 API: PUT `/api/appointments/:id/cancel`
  const handleCancel = (doctor) => {
    addNotification(`Appointment canceled with ${doctor}`);
    setModalData(null);
  };

  // 👉 API: PUT `/api/appointments/:id/reschedule`
  const handleReschedule = (doctor) => {
    addNotification(`Rescheduling appointment with ${doctor}`);
    setModalData(null);
    navigate("/doctor-search"); // After confirming new slot
  };

  const openModal = (type, doctor) => setModalData({ type, doctor });
  const closeModal = () => setModalData(null);

  return (
    <div className="dashboard bg-color">
    
      <div className="header">
        <div>
          {/* 👉 API: Fetch logged-in patient's name instead of hardcoding "Ahmad" */}
          <h1 className="greeting">{greeting}, Ahmad</h1>
          <p className="subtext">{message}</p>
        </div>
        <div className="notif-wrapper">
          <button className="notif-btn" onClick={toggleDropdown}>
            🔔
            {/* 👉 API: Replace with real notification count from backend */}
            {notifications.length > 0 && (
              <span className="notif-count">{notifications.length}</span>
            )}
          </button>
          {showDropdown && (
            <div className="notif-dropdown">
              {notifications.length === 0 ? (
                <p className="notif-item">No new notifications</p>
              ) : (
                notifications.map(n => (
                  <p
                    key={n.id}
                    className={`notif-item ${n.id === newNotifId ? "new" : ""}`}
                  >
                    {n.message}
                  </p>
                ))
              )}
            </div>
          )}
        </div>
      </div>

     
      <div className="card quick-actions">
        <button className="action-btn bg-teal" onClick={() => navigate("/book-appointment")}>
          📅 Book Appointment
        </button>
        <button className="action-btn bg-light-teal" onClick={() => navigate("/doctor-search")}>
          🔍 Find Doctors
        </button>
        <button className="action-btn bg-coral" onClick={() => navigate("/patient-history")}>
          📋 Medical History
        </button>
        <button className="action-btn bg-gray" onClick={() => navigate("/patient-profile")}>
          👤 My Profile
        </button>
      </div>

      
      <div className="card appointments">
        <div className="appointments-header">
          <h2>Upcoming Appointments</h2>
          <button className="book-new bg-teal" onClick={() => navigate("/doctor-search")}>
            ➕ Book Now
          </button>
        </div>

        {/* 👉 API: Render appointments fetched from backend */}
        {doctors.map(doc => (
          <div className="appointment" key={doc.name}>
            <div className="appt-info">
              <div className="appt-avatar teal">
                {doc.name.split(" ").slice(1).map(n => n[0]).join("")}
              </div>
              <div>
                <p
                  className="doctor-name link"
                  onClick={() =>
                    navigate(`/doctor-profile/${encodeURIComponent(doc.name)}`)
                  }
                >
                  {doc.name}
                </p>
                <p className="doctor-spec">{doc.spec}</p>
                <p className="doctor-time">{doc.time}</p>
              </div>
            </div>
            <div className="appt-actions">
              <button
                className="appt-btn coral"
                onClick={() => openModal("reschedule", doc.name)}
              >
                Reschedule
              </button>
              <button
                className="appt-btn gray"
                onClick={() => openModal("cancel", doc.name)}
              >
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>

      
      {modalData && (
        <Modal
          title={modalData.type === "cancel" ? "Cancel Appointment" : "Reschedule Appointment"}
          message={
            modalData.type === "cancel"
              ? `Are you sure you want to cancel your appointment with ${modalData.doctor}?`
              : `Do you want to reschedule your appointment with ${modalData.doctor}?`
          }
          confirmText={modalData.type === "cancel" ? "Cancel" : "Reschedule"}
          onConfirm={() =>
            modalData.type === "cancel"
              ? handleCancel(modalData.doctor)
              : handleReschedule(modalData.doctor)
          }
          onCancel={closeModal}
        />
      )}
    </div>
  );
}
