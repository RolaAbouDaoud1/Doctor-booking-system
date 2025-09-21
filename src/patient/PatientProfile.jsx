import React, { useState } from "react";
import { ArrowLeft, Calendar, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "\PatientProfile.css"

export default function PatientProfile() {
  const navigate = useNavigate();
  const [patient, setPatient] = useState({
    initials: "AM",
    name: "Ahmad Mansour",
    email: "ahmad.mansour@email.com",
    phone: "+961 (11) 123-4567",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(patient);

  const [history, setHistory] = useState([
    { id: 1, type: "Cardiology Consultation", doctor: "Dr. Layla Khoury", date: "Oct 15, 2024", time: "2:30 PM", status: "Completed", icon: <Calendar size={20}/> },
    { id: 2, type: "Medication Prescription", doctor: "Dr. Layla Khoury", date: "Oct 15, 2024", details: "Lisinopril 10mg - Take once daily with food", icon: <FileText size={20}/> },
    { id: 3, type: "Follow-up Appointment", doctor: "Dr. Layla Khoury", date: "Nov 5, 2024", time: "10:00 AM", status: "Scheduled", icon: <Calendar size={20}/> },
  ]);

  const handleCancel = (id) => {
    setHistory(prev => prev.map(item => item.id === id ? { ...item, status: "Cancelled" } : item));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleSave = () => {
    setPatient(formData);
    setIsEditing(false);
  };

  return (
    <div className="patient-profile-page">
      <div className="profile-header">
        <button className="back-button" onClick={() => navigate(-1)}><ArrowLeft size={20}/></button>
        <h1>Patient Profile</h1>
      </div>

      <div className="profile-content">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-avatar">{patient.initials}</div>
          {isEditing ? (
            <>
              <input className="edit-input" type="text" name="name" value={formData.name} onChange={handleChange}/>
              <input className="edit-input" type="email" name="email" value={formData.email} onChange={handleChange}/>
              <input className="edit-input" type="text" name="phone" value={formData.phone} onChange={handleChange}/>
              <button className="save-button" onClick={handleSave}>Save Changes</button>
            </>
          ) : (
            <>
              <h2>{patient.name}</h2>
              <p>{patient.email}</p>
              <p>{patient.phone}</p>
              <button className="edit-button" onClick={() => setIsEditing(true)}>Edit Profile</button>
            </>
          )}
        </div>

        {/* Medical History */}
        <div className="history-section">
          <h3>Medical History</h3>
          {history.map(item => (
            <div className="history-card" key={item.id}>
              <div className="history-icon">{item.icon}</div>
              <div className="history-info">
                <h4>{item.type}</h4>
                <p>{item.doctor}</p>
                <p>{item.date} {item.time && `• ${item.time}`}</p>
                {item.details && <div className="details">{item.details}</div>}
                {item.status && <span className={`status ${item.status.toLowerCase()}`}>{item.status}</span>}
                {item.status === "Scheduled" && <button className="cancel-button" onClick={() => handleCancel(item.id)}>Cancel Appointment</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
