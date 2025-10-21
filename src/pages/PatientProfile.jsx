import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, Calendar, Pill, Clock, User, Mail, Phone, Edit2, Save, X, Plus, Trash2, AlertCircle, FileText } from "lucide-react";
import PatientHeader from "../components/PatientHeader";
import PatientCard from "../components/PatientCard";
import PatientHistory from "../components/PatientHistory";
import "./PatientProfile.css";

export default function PatientProfile({patientTotal}) {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const [showCancelDialog, setShowCancelDialog] = useState(null);

  const baseURL = "http://localhost:8080/api/users/patient";

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetch(`${baseURL}/${patientId}/profile`);
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        setPatient({...data, allergies: data.allergies || []});
        setFormData({...data, allergies: data.allergies || []});
      } catch (err) {
        console.error("Error fetching patient data:", err);
        setError(err.message);

        const demoPatient = {
          initials: "AM",
          name: "Ahmad Mansour",
          email: "ahmad.mansour@email.com",
          phone: "+961 (11) 123-4567",
          allergies: ["Penicillin", "Latex"]
        };

        const demoHistory = [
          { 
            id: 1, 
            type: "Cardiology Consultation", 
            doctor: "Dr. Layla Khoury", 
            date: "2024-10-15", 
            time: "2:30 PM", 
            status: "Completed",
            notes: "Patient shows improvement in cardiovascular health. Blood pressure normalized.",
            medications: []
          },
          { 
            id: 2, 
            type: "Medication Prescription", 
            doctor: "Dr. Layla Khoury", 
            date: "2024-10-15", 
            medications: [
              { name: "Lisinopril", dosage: "10mg", instructions: "Take once daily with food" },
              { name: "Aspirin", dosage: "81mg", instructions: "Take once daily in the morning" }
            ],
            status: "Active"
          },
          { 
            id: 3, 
            type: "Follow-up Appointment", 
            doctor: "Dr. Layla Khoury", 
            date: "2024-11-05", 
            time: "10:00 AM", 
            status: "Scheduled",
            notes: "Routine follow-up to check medication effectiveness."
          },
          { 
            id: 4, 
            type: "Lab Results", 
            doctor: "Dr. Sarah Ahmed", 
            date: "2024-09-20", 
            status: "Completed",
            notes: "Blood work results show cholesterol levels within normal range. Continue current treatment."
          }
        ];

        setPatient(demoPatient);
        setFormData(demoPatient);
        setHistory(demoHistory);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [patientId]);

  const handleCancel = (id) => {
    setShowCancelDialog(id);
  };

  const confirmCancel = () => {
    setHistory((prev) => prev.map((item) => 
      item.id === showCancelDialog ? { ...item, status: "Cancelled" } : item
    ));
    setShowCancelDialog(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAllergyChange = (index, value) => {
    const newAllergies = [...formData.allergies];
    newAllergies[index] = value;
    setFormData({ ...formData, allergies: newAllergies });
  };

  const addAllergy = () => {
    setFormData({ ...formData, allergies: [...formData.allergies, ""] });
  };

  const removeAllergy = (index) => {
    const newAllergies = formData.allergies.filter((_, i) => i !== index);
    setFormData({ ...formData, allergies: newAllergies });
  };

  const handleSave = () => {
    setPatient(formData);
    setIsEditing(false);
  };

  const searchMedication = (medName) => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(medName + " medication")}`, '_blank');
  };

  const getDateStatus = (dateStr) => {
    const appointmentDate = new Date(dateStr);
    const now = new Date();
    const diffTime = appointmentDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)} days ago`, color: "#6b7280" };
    } else if (diffDays === 0) {
      return { text: "Today", color: "#059669" };
    } else if (diffDays === 1) {
      return { text: "Tomorrow", color: "#dc2626" };
    } else {
      return { text: `In ${diffDays} days`, color: "#2563eb" };
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="pp__loading-container">
        <div className="pp__spinner"></div>
        <p className="pp__loading-text">Loading patient data...</p>
      </div>
    );
  }

  return (
    <div className="pp__page-wrapper">
      <PatientHeader />

      {error && (
        <div className="pp__error-message">
          <AlertCircle size={20} />
          <p>⚠️ Failed to fetch patient data, showing demo info.</p>
        </div>
      )}

      <div className="pp__content-grid">
        <div className="pp__profile-card-container">
          <div className="pp__avatar-circle">
            {patient.initials}
          </div>
          
          {!isEditing ? (
            <>
              <h2 className="pp__patient-name">{patientTotal.username}</h2>
              
              <div className="pp__info-group">
                <div className="pp__info-row">
                  <Mail size={18} className="pp__info-icon" />
                  <span className="pp__info-text">{patientTotal.useremail}</span>
                </div>
                <div className="pp__info-row">
                  <Phone size={18} className="pp__info-icon" />
                  <span className="pp__info-text">{patientTotal.userphone}</span>
                </div>
                <div className="pp__info-row">
                  <AlertCircle size={18} className="pp__info-icon" />
                  <div className="pp__allergies-container">
                    <span className="pp__info-label">Allergies: </span>
                    {patient.allergies && patient.allergies.length > 0 ? (
                      <div className="pp__allergies-tags">
                        {patient.allergies.map((allergy, idx) => (
                          <span key={idx} className="pp__allergy-tag">{patientTotal.userallergies}</span>
                        ))}
                      </div>
                    ) : (
                      <span className="pp__no-allergies">None reported</span>
                    )}
                  </div>
                </div>
              </div>

              <button className="pp__edit-profile-btn" onClick={() => setIsEditing(true)}>
                <Edit2 size={16} />
                Edit Profile
              </button>
            </>
          ) : (
            <>
              <div className="pp__form-group">
                <label className="pp__form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="pp__form-input"
                />
              </div>

              <div className="pp__form-group">
                <label className="pp__form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pp__form-input"
                />
              </div>

              <div className="pp__form-group">
                <label className="pp__form-label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pp__form-input"
                />
              </div>

              <div className="pp__form-group">
                <label className="pp__form-label">Allergies</label>
                {formData.allergies && formData.allergies.map((allergy, idx) => (
                  <div key={idx} className="pp__allergy-input-row">
                    <input
                      type="text"
                      value={allergy}
                      onChange={(e) => handleAllergyChange(idx, e.target.value)}
                      className="pp__form-input pp__allergy-input"
                      placeholder="Enter allergy"
                    />
                    <button 
                      onClick={() => removeAllergy(idx)}
                      className="pp__remove-allergy-btn"
                      type="button"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button onClick={addAllergy} className="pp__add-allergy-btn" type="button">
                  <Plus size={16} />
                  Add Allergy
                </button>
              </div>

              <div className="pp__edit-actions">
                <button className="pp__save-profile-btn" onClick={handleSave}>
                  <Save size={16} />
                  Save Changes
                </button>
                <button 
                  className="pp__cancel-edit-btn" 
                  onClick={() => {
                    setFormData({...patient, allergies: patient.allergies ? [...patient.allergies] : []});
                    setIsEditing(false);
                  }}
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>

        <div className="pp__history-section">
          <h2 className="pp__section-heading">Medical History</h2>
          
          <div className="pp__history-grid">
            <div className="pp__history-list">
              {history.map((item) => (
                <div 
                  key={item.id} 
                  className={`pp__history-item ${selectedHistoryItem?.id === item.id ? 'pp__history-item--active' : ''}`}
                  onClick={() => setSelectedHistoryItem(item)}
                >
                  <div className="pp__history-icon-wrapper">
                    {item.type.includes("Consultation") || item.type.includes("Appointment") ? (
                      <Calendar size={20} className="pp__history-icon" />
                    ) : item.type.includes("Medication") ? (
                      <Pill size={20} className="pp__history-icon" />
                    ) : (
                      <FileText size={20} className="pp__history-icon" />
                    )}
                  </div>

                  <div className="pp__history-content">
                    <h3 className="pp__history-title">{item.type}</h3>
                    <p className="pp__history-doctor">{item.doctor}</p>
                    
                    <div className="pp__history-meta">
                      <span className="pp__history-date">{formatDate(item.date)}</span>
                      {item.time && <span className="pp__history-time">{item.time}</span>}
                    </div>

                    <div className="pp__status-row">
                      <span className={`pp__status-badge pp__status-badge--${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                      
                      {item.status === "Scheduled" && (
                        <button 
                          className="pp__cancel-appointment-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancel(item.id);
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedHistoryItem && (
              <div className="pp__details-panel">
                <div className="pp__details-header">
                  <h3 className="pp__details-heading">{selectedHistoryItem.type}</h3>
                  <button 
                    className="pp__close-details-btn"
                    onClick={() => setSelectedHistoryItem(null)}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="pp__details-body">
                  <div className="pp__detail-row">
                    <User size={18} className="pp__detail-icon" />
                    <div>
                      <p className="pp__detail-label">Doctor</p>
                      <p className="pp__detail-value">{selectedHistoryItem.doctor}</p>
                    </div>
                  </div>

                  <div className="pp__detail-row">
                    <Calendar size={18} className="pp__detail-icon" />
                    <div>
                      <p className="pp__detail-label">Date</p>
                      <p className="pp__detail-value">
                        {formatDate(selectedHistoryItem.date)}
                        {selectedHistoryItem.date && (
                          <span 
                            className="pp__date-status-badge"
                            style={{ backgroundColor: getDateStatus(selectedHistoryItem.date).color }}
                          >
                            {getDateStatus(selectedHistoryItem.date).text}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {selectedHistoryItem.time && (
                    <div className="pp__detail-row">
                      <Clock size={18} className="pp__detail-icon" />
                      <div>
                        <p className="pp__detail-label">Time</p>
                        <p className="pp__detail-value">{selectedHistoryItem.time}</p>
                      </div>
                    </div>
                  )}

                  {selectedHistoryItem.notes && (
                    <div className="pp__notes-section">
                      <p className="pp__detail-label">Notes</p>
                      <p className="pp__notes-text">{selectedHistoryItem.notes}</p>
                    </div>
                  )}

                  {selectedHistoryItem.medications && selectedHistoryItem.medications.length > 0 && (
                    <div className="pp__medications-section">
                      <p className="pp__detail-label">Medications</p>
                      {selectedHistoryItem.medications.map((med, idx) => (
                        <div key={idx} className="pp__medication-card">
                          <button 
                            className="pp__medication-name-btn"
                            onClick={() => searchMedication(med.name)}
                          >
                            {med.name} <span className="pp__medication-dosage">{med.dosage}</span>
                          </button>
                          <p className="pp__medication-instructions">{med.instructions}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCancelDialog && (
        <div className="pp__modal-overlay" onClick={() => setShowCancelDialog(null)}>
          <div className="pp__modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="pp__modal-title">Cancel Appointment?</h3>
            <p className="pp__modal-text">
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </p>
            <div className="pp__modal-actions">
              <button className="pp__modal-confirm-btn" onClick={confirmCancel}>
                Yes, Cancel
              </button>
              <button className="pp__modal-cancel-btn" onClick={() => setShowCancelDialog(null)}>
                No, Keep It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}