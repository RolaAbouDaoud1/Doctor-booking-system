import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DoctorDashboard.css";

const defaultModal = { visible: false, action: "", appointmentId: null, text: "" };
const defaultRescheduleModal = { 
  visible: false, 
  appointmentId: null, 
  appointmentName: "", 
  newDate: "", 
  newTime: "" 
};

const DoctorDashboard = ({ doctorName = "Dr. Layla Khoury", specialty = "Cardiology" }) => {
  const navigate = useNavigate();

  // 👉 Replace with API (fetch appointments)
  const initialAppointments = [
    { id: 1, name: "Ahmad Mansour", type: "Consultation", time: "09:00 AM", status: "confirmed" },
    { id: 2, name: "Rania Sabbagh", type: "Follow-up", time: "10:30 AM", status: "pending" },
    { id: 3, name: "Maya Haddad", type: "Consultation", time: "01:00 PM", status: "confirmed" },
    { id: 4, name: "Fadi Nasr", type: "New Patient", time: "03:00 PM", status: "pending" },
  ];

  // 👉 Replace with API (fetch patients)
  const initialPatients = [
    { id: 1, name: "Ahmad Mansour", patientId: "P001" },
    { id: 2, name: "Rania Sabbagh", patientId: "P002" },
    { id: 3, name: "Maya Haddad", patientId: "P003" },
    { id: 4, name: "Fadi Nasr", patientId: "P004" },
    { id: 5, name: "Sami Zahr", patientId: "P005" }
  ];

  // 👉 Replace with API (fetch weekly appointments)
  const initialWeeklyAppointments = [
    { id: 1, name: "Ahmad Mansour", type: "Consultation", time: "09:00 AM", status: "confirmed", day: "Today" },
    { id: 2, name: "Rania Sabbagh", type: "Follow-up", time: "10:30 AM", status: "pending", day: "Today" },
    { id: 3, name: "Maya Haddad", type: "Consultation", time: "01:00 PM", status: "confirmed", day: "Today" },
    { id: 4, name: "Fadi Nasr", type: "New Patient", time: "03:00 PM", status: "pending", day: "Today" },
    { id: 5, name: "Sami Zahr", type: "Follow-up", time: "10:00 AM", status: "confirmed", day: "Tomorrow" },
    { id: 6, name: "Layla Mourad", type: "Consultation", time: "02:00 PM", status: "confirmed", day: "Tomorrow" },
    { id: 7, name: "Omar Khalil", type: "New Patient", time: "11:00 AM", status: "pending", day: "Wednesday" },
    { id: 8, name: "Nour Fakih", type: "Follow-up", time: "04:00 PM", status: "confirmed", day: "Thursday" },
  ];

  // 👉 Replace with API (fetch feedback)
  const initialFeedback = [
    { id: 1, patient: "Ahmad Mansour", patientId: 1, rating: 5, comment: "Excellent care, Dr. Khoury explained everything clearly and took time to answer all my questions. I feel much more confident about my treatment plan." },
    { id: 2, patient: "Rania Sabbagh", patientId: 2, rating: 4.5, comment: "Very kind and professional. The appointment was thorough and I appreciated the follow-up recommendations." },
    { id: 3, patient: "Maya Haddad", patientId: 3, rating: 4.8, comment: "Great follow-up care. Dr. Khoury remembered details from my previous visit and provided excellent continuity of care." },
    { id: 4, patient: "Sami Zahr", patientId: 5, rating: 5, comment: "Outstanding physician! Very knowledgeable and compassionate. Made me feel comfortable discussing my concerns." },
  ];

  const [appointments, setAppointments] = useState(initialAppointments);
  const [patients] = useState(initialPatients);
  const [weeklyAppointments] = useState(initialWeeklyAppointments);
  const [feedback] = useState(initialFeedback);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [modal, setModal] = useState(defaultModal);
  const [rescheduleModal, setRescheduleModal] = useState(defaultRescheduleModal);
  const [showAppointments, setShowAppointments] = useState(false);

  const dynamicNotifications = useMemo(() => {
    const notifications = [];
    let id = 1;
    const pendingCount = appointments.filter(a => a.status === "pending").length;
    if (pendingCount > 0) {
      notifications.push({ id: id++, text: `${pendingCount} pending appointment${pendingCount > 1 ? 's' : ''} need${pendingCount === 1 ? 's' : ''} your attention` });
    }
    if (feedback.length > 0) {
      const latestFeedback = feedback[feedback.length - 1];
      notifications.push({ id: id++, text: `New ${latestFeedback.rating}⭐ rating from ${latestFeedback.patient}` });
    }
    const hour = new Date().getHours();
    if (hour < 10) notifications.push({ id: id++, text: "Daily patient summary report is ready" });
    if (appointments.length > 3) notifications.push({ id: id++, text: "Busy day ahead - review today's schedule" });
    return notifications;
  }, [appointments, feedback]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const motivationalByDay = useMemo(() => {
    const messages = [
      "Small steps every day lead to big wins. ✨",
      "Take one patient at a time, you're doing great. 💪",
      "Recharge, then continue making a difference. 🔋",
    ];
    return messages[now.getDay() % messages.length];
  }, [now]); 

  const averageRating = useMemo(() => {
    if (!feedback.length) return 0;
    const sum = feedback.reduce((s, f) => s + f.rating, 0);
    return Math.round((sum / feedback.length) * 10) / 10;
  }, [feedback]);

  const initials = (name) =>
    name ? name.split(" ").map(s => s[0] || "").slice(0, 2).join("").toUpperCase() : "?";

  const renderStars = (value) => {
    const stars = [];
    let remaining = value;
    for (let i = 0; i < 5; i++) {
      if (remaining >= 1) {
        stars.push(<span key={i} className="star full">★</span>);
        remaining -= 1;
      } else if (remaining >= 0.5) {
        stars.push(<span key={i} className="star half">★</span>);
        remaining = 0;
      } else {
        stars.push(<span key={i} className="star empty">☆</span>);
      }
    }
    return stars;
  };

  const handlePatientNavigation = (patientId, event) => {
    event.stopPropagation();
    event.preventDefault();
    setOpenDropdown(null);
    navigate(`/patients/${patientId}`);
  };

  // 👉 Replace with API (send reschedule notification to patient)
  const sendRescheduleNotification = (patientName, patientId, newDate, newTime, appointmentId) => {
    const notification = {
      id: Date.now(),
      type: 'reschedule_request',
      doctorName: doctorName,
      appointmentId: appointmentId,
      newDate: newDate,
      newTime: newTime,
      message: `Dr. ${doctorName.split(' ')[1]} has requested to reschedule your appointment to ${newDate} at ${newTime}. Please approve or decline.`,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    console.log(`Reschedule notification sent to ${patientName} (ID: ${patientId})`, notification);
  };

  const toggleDropdown = (key, event) => {
    if (event) event.stopPropagation();
    setOpenDropdown(prev => (prev === key ? null : key));
    setModal(defaultModal);
  };

  const prepareAction = (apptId, action) => {
    const appt = appointments.find(a => a.id === apptId);
    if (!appt) return;
    if (action === "Reschedule") {
      setRescheduleModal({
        visible: true,
        appointmentId: apptId,
        appointmentName: appt.name,
        newDate: "",
        newTime: ""
      });
      return;
    }
    const text = (() => {
      switch (action) {
        case "Accept": return `Accept appointment for ${appt.name} at ${appt.time}?`;
        case "Decline": return `Decline appointment for ${appt.name}? This will remove it from today's list.`;
        case "Cancel": return `Cancel confirmed appointment for ${appt.name}?`;
        default: return `${action} ${appt.name}?`;
      }
    })();
    setModal({ visible: true, action, appointmentId: apptId, text });
  };

  const resetModal = () => setModal(defaultModal);
  const resetRescheduleModal = () => setRescheduleModal(defaultRescheduleModal);

  // 👉 Replace with API (update appointment status)
  const confirmModal = () => {
    const { action, appointmentId } = modal;
    if (!action || appointmentId == null) {
      resetModal();
      return;
    }
    setAppointments(prev => {
      const copy = [...prev];
      const idx = copy.findIndex(a => a.id === appointmentId);
      if (idx === -1) return copy;
      if (action === "Accept") {
        copy[idx] = { ...copy[idx], status: "confirmed" };
        return copy;
      }
      if (action === "Decline" || action === "Cancel") {
        return copy.filter(a => a.id !== appointmentId);
      }
      return copy;
    });
    resetModal();
  };

  // 👉 Replace with API (reschedule appointment request)
  const confirmReschedule = () => {
    const { appointmentId, appointmentName, newDate, newTime } = rescheduleModal;
    if (!appointmentId || !newDate || !newTime) {
      alert("Please select both date and time");
      return;
    }
    const appointment = appointments.find(a => a.id === appointmentId);
    if (appointment) {
      sendRescheduleNotification(appointmentName, appointmentId, newDate, newTime, appointmentId);
      setAppointments(prev => {
        const copy = [...prev];
        const idx = copy.findIndex(a => a.id === appointmentId);
        if (idx !== -1) {
          copy[idx] = { 
            ...copy[idx], 
            status: "rescheduling",
            pendingDate: newDate,
            pendingTime: newTime
          };
        }
        return copy;
      });
    }
    resetRescheduleModal();
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest('.stat-box') && !event.target.closest('.notif-area')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openDropdown]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpenDropdown(null);
        resetModal();
        resetRescheduleModal();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <p className="greeting">{greeting}, <span className="doctor-highlight">{doctorName}!</span></p>
          <p className="motivational">{motivationalByDay}</p>
          <p className="subtle">{specialty}  -- Date: {now.toLocaleDateString(undefined, { weekday: 'long', month: "long", day: "numeric" })}</p>
        </div>

        <div className="notif-area">
          <button
            className="notif-btn"
            aria-expanded={openDropdown === "notifications"}
            aria-controls="notifications-menu"
            onClick={(e) => toggleDropdown("notifications", e)}
            title={`${dynamicNotifications.length} notifications`}
          >
            🔔
            {dynamicNotifications.length > 0 && (
              <span className="notif-badge">{dynamicNotifications.length}</span>
            )}
          </button>

          {openDropdown === "notifications" && (
            <div id="notifications-menu" className="dropdown-menu notifications-dropdown">
              <h4>Notifications</h4>
              {dynamicNotifications.length ? (
                <ul>
                  {dynamicNotifications.map(n => <li key={n.id}>{n.text}</li>)}
                </ul>
              ) : (
                <p className="muted">No new notifications</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="section-container">
        <div className="stats-card">
          <h3 className="section-title">📊 Overview</h3>
          <section className="stats" aria-label="statistics section">
            <div className="stat-box clickable" onClick={(e) => toggleDropdown("todayAppointments", e)}>
              <div className="stat-top">
                <h3>{appointments.length}</h3>
                <p>Today's Appointments</p>
              </div>
              {openDropdown === "todayAppointments" && (
                <div className="dropdown-menu appointments-dropdown">
                  <div className="dropdown-header">
                    <h4>📅 Today's Detailed Schedule</h4>
                    <span className="appointment-count">{appointments.length} appointments</span>
                  </div>
                  {appointments.length > 0 ? (
                    <div className="appointments-list">
                      {appointments.map(a => (
                        <div key={a.id} className="appointment-item">
                          <div className="appointment-time-badge">{a.time}</div>
                          <div className="appointment-info">
                            <button 
                              className="patient-name-link" 
                              onClick={(e) => handlePatientNavigation(a.id, e)}
                            >
                              <strong>{a.name}</strong>
                            </button>
                            <div className="appointment-meta">
                              <span className="appointment-type">{a.type}</span>
                              <span className={`status-badge ${a.status}`}>{a.status}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-state">No appointments scheduled for today</p>
                  )}
                </div>
              )}
            </div>

            <div className="stat-box clickable" onClick={(e) => toggleDropdown("thisWeek", e)}>
              <div className="stat-top">
                <h3>{weeklyAppointments.length}</h3>
                <p>This Week</p>
              </div>
              {openDropdown === "thisWeek" && (
                <div className="dropdown-menu weekly-dropdown">
                  <div className="dropdown-header">
                    <h4>📋 Weekly Schedule Overview</h4>
                    <span className="appointment-count">{weeklyAppointments.length} total appointments</span>
                  </div>
                  <div className="weekly-appointments">
                    {weeklyAppointments.map(a => (
                      <div key={a.id} className="weekly-appointment-item">
                        <div className="day-badge">{a.day}</div>
                        <div className="appointment-details">
                          <button 
                            className="patient-name-link" 
                            onClick={(e) => handlePatientNavigation(a.id, e)}
                          >
                            <strong>{a.name}</strong>
                          </button>
                          <div className="appointment-info-row">
                            <span className="time">{a.time}</span>
                            <span className="type">{a.type}</span>
                            <span className={`status-badge ${a.status}`}>{a.status}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="stat-box clickable" onClick={(e) => toggleDropdown("totalPatients", e)}>
              <div className="stat-top">
                <h3>{patients.length}</h3>
                <p>Total Patients</p>
              </div>
              {openDropdown === "totalPatients" && (
                <div className="dropdown-menu patients-dropdown">
                  <div className="dropdown-header">
                    <h4>👥 Patient Directory</h4>
                    <span className="patient-count">{patients.length} registered patients</span>
                  </div>
                  <div className="patients-grid">
                    {patients.map((patient) => (
                      <div key={patient.id} className="patient-card">
                        <div className="patient-avatar">{initials(patient.name)}</div>
                        <div className="patient-info">
                          <button 
                            className="patient-name-link" 
                            onClick={(e) => handlePatientNavigation(patient.id, e)}
                          >
                            <strong>{patient.name}</strong>
                          </button>
                          <span className="patient-id">ID: {patient.patientId}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="stat-box clickable" onClick={(e) => toggleDropdown("rating", e)}>
              <div className="stat-top rating-box">
                <div>
                  <div className="rating-value">{averageRating}</div>
                  <div className="rating-stars">{renderStars(averageRating)}</div>
                </div>
                <p>Patient Rating</p>
              </div>
              {openDropdown === "rating" && (
                <div className="dropdown-menu feedback-dropdown">
                  <div className="dropdown-header">
                    <h4>⭐ Patient Feedback</h4>
                    <span className="rating-summary">Average: {averageRating}/5 ({feedback.length} reviews)</span>
                  </div>
                  {feedback.length > 0 ? (
                    <div className="feedback-list">
                      {feedback.map((fb) => (
                        <div key={fb.id} className="feedback-card">
                          <div className="feedback-header">
                            <button 
                              className="patient-name-link" 
                              onClick={(e) => handlePatientNavigation(fb.patientId, e)}
                            >
                              <strong>{fb.patient}</strong>
                            </button>
                            <div className="rating-display">
                              <span className="rating-number">{fb.rating}</span>
                              <div className="rating-stars-small">{renderStars(fb.rating)}</div>
                            </div>
                          </div>
                          <div className="feedback-comment">
                            <p>"{fb.comment}"</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-state">No patient feedback yet</p>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* -------- SECTION 2: Quick Actions Card -------- */}
      <div className="section-container">
        <div className="quick-actions-card">
          <h3 className="section-title">⚡ Quick Actions</h3>
          <section className="quick-actions" aria-label="quick actions">
            <button className="btn main" onClick={() => navigate("/doctor-profile")}>
              <span className="btn-icon">👨‍⚕️</span>
              Update Doctor Profile
            </button>
            <button className="btn mint" onClick={() => setShowAppointments(!showAppointments)}>
              <span className="btn-icon">📅</span>
              {showAppointments ? 'Hide' : 'Show'} Appointments Manager
            </button>
          </section>
        </div>
      </div>

      {/* -------- SECTION 3: Today's Appointments (conditional) -------- */}
      {showAppointments && (
        <div className="section-container">
          <div className="quick-actions-card">
            <section className="appointments" aria-label="appointments list">
              <div className="appointments-header">
                <h3>📋 Today's Appointments <span className="muted small">({appointments.length} total)</span></h3>
                <button className="close-btn" onClick={() => setShowAppointments(false)} title="Hide appointments">
                  ✖️
                </button>
              </div>

              {appointments.length === 0 && (
                <div className="no-appointments">
                  <p className="muted">🎉 No appointments for today. Time to catch up!</p>
                </div>
              )}

              {appointments.map(appt => (
                <div key={appt.id} className="appt-card">
                  <div className="appt-info">
                    <div className="avatar" aria-hidden="true">{initials(appt.name)}</div>
                    <div className="appt-meta">
                      <button
                        className="patient-name"
                        onClick={() => navigate(`/patients/${appt.id}`)}
                        title={`View ${appt.name}'s profile`}
                      >
                        {appt.name}
                      </button>
                      <p className="muted small">{appt.type} · {appt.time}</p>
                      {appt.status === "rescheduling" && appt.pendingDate && (
                        <p className="pending-reschedule">
                          Pending reschedule: {appt.pendingDate} at {appt.pendingTime}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="appt-actions">
                    <span className={`status ${appt.status}`}>
                      {appt.status === "rescheduling" ? "pending reschedule" : appt.status}
                    </span>

                    {appt.status === "confirmed" ? (
                      <>
                        <button className="icon-btn" title="Reschedule appointment" onClick={() => prepareAction(appt.id, "Reschedule")}>
                          ⏰
                        </button>
                        <button className="icon-btn" title="Cancel appointment" onClick={() => prepareAction(appt.id, "Cancel")}>
                          ❌
                        </button>
                      </>
                    ) : appt.status === "rescheduling" ? (
                      <button className="icon-btn" title="Waiting for patient approval" disabled>
                        ⏳
                      </button>
                    ) : (
                      <>
                        <button className="icon-btn" title="Accept appointment" onClick={() => prepareAction(appt.id, "Accept")}>
                          ✅
                        </button>
                        <button className="icon-btn" title="Decline appointment" onClick={() => prepareAction(appt.id, "Decline")}>
                          ❌
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </section>
          </div>
        </div>
      )}

      {/* Regular Modal (confirmation) */}
      {modal.visible && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal">
            <h3 id="modal-title">Confirm {modal.action}</h3>
            <p>{modal.text}</p>
            <div className="modal-actions">
              <button className="btn main" onClick={confirmModal}>
                Yes, Confirm
              </button>
              <button className="btn coral" onClick={resetModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleModal.visible && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="reschedule-modal-title">
          <div className="modal reschedule-modal">
            <h3 id="reschedule-modal-title">Reschedule Appointment</h3>
            <p>Reschedule appointment for <strong>{rescheduleModal.appointmentName}</strong></p>
            
            <div className="reschedule-form">
              <div className="form-group">
                <label htmlFor="new-date">New Date:</label>
                <input
                  id="new-date"
                  type="date"
                  min={getMinDate()}
                  value={rescheduleModal.newDate}
                  onChange={(e) => setRescheduleModal(prev => ({...prev, newDate: e.target.value}))}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="new-time">New Time:</label>
                <select
                  id="new-time"
                  value={rescheduleModal.newTime}
                  onChange={(e) => setRescheduleModal(prev => ({...prev, newTime: e.target.value}))}
                >
                  <option value="">Select time</option>
                  <option value="08:00 AM">08:00 AM</option>
                  <option value="08:30 AM">08:30 AM</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="09:30 AM">09:30 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="01:00 PM">01:00 PM</option>
                  <option value="01:30 PM">01:30 PM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="02:30 PM">02:30 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="03:30 PM">03:30 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                  <option value="05:00 PM">05:00 PM</option>
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="btn main" 
                onClick={confirmReschedule}
                disabled={!rescheduleModal.newDate || !rescheduleModal.newTime}
              >
                Send Reschedule Request
              </button>
              <button className="btn coral" onClick={resetRescheduleModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;