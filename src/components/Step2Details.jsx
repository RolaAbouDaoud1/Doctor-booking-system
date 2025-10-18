import React from "react";

const Step2Details = ({ appointment, setAppointment, nextStep , prevStep }) => {
  return (
    <div className="appointment-container">
    <div className="book-card">
      <button className="back-btn" onClick={prevStep}
     >← </button>
      <h2 className="title">Book Appointment</h2>
         <div className="dots">
              <span className="dot"></span>
              <span className="dot active"></span>
              <span className="dot"></span>
           </div>
  </div>

      <div className="doctor-info">
        <div className="avatar">LK</div>
        <div className="doc-details">
          <h3 className="name-doc">Dr. Layla Khoury</h3>
          <small>Cardiology</small>
        </div>
        <div className="price">$150</div>
      </div>


<div className="section">
      <h4 className="section-title">Appointment Details</h4>

      <label>Reason for Visit *</label>
      <input className="inputtt"
        type="text"
        value={appointment.reason}
        onChange={(e) => setAppointment({ ...appointment, reason: e.target.value })}
        placeholder="e.g. Regularcheckup,chest pain,follow up"
      />

      <label>Current Symptoms</label>
      <input className="inputtt"
        type="text"
        value={appointment.symptoms}
        onChange={(e) => setAppointment({ ...appointment, symptoms: e.target.value })}
        placeholder="Describe any symptoms you're experience" 
      />

      <label>Additional Notes</label>
      <textarea className="textareaa"
        value={appointment.notes}
        onChange={(e) => setAppointment({ ...appointment, notes: e.target.value })}
        placeholder="Any additional information for the doctor..."
      ></textarea>
</div>

      <div className="buttons">
        
        <button className="next-btn" onClick={nextStep}>Next</button>
      </div>
    </div>
    
  );
};

export default Step2Details;