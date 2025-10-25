import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Step3Summary = ({ appointment, prevStep }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("visit");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentGateway, setSelectedPaymentGateway] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: ""
  });
  
  const navigate = useNavigate();
  const Docname = localStorage.getItem("Docname");

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    if (method === "online") {
      setShowPaymentModal(true);
    } else {
      setShowPaymentForm(false);
      setSelectedPaymentGateway("");
    }
  };

  const handlePaymentGatewaySelect = (gateway) => {
    setSelectedPaymentGateway(gateway);
    setShowPaymentModal(false);
    setShowPaymentForm(true);
  };

  const handleConfirm = async () => {
    if (paymentMethod === "online") {
      if (!selectedPaymentGateway) {
        setModalType("error");
        setModalMessage("Please select a payment method");
        setShowModal(true);
        return;
      }
      if (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiryDate || !cardDetails.cvv) {
        setModalType("error");
        setModalMessage("Please fill in all card details");
        setShowModal(true);
        return;
      }
    }

    try {
      const response = await fetch("http://localhost:8080/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...appointment,
          doctor: Docname || "Dr. Layla Khoury",
          paymentMethod: paymentMethod,
          paymentGateway: selectedPaymentGateway
        }),
      });

      if (response.ok) {
        setModalType("success");
        setModalMessage("Your appointment has been successfully booked!");
        setShowModal(true);
        setTimeout(() => {
          navigate("/DoctorProfile");
        }, 2000);
      } else {
        setModalType("error");
        setModalMessage("Something went wrong. Please try again.");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error sending appointment:", error);
      setModalType("error");
      setModalMessage("Failed to send appointment to the backend.");
      setShowModal(true);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    if (modalType === "success") {
      navigate("/DoctorProfile");
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.slice(0, 2) + "/" + v.slice(2, 4);
    }
    return v;
  };

  return (
    <div className="appointment-container">
      <div className="book-header">
        <button className="back-btn" onClick={prevStep}>←</button>
        <h2 className="title">Book Appointment</h2>
        <div className="dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot active"></span>
        </div>
      </div>

      <div className="appointment-content">
        <div className="doctor-info-wrapper">
          <div className="doctor-info-card">
            <div className="doctor-card-inner">
              <div className="avatar">LK</div>
              <div className="doc-details">
                <h3>{Docname || "Dr. Layla Khoury"}</h3>
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
            <h4 className="section-title">Appointment Summary</h4>
            
            <div className="summary-row">
              <span>Date & Time</span>
              <p>{appointment.date}, {appointment.time}</p>
            </div>
            
            <div className="summary-row">
              <span>Doctor</span>
              <p>{Docname || "Dr. Layla Khoury"}</p>
            </div>
            
            <div className="summary-row">
              <span>Reason</span>
              <p>{appointment.reason || "Not specified"}</p>
            </div>
            
            <div className="summary-row">
              <span>Symptoms</span>
              <p>{appointment.symptoms || "None mentioned"}</p>
            </div>
            
            <div className="summary-row">
              <span>Notes</span>
              <p>{appointment.notes || "No additional notes"}</p>
            </div>
            
            <div className="summary-row">
              <span>Consultation Fee</span>
              <p>$150</p>
            </div>
          </div>

          <div className="payment-section">
            <label className="payment" onClick={() => handlePaymentMethodChange("visit")}>
              <input
                type="radio"
                name="payment"
                value="visit"
                checked={paymentMethod === "visit"}
                onChange={() => handlePaymentMethodChange("visit")}
              />
              <div>
                <p className="payment-title">Pay on Visit</p>
                <p className="payment-sub">Pay at the clinic during your appointment</p>
              </div>
            </label>

            <label className="payment" onClick={() => handlePaymentMethodChange("online")}>
              <input
                type="radio"
                name="payment"
                value="online"
                checked={paymentMethod === "online"}
                onChange={() => handlePaymentMethodChange("online")}
              />
              <div>
                <p className="payment-title">Pay Online</p>
                <p className="payment-sub">Secure payment via credit/debit card</p>
              </div>
            </label>
          </div>

          {showPaymentForm && (
            <div className="section animate-in payment-form-section">
              <div className="payment-gateway-selected">
                <span>Payment Method: </span>
                <strong>{selectedPaymentGateway === "visa" ? "Visa Card" : "Wish Money"}</strong>
                <button 
                  className="change-payment-btn" 
                  onClick={() => {
                    setShowPaymentModal(true);
                    setShowPaymentForm(false);
                    setCardDetails({ cardNumber: "", cardName: "", expiryDate: "", cvv: "" });
                  }}
                >
                  Change
                </button>
              </div>

              <h4 className="section-title">Card Details</h4>
              
              <label>Card Number</label>
              <input
                className="inputtt"
                type="text"
                maxLength="19"
                value={cardDetails.cardNumber}
                onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: formatCardNumber(e.target.value) })}
                placeholder="1234 5678 9012 3456"
              />

              <label>Cardholder Name</label>
              <input
                className="inputtt"
                type="text"
                value={cardDetails.cardName}
                onChange={(e) => setCardDetails({ ...cardDetails, cardName: e.target.value })}
                placeholder="Enter Name"
              />

              <div className="card-row">
                <div className="card-col">
                  <label>Expiry Date</label>
                  <input
                    className="inputtt"
                    type="text"
                    maxLength="5"
                    value={cardDetails.expiryDate}
                    onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: formatExpiryDate(e.target.value) })}
                    placeholder="MM/YY"
                  />
                </div>
                <div className="card-col">
                  <label>CVV</label>
                  <input
                    className="inputtt"
                    type="text"
                    maxLength="3"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/[^0-9]/g, "") })}
                    placeholder="123"
                  />
                </div>
              </div>
            </div>
          )}

          <button className="confirm-btn" onClick={handleConfirm}>
            Confirm Booking
          </button>
        </div>
      </div>

      {showPaymentModal && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content payment-gateway-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Select Payment Method</h3>
            <p className="modal-message">Choose your preferred payment gateway</p>
            
            <div className="payment-gateways">
              <button 
                className="payment-gateway-btn"
                onClick={() => handlePaymentGatewaySelect("visa")}
              >
                <div className="payment-gateway-logo visa-logo">
                  <svg viewBox="0 0 48 32" width="60" height="40">
                    <rect width="48" height="32" rx="4" fill="#1A1F71"/>
                    <text x="24" y="20" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">VISA</text>
                  </svg>
                </div>
                <span>Visa Card</span>
              </button>

              <button 
                className="payment-gateway-btn"
                onClick={() => handlePaymentGatewaySelect("wish")}
              >
                <div className="payment-gateway-logo wish-logo">
                  <svg viewBox="0 0 48 32" width="60" height="40">
                    <rect width="48" height="32" rx="4" fill="#2ECC71"/>
                    <text x="24" y="20" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">WISH</text>
                  </svg>
                </div>
                <span>Wish Money</span>
              </button>
            </div>

            <button className="modal-btn cancel-btn" onClick={() => {
              setShowPaymentModal(false);
              setPaymentMethod("visit");
            }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={handleModalClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className={`modal-icon ${modalType}`}>{modalType === "success" ? "✓" : "!"}</div>
            <h3 className="modal-title">{modalType === "success" ? "Success!" : "Error"}</h3>
            <p className="modal-message">{modalMessage}</p>
            <button className="modal-btn" onClick={handleModalClose}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step3Summary;