import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { saveLocalAppointment } from "../utils/offlineAppointments";

const Step3Summary = ({ appointment, prevStep, doctor, doctorId }) => {
  const navigate = useNavigate();
  const params = useParams();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("ON_VISIT");
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolder: ""
  });

  const resolvedDoctorId = useMemo(() => {
    return (
      localStorage.getItem("doctorId") ||
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

  const handleCardInfoChange = (field, value) => {
    setCardInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConfirm = async () => {
    // Validate card info if paying with card
    if ((paymentMethod === "VISA" || paymentMethod === "OMT") && !isCardInfoValid()) {
      alert("Please fill in all card details correctly.");
      return;
    }

    const patientId = localStorage.getItem("patientId");
    
    let patientName = "Patient";
    try {
      const storedFullName = localStorage.getItem("fullName");
      if (storedFullName && storedFullName !== "User" && storedFullName !== "Patient") {
        patientName = storedFullName;
      } else {
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

    console.log("📋 Booking Appointment:");
    console.log("  - Patient ID:", patientId);
    console.log("  - Patient Name:", patientName);
    console.log("  - Doctor ID:", targetDoctorId);
    console.log("  - Payment Method:", paymentMethod);

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
      paymentMethod,
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
      paymentMethod,
    };

    const saved = saveLocalAppointment(localRecord);

    if (saved) {
      console.info("Appointment stored offline", saved);
      navigate("/patient-dashboard", { replace: true, state: { offlineSaved: true } });
    } else {
      alert("❌ Failed to store appointment locally. Please try again.");
    }
  };

  const isCardInfoValid = () => {
    const cardNumberClean = cardInfo.cardNumber.replace(/\s/g, '');
    // Lebanese cards: Visa (16 digits, CVV 3), Mastercard (16 digits, CVV 3)
    return (
      cardNumberClean.length === 16 &&
      cardInfo.expiryDate.length === 5 &&
      cardInfo.cvv.length === 3 &&
      cardInfo.cardHolder.trim().length > 0
    );
  };

  const getPaymentMethodLabel = () => {
    switch (paymentMethod) {
      case "OMT":
        return "OMT Card";
      case "VISA":
        return "Visa/Mastercard";
      case "ON_VISIT":
        return "Pay on Visit";
      default:
        return "Select Payment";
    }
  };

  // Format card number with spaces (Lebanese standard: 4-4-4-4)
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    return parts.length ? parts.join(' ') : value;
  };

  // Format expiry date MM/YY
  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return value;
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

      <div className="appointment-main-content">
        {/* Doctor Info Card - Left Side */}
        <div className="doctor-info">
          <div className="avatar">{doctorInitials}</div>
          <div className="doc-details">
            <h3>{doctorName}</h3>
            <small>{doctorSpecialty}</small>
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

        {/* Summary - Right Side */}
        <div className="appointment-sections">
          <div className="section">
            <h4 className="section-title">Appointment Summary</h4>
            <div className="summary-row">
              <span>Date & Time</span>
              <p>{appointment.date}, {appointment.timeLabel || appointment.time}</p>
            </div>
            <div className="summary-row">
              <span>Doctor</span>
              <p>{doctorName}</p>
            </div>
            <div className="summary-row">
              <span>Specialty</span>
              <p>{doctorSpecialty}</p>
            </div>
            <div className="summary-row">
              <span>Reason</span>
              <p>{appointment.reason || "—"}</p>
            </div>
            <div className="summary-row">
              <span>Symptoms</span>
              <p>{appointment.symptoms || "—"}</p>
            </div>
            <div className="summary-row">
              <span>Case Type</span>
              <p>{appointment.caseType || "—"}</p>
            </div>
            <div className="summary-row">
              <span>Priority</span>
              <p>{appointment.priority || "—"}</p>
            </div>
            {appointment.notes && (
              <div className="summary-row">
                <span>Notes</span>
                <p>{appointment.notes}</p>
              </div>
            )}
            <div className="summary-row">
              <span>Consultation Fee</span>
              <p>{doctorPrice}</p>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="section payment-form-section">
            <h4 className="section-title">Payment Method</h4>
            
            {paymentMethod ? (
              <div className="payment-gateway-selected">
                <span>Selected:</span>
                <strong>{getPaymentMethodLabel()}</strong>
                <button
                  className="change-payment-btn"
                  onClick={() => setShowPaymentModal(true)}
                >
                  Change
                </button>
              </div>
            ) : (
              <button
                className="next-btn"
                onClick={() => setShowPaymentModal(true)}
                style={{ marginBottom: "20px" }}
              >
                Select Payment Method
              </button>
            )}

            {/* Card Information Form - Lebanese Format */}
            {(paymentMethod === "VISA" || paymentMethod === "OMT") && (
              <div className="card-info-section">
                <div className="card-header">
                  <div className="card-icon">💳</div>
                  <h5 className="card-section-title">Enter Card Details</h5>
                </div>
                
                <div className="card-form">
                  <div className="form-group-card">
                    <label className="form-label">
                      <span>Card Number (16 digits)</span>
                      <span className="label-icon">🔒</span>
                    </label>
                    <input
                      type="text"
                      value={cardInfo.cardNumber}
                      onChange={(e) => handleCardInfoChange('cardNumber', formatCardNumber(e.target.value))}
                      maxLength={19}
                      className="card-input"
                      placeholder="1234 5678 9012 3456"
                    />
                    <small className="input-hint">Visa or Mastercard issued by Lebanese banks</small>
                  </div>

                  <div className="form-row-card">
                    <div className="form-group-card">
                      <label className="form-label">Expiry Date</label>
                      <input
                        type="text"
                        value={cardInfo.expiryDate}
                        onChange={(e) => handleCardInfoChange('expiryDate', formatExpiryDate(e.target.value))}
                        maxLength={5}
                        className="card-input"
                        placeholder="MM/YY"
                      />
                    </div>

                    <div className="form-group-card">
                      <label className="form-label">
                        <span>CVV (3 digits)</span>
                        <span className="help-tooltip" title="3-digit code on back of card">?</span>
                      </label>
                      <input
                        type="password"
                        value={cardInfo.cvv}
                        onChange={(e) => handleCardInfoChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 3))}
                        maxLength={3}
                        className="card-input"
                        placeholder="123"
                      />
                    </div>
                  </div>

                  <div className="form-group-card">
                    <label className="form-label">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardInfo.cardHolder}
                      onChange={(e) => handleCardInfoChange('cardHolder', e.target.value.toUpperCase())}
                      className="card-input"
                      placeholder="Enter your name"
                      style={{ textTransform: 'uppercase' }}
                    />
                    <small className="input-hint">Name as it appears on card</small>
                  </div>

                  <div className="card-security-note">
                    <span className="security-icon">🛡️</span>
                    <span>Your payment information is encrypted and secure. We support all Lebanese bank cards (Visa & Mastercard).</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button className="confirm-btn" onClick={handleConfirm}>
            Confirm Booking
          </button>
        </div>
      </div>

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content payment-gateway-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">💳</div>
            <h3 className="modal-title">Select Payment Method</h3>
            <p className="modal-message">Choose how you'd like to pay for your consultation</p>

            <div className="payment-gateways">
              <button
                className="payment-gateway-btn"
                onClick={() => {
                  setPaymentMethod("OMT");
                  setShowPaymentModal(false);
                }}
                style={{ borderColor: paymentMethod === "OMT" ? "#0f766e" : "" }}
              >
                <div 
                  className="payment-gateway-logo" 
                  style={{ 
                    color: "#FFD700",
                    fontSize: "2rem", 
                    fontWeight: "bold",
                  }}
                >
                  OMT
                </div>
                <span style={{ color: "#B8860B", fontWeight: "bold" }}>OMT Card</span>
              </button>

              <button
                className="payment-gateway-btn"
                onClick={() => {
                  setPaymentMethod("VISA");
                  setShowPaymentModal(false);
                }}
                style={{ borderColor: paymentMethod === "VISA" ? "#0f766e" : "" }}
              >
                <div 
                  className="payment-gateway-logo" 
                  style={{ 
                    color: "#1A1F71",
                    fontSize: "1.5rem", 
                    fontWeight: "bold",
                  }}
                >
                  VISA
                </div>
                <span style={{ color: "#1A1F71", fontWeight: "bold" }}>Visa/Mastercard</span>
              </button>

              <button
                className="payment-gateway-btn"
                onClick={() => {
                  setPaymentMethod("ON_VISIT");
                  setShowPaymentModal(false);
                  setCardInfo({ cardNumber: "", expiryDate: "", cvv: "", cardHolder: "" });
                }}
                style={{ 
                  borderColor: paymentMethod === "ON_VISIT" ? "#0f766e" : "",
                  gridColumn: "1 / -1"
                }}
              >
                <div className="payment-gateway-logo" style={{ fontSize: "2rem", color: "#10B981" }}>
                  ✓
                </div>
                <span>Pay on Visit</span>
              </button>
            </div>

            <button className="modal-btn cancel-btn" onClick={() => setShowPaymentModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step3Summary;