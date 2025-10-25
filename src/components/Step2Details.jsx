import React from "react";

const Step2Details = ({ appointment, setAppointment, nextStep, prevStep }) => {
  return (
    <div className="appointment-container">
      <div className="book-header">
        <button className="back-btn" onClick={prevStep}>←</button>
        <h2 className="title">Book Appointment</h2>
        <div className="dots">
          <span className="dot"></span>
          <span className="dot active"></span>
          <span className="dot"></span>
        </div>
      </div>

      <div className="appointment-content">
        <div className="doctor-info-wrapper">
        <div className="doctor-info-card">
        <div className="doctor-card-inner">
       <div className="avatar">LK</div>
       <div className="doc-details">
        <h3>{appointment.doctorName || "Dr. Layla Khoury"}</h3>
        <small>Cardiology</small>
    </div>
    <div className="doctor-divider"></div>
    </div>
  
     <div className="price-box">
      <div className="price">$150</div>
      <div className="price-label">Consultation Fee</div>
      </div>
     </div>
          
          <div className="cancellation-policy">
            <div className="info-icon">i</div>
            <span>Cancellation Policy</span>
            <div className="policy-tooltip">
              <h4>Cancellation Policy</h4>
              <p>No charges for cancellations made 24 hours in advance. Late cancellations (less than 24 hours notice) are subject to a 50% consultation fee.</p>
            </div>
          </div>
        </div>

        <div className="selection-area">
          <div className="section animate-in">
            <h4 className="section-title">Appointment Details</h4>

            <label>Reason for Visit *</label>
            <input
              className="input-field"
              type="text"
              value={appointment.reason}
              onChange={(e) => setAppointment({ ...appointment, reason: e.target.value })}
              placeholder="e.g. Regular checkup, chest pain, follow up"
            />

            <label>Current Symptoms</label>
            <input
              className="input-field"
              type="text"
              value={appointment.symptoms}
              onChange={(e) => setAppointment({ ...appointment, symptoms: e.target.value })}
              placeholder="Describe any symptoms you're experiencing"
            />

            <label>Additional Notes</label>
            <textarea
              className="textareaa"
              value={appointment.notes}
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