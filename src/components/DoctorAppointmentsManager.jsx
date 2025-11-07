import React from "react";
import { getStatusMeta } from "../utils/offlineAppointments";

const DoctorAppointmentsManager = ({
  appointments,
  onAppointmentAction,
  onPatientNavigation,
  onHideAppointments,
}) => {
  const initials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

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
          appointments.map((apt) => {
            const statusMeta = apt.statusMeta || getStatusMeta(apt.status);
            const badgeClass = statusMeta.badgeClass || "pending";
            const statusLabel = statusMeta.label || apt.status || "Pending";
            const canReschedule = Boolean(statusMeta.allowReschedule);
            const canCancel = Boolean(statusMeta.allowCancel);
            const isRequested = apt.status === "REQUESTED";

            return (
              <div key={apt.id} className="appt-card">
              <div className="appt-info">
                <div className="avatar">{initials(apt.patientName)}</div>
                <div className="appt-meta">
                    <button
                      className="patient-name"
                      onClick={() =>
                        onPatientNavigation && onPatientNavigation(apt.patientId)
                      }
                    >
                      {apt.patientName}
                    </button>
                    <p className="muted small">
                      {(apt.type || "Consultation")} · {apt.time}
                    </p>
                    {apt.status === "rescheduling" && apt.pendingDate && (
                      <p className="pending-reschedule">
                        Pending: {apt.pendingDate} at {apt.pendingTime}
                      </p>
                    )}
                </div>
              </div>

              <div className="appt-actions">
                  <span className={`status ${badgeClass}`}>{statusLabel}</span>

                  {isRequested ? (
                    <>
                      <button
                        className="icon-btn"
                        onClick={() => onAppointmentAction && onAppointmentAction(apt.id, "Accept")}
                      >
                        ✅
                      </button>
                      <button
                        className="icon-btn"
                        onClick={() => onAppointmentAction && onAppointmentAction(apt.id, "Decline")}
                      >
                        ❌
                      </button>
                    </>
                  ) : canReschedule || canCancel ? (
                    <>
                      <button
                        className="icon-btn"
                        disabled={!canReschedule}
                        onClick={() =>
                          canReschedule &&
                          onAppointmentAction &&
                          onAppointmentAction(apt.id, "Reschedule")
                        }
                      >
                        ⏰
                      </button>
                      <button
                        className="icon-btn"
                        disabled={!canCancel}
                        onClick={() =>
                          canCancel &&
                          onAppointmentAction &&
                          onAppointmentAction(apt.id, "Cancel")
                        }
                      >
                        🗑️
                      </button>
                    </>
                  ) : (
                    <span className="muted small">No further actions</span>
                  )}
              </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
};

export default DoctorAppointmentsManager;