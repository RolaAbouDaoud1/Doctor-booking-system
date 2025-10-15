import React from "react";

const DoctorAppointmentsManager = ({ 
  appointments, 
  onAppointmentAction, 
  onPatientNavigation,
  onHideAppointments 
}) => {
  const initials = (name) => name.split(" ").map(s => s[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="quick-actions-card">
      <section className="appointments">
        <div className="appointments-header">
          <h3>📋 Today's Appointments <span className="muted small">({appointments.length})</span></h3>
          <button className="close-btn" onClick={onHideAppointments}>✖️</button>
        </div>

        {appointments.length === 0 ? (
          <div className="no-appointments">
            <p className="muted">🎉 No appointments today</p>
          </div>
        ) : (
          appointments.map(apt => (
            <div key={apt.id} className="appt-card">
              <div className="appt-info">
                <div className="avatar">{initials(apt.patientName)}</div>
                <div className="appt-meta">
                  <button className="patient-name" onClick={() => onPatientNavigation(apt.patientId)}>
                    {apt.patientName}
                  </button>
                  <p className="muted small">{apt.type} · {apt.time}</p>
                  {apt.status === "rescheduling" && apt.pendingDate && (
                    <p className="pending-reschedule">
                      Pending: {apt.pendingDate} at {apt.pendingTime}
                    </p>
                  )}
                </div>
              </div>

              <div className="appt-actions">
                <span className={`status ${apt.status}`}>
                  {apt.status === "rescheduling" ? "pending reschedule" : apt.status}
                </span>

                {apt.status === "confirmed" ? (
                  <>
                    <button className="icon-btn" onClick={() => onAppointmentAction(apt.id, "Reschedule")}>⏰</button>
                    <button className="icon-btn" onClick={() => onAppointmentAction(apt.id, "Cancel")}>❌</button>
                  </>
                ) : apt.status === "rescheduling" ? (
                  <button className="icon-btn" disabled>⏳</button>
                ) : (
                  <>
                    <button className="icon-btn" onClick={() => onAppointmentAction(apt.id, "Accept")}>✅</button>
                    <button className="icon-btn" onClick={() => onAppointmentAction(apt.id, "Decline")}>❌</button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default DoctorAppointmentsManager;