import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { saveLocalAppointment } from "../utils/offlineAppointments";

const Step3Summary = ({ appointment, prevStep, doctor, doctorId }) => {
  const navigate = useNavigate();
  const params = useParams();
  const resolvedDoctorId = useMemo(() => {
    // For offline MVP: prioritize localStorage doctorId (set when doctor logs in)
    // This ensures the appointment is saved with the same ID the doctor will use to view it
    return (
      localStorage.getItem("doctorId") || // Check localStorage first for MVP testing
      doctor?.id ||
      doctor?.doctorId ||
      doctorId ||
      params.doctorId ||
      params.id ||
      null
    );
  }, [doctor?.doctorId, doctor?.id, doctorId, params.doctorId, params.id]);

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

  const buildDateFromSelection = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return null;
    const trimmed = String(timeStr).trim();

    // if ISO string
    const isoCandidate = trimmed.includes("T") ? new Date(trimmed) : null;
    if (isoCandidate && !Number.isNaN(isoCandidate.getTime())) return isoCandidate;

    const ampmMatch = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    let hours;
    let minutes;
    if (ampmMatch) {
      hours = parseInt(ampmMatch[1], 10);
      minutes = parseInt(ampmMatch[2], 10);
      const period = ampmMatch[3].toUpperCase();
      if (period === "PM" && hours < 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
    } else {
      const hhmmMatch = trimmed.match(/^(\d{1,2}):(\d{2})$/);
      if (hhmmMatch) {
        hours = parseInt(hhmmMatch[1], 10);
        minutes = parseInt(hhmmMatch[2], 10);
      }
    }

    if (hours === undefined || minutes === undefined) {
      const fallbackDate = new Date(`${dateStr} ${trimmed}`);
      if (!Number.isNaN(fallbackDate.getTime())) return fallbackDate;
      return null;
    }

    const composed = new Date(`${dateStr}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`);
    if (Number.isNaN(composed.getTime())) return null;
    return composed;
  };

  const handleConfirm = async () => {
    const patientId = localStorage.getItem("patientId");
    
    // ✅ Get patient name from multiple sources with priority
    let patientName = "Patient";
    try {
      // Priority 1: Check localStorage for fullName
      const storedFullName = localStorage.getItem("fullName");
      if (storedFullName && storedFullName !== "User" && storedFullName !== "Patient") {
        patientName = storedFullName;
      } else {
        // Priority 2: Check patientTotal in localStorage (from registration)
        const patientTotal = localStorage.getItem("patientTotal");
        if (patientTotal) {
          try {
            const parsed = JSON.parse(patientTotal);
            if (parsed.fullName && parsed.fullName !== "User" && parsed.fullName !== "Patient") {
              patientName = parsed.fullName;
            } else if (parsed.username && parsed.username !== "User" && parsed.username !== "Patient") {
              patientName = parsed.username;
            }
          } catch (e) {
            console.warn("Could not parse patientTotal:", e);
          }
        }
        
        // Priority 3: Check username in localStorage
        if (patientName === "Patient") {
          const storedUsername = localStorage.getItem("username");
          if (storedUsername && storedUsername !== "User" && storedUsername !== "Patient") {
            patientName = storedUsername;
          }
        }
      }
    } catch (error) {
      console.warn("Error getting patient name, using fallback:", error);
      const fallback = localStorage.getItem("username");
      if (fallback && fallback !== "User") {
        patientName = fallback;
      }
    }
    
    const targetDoctorId = resolvedDoctorId;

    // Debug for MVP testing
    console.log("📋 Booking Appointment:");
    console.log("  - Patient ID:", patientId);
    console.log("  - Patient Name:", patientName);
    console.log("  - Doctor ID:", targetDoctorId);
    console.log("  - Doctor ID in localStorage:", localStorage.getItem("doctorId"));

    if (!patientId || !targetDoctorId) {
      alert("Missing doctor or patient information. Please try again.");
      return;
    }

    const start = buildDateFromSelection(appointment.date, appointment.time);
    if (!start) {
      alert("Invalid date/time selection. Please re-select a slot.");
      return;
    }
    const end = new Date(start.getTime() + 30 * 60000);

    const resolvedSlotId =
      appointment.slotId ||
      `local-slot-${targetDoctorId || "doc"}-${start.getTime()}`;

    const requestBody = {
      caseType: appointment.caseType || "GENERAL_CHECKUP",
      doctorId: targetDoctorId,
      patientId,
      slotId: resolvedSlotId,
      slot: {
        id: resolvedSlotId,
        doctorId: targetDoctorId,
        start: start.toISOString(),
        end: end.toISOString(),
        booked: true,
      },
      status: "REQUESTED",
      notes: appointment.notes || "",
      priority: appointment.priority || "MEDIUM",
    };

    const localRecord = {
      ...requestBody,
      patientId,
      patientName,
      doctorId: targetDoctorId,
      doctorName,
      doctorSpecialty,
      doctorPrice,
      savedAt: new Date().toISOString(),
      source: "frontend",
      status: "REQUESTED",
      error: null,
      date: appointment.date,
      time: appointment.time,
      timeLabel: appointment.timeLabel,
      reason: appointment.reason || "",
      symptoms: appointment.symptoms || "",
      isOffline: true,
    };

    const saved = saveLocalAppointment(localRecord);

    if (saved) {
      console.info("Appointment stored offline", saved);
      navigate("/patient-dashboard", { replace: true, state: { offlineSaved: true } });
    } else {
      alert("❌ Failed to store appointment locally. Please try again.");
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
        <div className="avatar">{doctorInitials}</div>
        <div className="doc-details">
          <h3>{doctorName}</h3>
          <small className="small">{doctorSpecialty}</small>
        </div>
        <div className="price">{doctorPrice}</div>
      </div>

      <div className="section">
        <h4 className="section-title">Appointment Summary</h4>
        <div className="summary-row"><span>Date & Time</span><p>{appointment.date} , {appointment.timeLabel || appointment.time}</p></div>
        <div className="summary-row"><span>Doctor</span><p>{doctorName}</p></div>
        <div className="summary-row"><span>Reason</span><p>{appointment.reason || "—"}</p></div>
        <div className="summary-row"><span>Symptoms</span><p>{appointment.symptoms || "—"}</p></div>
        <div className="summary-row"><span>Notes</span><p>{appointment.notes || "—"}</p></div>
        <div className="summary-row"><span>Consultation Fee</span><p>{doctorPrice}</p></div>
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