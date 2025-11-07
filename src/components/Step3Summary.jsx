import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
const Step3Summary = ({ appointment, prevStep }) => {
 
  const navigate = useNavigate();
  const { doctorId } = useParams();
  const baseurl= "http://localhost:8080";
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await fetch(`${baseurl}/api/doctors/${doctorId}`,{method:'POST'});
        if (!response.ok) throw new Error("Failed to fetch doctor data");

        const data = await response.json();
        console.log("Doctor details:", data);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    if (doctorId) fetchDoctor();
  }, [doctorId]);
  
  const handleConfirm = async () => {
    const storedDoctorId = localStorage.getItem("doctorId") || doctorId;
    const patientId = localStorage.getItem("patientId");

    const start = new Date(`${appointment.date} ${appointment.time}`);
    const end = new Date(start.getTime() + 30 * 60000);

    const requestBody = {
      caseType: appointment.caseType || "CHECKUP",
      doctorId: storedDoctorId,
      patientId,
      slot: {
        id: "string",
        doctorId: storedDoctorId,
        start: start.toISOString(),
        end: end.toISOString(),
        booked: true,
      },
      status: "REQUESTED",
      notes: appointment.notes || "",
      priority: appointment.priority || "MEDIUM",
    }
    try {
      const response = await fetch("http://localhost:8080/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        alert("✅ Appointment Confirmed and sent to the server!");
        navigate("/DoctorProfile");
        }
       else {
        alert("⚠️ Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error sending appointment:", error);
      alert("❌ Failed to send appointment to the backend.");
    }
  };

  return (
    <div className="appointment-container">
      <div className="book-card">
        <button className="back-btn" onClick={prevStep}>←</button>
        <h2 className="title">Book Appointment</h2>
        <div className="dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot active"></span>
        </div>
      </div>

      <div className="doctor-info">
        <div className="avatar">LK</div>
        <div className="doc-details">
          <h3>Dr. Layla Khoury</h3>
          <small className="small">Cardiology</small>
        </div>
        <div className="price">$150</div>
      </div>

      <div className="section">
        <h4 className="section-title">Appointment Summary</h4>
        <div className="summary-row"><span>Date & Time</span><p>{appointment.date} , {appointment.time}</p></div>
        <div className="summary-row"><span>Doctor</span><p>{appointment.doctor || "Dr. Layla Khoury"}</p></div>
        <div className="summary-row"><span>Reason</span><p>{appointment.reason || "—"}</p></div>
        <div className="summary-row"><span>Symptoms</span><p>{appointment.symptoms || "—"}</p></div>
        <div className="summary-row"><span>Notes</span><p>{appointment.notes || "—"}</p></div>
        <div className="summary-row"><span>Consultation Fee</span><p>$150</p></div>
      </div>

      <div className="payment">
        <input type="checkbox" checked readOnly />
        <div>
          <p className="payment-title">Payment on Visit</p>
          <p className="payment-sub">You can pay when you visit the doctor</p>
        </div>
      </div>

      <div className="buttons">
        <button className="confirm-btn" onClick={handleConfirm}>
          Confirm Booking
        </button>
      </div>
    </div>
  );
}

export default Step3Summary;


