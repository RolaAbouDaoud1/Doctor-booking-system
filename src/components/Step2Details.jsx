const Step2Details = ({
  appointment,
  setAppointment,
  nextStep,
  prevStep,
  doctor,
  doctorLoading,
  doctorError,
}) => {
  const doctorName = doctor?.fullName || doctor?.name || "Dr. Layla Khoury";
  const doctorSpecialty =
    (doctor?.specialties && (doctor.specialties[0]?.name || doctor.specialties[0])) || "Cardiology";
  const doctorPrice = doctor?.price || "$150";
  const doctorInitials = doctor?.initials
    ? doctor.initials
    : doctorName
        .split(" ")
        .filter(Boolean)
        .map((word) => word[0].toUpperCase())
        .slice(0, 2)
        .join("") || "DR";

  return (
    <div className="appointment-container">
      <div className="book-card">
        <button className="back-btn" onClick={prevStep}>←</button>
        <h2 className="title">Book Appointment</h2>
        <div className="dots">
          <span className="dot"></span>
          <span className="dot active"></span>
          <span className="dot"></span>
        </div>
      </div>

      <div className="appointment-main-content">
        {/* Doctor Info Card - Left Side */}
        <div className="doctor-info">
          <div className="avatar">{doctorInitials}</div>
          <div className="doc-details">
            <h3>
              {doctorLoading ? "Loading..." : doctorError ? "Doctor unavailable" : doctorName}
            </h3>
            <small>
              {doctorLoading ? "Fetching specialty..." : doctorError ? "Unknown specialty" : doctorSpecialty}
            </small>
          </div>
          <div className="price">{doctorPrice}</div>
          
          {/* Cancellation Policy */}
          <div className="cancellation-policy">
            <div className="info-icon">i</div>
            <span>Cancellation Policy</span>
            <div className="policy-tooltip">
              <h4>Booking & Cancellation Policy</h4>
              <p>
                Free cancellation up to 24 hours before your appointment. Late cancellations or no-shows may incur a fee. Please arrive 10 minutes early for your scheduled time.
              </p>
            </div>
          </div>
        </div>

        {/* Appointment Details - Right Side */}
        <div className="appointment-sections">
          <div className="section">
            <h4 className="section-title">Appointment Details</h4>

            <label>Reason for Visit *</label>
            <input
              className="inputtt"
              type="text"
              value={appointment.reason || ""}
              onChange={(e) => setAppointment({ ...appointment, reason: e.target.value })}
              placeholder="e.g. Regular checkup, chest pain, follow up"
            />

            <label>Current Symptoms</label>
            <input
              className="inputtt"
              type="text"
              value={appointment.symptoms || ""}
              onChange={(e) => setAppointment({ ...appointment, symptoms: e.target.value })}
              placeholder="Describe any symptoms you're experiencing"
            />

            <label>Case Type *</label>
            <select
              className="inputtt"
              value={appointment.caseType || ""}
              onChange={(e) => setAppointment({ ...appointment, caseType: e.target.value })}
            >
              <option value="">Select Case Type</option>
              <option value="GENERAL_CHECKUP">General Checkup</option>
              <option value="BLOOD_TEST">Blood Test</option>
              <option value="FOLLOW_UP">Follow-up</option>
              <option value="OTHER">Other</option>
            </select>

            <label>Priority *</label>
            <select
              className="inputtt"
              value={appointment.priority || "MEDIUM"}
              onChange={(e) => setAppointment({ ...appointment, priority: e.target.value })}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>

            <label>Additional Notes</label>
            <textarea
              className="textareaa"
              value={appointment.notes || ""}
              onChange={(e) => setAppointment({ ...appointment, notes: e.target.value })}
              placeholder="Any additional information for the doctor..."
            ></textarea>
          </div>

          <button className="next-btn" onClick={nextStep}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step2Details;