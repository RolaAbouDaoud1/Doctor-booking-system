import React from "react";

const PatientOverviewStats = ({ stats, onNavigate, openDropdown, onDropdownToggle, appointments = [], medicalDocuments = [] }) => {
  
  const getDoctorInitials = (doctorName) => {
    return doctorName.split(" ").slice(1).map(n => n[0]).join("");
  };

  // Count different types of medical documents
  const pendingLabResults = medicalDocuments.filter(doc => doc.type === 'lab_result' && doc.status === 'pending').length;
  const completedLabResults = medicalDocuments.filter(doc => doc.type === 'lab_result' && doc.status === 'completed').length;
  const medicalReports = medicalDocuments.filter(doc => doc.type === 'medical_report').length;
  const prescriptions = medicalDocuments.filter(doc => doc.type === 'prescription').length;

  return (
    <div className="stats-card">
      <h3 className="section-title">📊 Health Overview</h3>
      <section className="stats">
        
        {/* Upcoming Appointments - Clickable with Dropdown */}
        <div className="stat-box clickable" onClick={() => onDropdownToggle("upcomingAppointments")}>
          <div className="stat-top">
            <h3>{stats.upcomingAppointments}</h3>
            <p>Upcoming Appointments</p>
          </div>
          {openDropdown === "upcomingAppointments" && (
            <div className="dropdown-menu appointments-dropdown">
              <div className="dropdown-header">
                <h4>📅 Your Appointments</h4>
                <span className="appointment-count">{stats.upcomingAppointments} upcoming</span>
              </div>
              {appointments.length > 0 ? (
                <div className="appointments-list">
                  {appointments.map(apt => (
                    <div key={apt.appointmentId} className="appointment-item">
                      <div className="appointment-avatar-small">
                        {getDoctorInitials(apt.doctorName)}
                      </div>
                      <div className="appointment-info">
                        <button 
                          className="doctor-name-link" 
                          onClick={() => onNavigate(`/doctor-profile/${apt.doctorId || apt.id}`)}
                        >
                          <strong>{apt.doctorName}</strong>
                        </button>
                        <div className="appointment-meta">
                          <span className="appointment-specialty">{apt.specialty}</span>
                          <span className="appointment-time">{apt.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No upcoming appointments</p>
              )}
              <div className="dropdown-actions">
                <button 
                  className="btn small main" 
                  onClick={() => onNavigate("/doctor-search")}
                >
                  📅 Book New Appointment
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Health Documents - Shows medical reports and documents */}
        <div className="stat-box clickable" onClick={() => onDropdownToggle("healthDocuments")}>
          <div className="stat-top">
            <h3>{medicalReports}</h3>
            <p>Health Documents</p>
          </div>
          {openDropdown === "healthDocuments" && (
            <div className="dropdown-menu documents-dropdown">
              <div className="dropdown-header">
                <h4>📋 Your Medical Documents</h4>
                <span>{medicalReports} documents</span>
              </div>
              {medicalReports > 0 ? (
                <div className="documents-list">
                  {medicalDocuments.filter(doc => doc.type === 'medical_report').slice(0, 5).map(doc => (
                    <div key={doc.id} className="document-item">
                      <span className="document-icon">📄</span>
                      <div className="document-info">
                        <strong>{doc.name}</strong>
                        <span className="document-date">{new Date(doc.date).toLocaleDateString()}</span>
                      </div>
                      <button className="view-btn" onClick={() => onNavigate(`/medical-documents/${doc.id}`)}>
                        View
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No medical documents available</p>
              )}
            </div>
          )}
        </div>

        {/* Lab Results - Shows pending and completed results */}
        <div className="stat-box clickable" onClick={() => onDropdownToggle("labResults")}>
          <div className="stat-top">
            <h3>{pendingLabResults}</h3>
            <p>Lab Results</p>
            <small>{completedLabResults} completed</small>
          </div>
          {openDropdown === "labResults" && (
            <div className="dropdown-menu lab-results-dropdown">
              <div className="dropdown-header">
                <h4>🔬 Lab Results</h4>
                <span>{pendingLabResults} pending, {completedLabResults} ready</span>
              </div>
              <div className="lab-results-section">
                <h5>Pending Tests ({pendingLabResults})</h5>
                {pendingLabResults > 0 ? (
                  medicalDocuments.filter(doc => doc.type === 'lab_result' && doc.status === 'pending').map(doc => (
                    <div key={doc.id} className="lab-result-item pending">
                      <span className="status-indicator">⏳</span>
                      <span>{doc.name}</span>
                      <small>Ordered: {new Date(doc.orderDate).toLocaleDateString()}</small>
                    </div>
                  ))
                ) : (
                  <p className="empty-state">No pending tests</p>
                )}
              </div>
              <div className="lab-results-section">
                <h5>Completed Results ({completedLabResults})</h5>
                {completedLabResults > 0 ? (
                  medicalDocuments.filter(doc => doc.type === 'lab_result' && doc.status === 'completed').slice(0, 3).map(doc => (
                    <div key={doc.id} className="lab-result-item completed">
                      <span className="status-indicator">✅</span>
                      <div className="result-info">
                        <strong>{doc.name}</strong>
                        <small>Completed: {new Date(doc.completedDate).toLocaleDateString()}</small>
                      </div>
                      <button className="view-btn" onClick={() => onNavigate(`/lab-results/${doc.id}`)}>
                        View
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="empty-state">No completed results</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Current Medications - Shows active prescriptions */}
        <div className="stat-box clickable" onClick={() => onDropdownToggle("medications")}>
          <div className="stat-top">
            <h3>{prescriptions}</h3>
            <p>Current Medications</p>
          </div>
          {openDropdown === "medications" && (
            <div className="dropdown-menu medications-dropdown">
              <div className="dropdown-header">
                <h4>💊 Your Medications</h4>
                <span>{prescriptions} active prescriptions</span>
              </div>
              {prescriptions > 0 ? (
                <div className="medications-list">
                  {medicalDocuments.filter(doc => doc.type === 'prescription').map(prescription => (
                    <div key={prescription.id} className="medication-item">
                      <span className="medication-icon">💊</span>
                      <div className="medication-info">
                        <strong>{prescription.medicationName}</strong>
                        <small>Dosage: {prescription.dosage}</small>
                        <small>Refills: {prescription.refillsLeft}</small>
                      </div>
                      <span className={`status ${prescription.status}`}>
                        {prescription.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No active medications</p>
              )}
            </div>
          )}
        </div>

      </section>
    </div>
  );
};

export default PatientOverviewStats;