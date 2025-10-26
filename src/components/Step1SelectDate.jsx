import { useEffect, useState } from "react";

const Step1SelectDate = ({ appointment, setAppointment, nextStep, prevStep = () => window.history.back() }) => {
  const [times, setTimes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const timeSlots = [
      "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
      "11:00 AM", "11:30 AM", "2:00 PM", "2:30 PM",
      "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
      "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM"
    ];
    setTimes(timeSlots);
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateSelect = (date) => {
    if (date) {
      setSelectedDate(date);
      setAppointment({ ...appointment, date: date.toDateString() });
    }
  };

  const handleTimeSelect = (time) => {
    setAppointment({ ...appointment, time });
  };

  const handleNext = () => {
    if (!appointment.date || !appointment.time) {
      setModalMessage("Please select both date and time");
      setShowModal(true);
      return;
    }
    nextStep();
  };

  const days = getDaysInMonth(currentMonth);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="appointment-container">
      <div className="book-header">
        <button className="back-btn" onClick={prevStep}>←</button>
        <div style={{ width: "44px" }}></div>
        <h2 className="title">Book Appointment</h2>
        <div className="dots">
          <span className="dot active"></span>
          <span className="dot"></span>
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
          {!appointment.date ? (
            <div className="section animate-in">
              <h4 className="section-title">Select Date</h4>
              
              <div className="calendar-header">
                <button className="calendar-nav-btn" onClick={handlePrevMonth}>‹</button>
                <div className="calendar-month">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </div>
                <button className="calendar-nav-btn" onClick={handleNextMonth}>›</button>
              </div>

              <div className="calendar-grid">
                <div className="calendar-day-header">Sun</div>
                <div className="calendar-day-header">Mon</div>
                <div className="calendar-day-header">Tue</div>
                <div className="calendar-day-header">Wed</div>
                <div className="calendar-day-header">Thu</div>
                <div className="calendar-day-header">Fri</div>
                <div className="calendar-day-header">Sat</div>
                
                {days.map((date, index) => {
                  if (!date) {
                    return <div key={index} className="calendar-day empty"></div>;
                  }
                  const isPast = date < today;
                  const isSelected = selectedDate && 
                    date.toDateString() === selectedDate.toDateString();
                  
                  return (
                    <button
                      key={index}
                      className={`calendar-day ${isPast ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
                      onClick={() => !isPast && handleDateSelect(date)}
                      disabled={isPast}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="section animate-in">
              <div className="section-header">
                <h4 className="section-title">Select Time Slot</h4>
                <button className="change-date-btn" onClick={() => {
                  setAppointment({ ...appointment, date: "", time: "" });
                  setSelectedDate(null);
                }}>
                  Change Date
                </button>
              </div>
              
              <div className="selected-date-display">
                {appointment.date}
              </div>
              
              <div className="time-grid">
                {times.map((time, index) => (
                  <button
                    key={index}
                    className={`time-btn ${appointment.time === time ? "active" : ""}`}
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button className="next-btn" onClick={handleNext}>
            Next
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon error">!</div>
            <h3 className="modal-title">Incomplete Selection</h3>
            <p className="modal-message">{modalMessage}</p>
            <button className="modal-btn" onClick={() => setShowModal(false)}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step1SelectDate;