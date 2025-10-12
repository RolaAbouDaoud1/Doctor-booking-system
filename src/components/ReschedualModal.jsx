import React from "react";

const RescheduleModal = ({ 
  visible, 
  appointmentName, 
  newDate, 
  newTime, 
  onConfirm, 
  onCancel, 
  onDateChange, 
  onTimeChange 
}) => {
  if (!visible) return null;

  const getMinDate = () => new Date().toISOString().split('T')[0];

  return (
    <div className="modal-overlay">
      <div className="modal reschedule-modal">
        <h3>Reschedule Appointment</h3>
        <p>Reschedule appointment for <strong>{appointmentName}</strong></p>
        
        <div className="reschedule-form">
          <div className="form-group">
            <label>New Date:</label>
            <input
              type="date"
              min={getMinDate()}
              value={newDate}
              onChange={onDateChange}
            />
          </div>
          
          <div className="form-group">
            <label>New Time:</label>
            <select value={newTime} onChange={onTimeChange}>
              <option value="">Select time</option>
              <option value="08:00 AM">08:00 AM</option>
              <option value="09:00 AM">09:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="12:00 PM">12:00 PM</option>
              <option value="01:00 PM">01:00 PM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="03:00 PM">03:00 PM</option>
              <option value="04:00 PM">04:00 PM</option>
              <option value="05:00 PM">05:00 PM</option>
            </select>
          </div>
        </div>

        <div className="modal-actions">
          <button 
            className="btn main" 
            onClick={onConfirm}
            disabled={!newDate || !newTime}
          >
            Send Reschedule Request
          </button>
          <button className="btn coral" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default RescheduleModal;