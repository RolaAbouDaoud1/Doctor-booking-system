import React, { useState } from "react";
import PatientRecordsManager from './PatientRecordsManager';

const DoctorOverviewStats = ({ 
  stats, 
  openDropdown, 
  onDropdownToggle, 
  onPatientNavigation 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [uploadType, setUploadType] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPatientRecords, setShowPatientRecords] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={i < Math.floor(rating) ? "star full" : "star empty"}>★</span>
    ));
  };
  
  const handleWebSearch = () => {
    const defaultSearch = "Today's Medical News And Updates";
    const url = `https://www.google.com/search?q=${encodeURIComponent(defaultSearch)}`;
    window.open(url, '_blank');
  };

  const handleDropdownToggle = (dropdownType) => {
    if (openDropdown !== dropdownType) {
      setSearchTerm("");
    }
    onDropdownToggle(openDropdown === dropdownType ? null : dropdownType);
  };

  const handlePatientRecordsToggle = () => {
    setShowPatientRecords(!showPatientRecords);
    setSearchTerm("");
  };

  const handleOpenUpload = (patient, type) => {
    setSelectedPatient(patient);
    setUploadType(type);
    setSelectedFile(null);
    setShowUploadModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileUpload = (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setShowErrorModal(true);
      return;
    }
    setUploadedFileName(selectedFile.name);
    setShowUploadModal(false);
    setShowSuccessModal(true);
    setSelectedFile(null);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setSelectedPatient(null);
    setUploadType("");
    setUploadedFileName("");
  };

  const filteredPatientsCount = stats.patientsList?.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).length || 0;

  return (
    <>
      <div className="stats-container-wrapper">
        <div className="stats-card">
          <h3 className="section-title">📊 Overview</h3>
          <section className="stats">
            <div className="stat-box clickable" onClick={() => handleDropdownToggle("todayAppointments")}>
              <div className="stat-top">
                <h3>{stats.todayAppointments}</h3>
                <p>Today's Appointments</p>
              </div>
              {openDropdown === "todayAppointments" && (
                <div className="dropdown-menu appointments-dropdown">
                  <div className="dropdown-header">
                    <h4>📅 Today's Schedule</h4>
                    <span className="appointment-count">{stats.todayAppointments} appointments</span>
                  </div>
                  {stats.todayAppointmentsList?.length ? (
                    <div className="appointments-list">
                      {stats.todayAppointmentsList.map(apt => (
                        <div key={apt.id} className="appointment-item">
                          <div className="appointment-time-badge">{apt.time}</div>
                          <div className="appointment-info">
                            <button 
                              className="patient-name-link" 
                              onClick={(e) => {
                                e.stopPropagation();
                                onPatientNavigation(apt.patientId, e);
                              }}
                            >
                              <strong>{apt.patientName}</strong>
                            </button>
                            <div className="appointment-meta">
                              <span className="appointment-type">{apt.type}</span>
                              <span className={`status-badge ${apt.status}`}>{apt.status}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-state">No appointments scheduled for today</p>
                  )}
                </div>
              )}
            </div>
            <div 
              className="stat-box clickable" 
              onClick={handlePatientRecordsToggle}
            >
              <div className="stat-top">
                <h3>{stats.totalPatients}</h3>
                <p>Patient Records</p>
              </div>
            </div>
            <div className="stat-box clickable" onClick={handleWebSearch}>
              <div className="stat-top">
                <h3 style={{fontSize: '28px'}}>🌐</h3> 
                <p>Quick Web Search</p>
              </div>
              <p className="subtle" style={{fontSize: '12px', marginTop: '10px', color: 'var(--teal)'}}>Latest Medical News</p>
            </div>
            <div className="stat-box clickable" onClick={() => handleDropdownToggle("rating")}>
              <div className="stat-top rating-box">
                <div>
                  <div className="rating-value">{stats.averageRating}</div>
                  <div className="rating-stars">{renderStars(stats.averageRating)}</div>
                </div>
                <p>Patient Rating</p>
              </div>
              {openDropdown === "rating" && (
                <div className="dropdown-menu feedback-dropdown">
                  <div className="dropdown-header">
                    <h4>⭐ Patient Feedback</h4>
                    <span className="rating-summary">Average: {stats.averageRating}/5 ({stats.feedback?.length || 0} reviews)</span>
                  </div>
                  {stats.feedback?.length ? (
                    <div className="feedback-list">
                      {stats.feedback.map((fb) => (
                        <div key={fb.id} className="feedback-card">
                          <div className="feedback-header">
                            <button 
                              className="patient-name-link" 
                              onClick={(e) => {
                                e.stopPropagation();
                                onPatientNavigation(fb.patientId, e);
                              }}
                            >
                              <strong>{fb.patientName}</strong>
                            </button>
                            <div className="rating-display">
                              <span className="rating-number">{fb.rating}</span>
                              <div className="rating-stars-small">{renderStars(fb.rating)}</div>
                            </div>
                          </div>
                          <div className="feedback-comment">
                            <p>"{fb.comment}"</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-state">No patient feedback yet</p>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {showPatientRecords && (
        <div className="section-container">
          <div className="stats-card">
            <div className="appointments-header">
              <h3>
                📁 Patient Records ({filteredPatientsCount})
              </h3>
              <button 
                className="close-btn" 
                onClick={() => {
                  setShowPatientRecords(false);
                  setSearchTerm("");
                }}
                aria-label="Close patient records"
              >
                ✕
              </button>
            </div>
            
            <PatientRecordsManager
              patientsList={stats.patientsList}
              onPatientNavigation={onPatientNavigation}
              onOpenUpload={handleOpenUpload}
              searchTerm={searchTerm}
              onSearchChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal upload-modal" onClick={(e) => e.stopPropagation()}>
            <h3>📤 Upload {uploadType}</h3>
            <p>For patient: <strong>{selectedPatient?.name}</strong></p>
            <p style={{fontSize: '13px', color: 'var(--muted)', marginTop: '8px'}}>
              Patient ID: {selectedPatient?.id}
            </p>
            
            <form onSubmit={handleFileUpload}>
              <div className="file-input-wrapper">
                <label htmlFor="file-upload" className="custom-file-upload primary-upload">
                  <span className="btn-icon">📁</span>
                  <span className="file-label-text">
                    <b>{selectedFile ? selectedFile.name : 'Browse Files'}</b>
                  </span>
                </label>
                <input 
                  type="file" 
                  id="file-upload" 
                  className="file-input"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,image/*"
                />
                
                <p className="upload-hint">
                  💡 On mobile, you can also use your camera to capture documents
                </p>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn main">
                  Upload
                </button>
                <button 
                  type="button" 
                  className="btn mint" 
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFile(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    
      {showErrorModal && (
        <div className="modal-overlay" onClick={() => setShowErrorModal(false)}>
          <div className="modal error-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon error-icon">⚠️</div>
            <h3>No File Selected</h3>
            <p>Please select a file before uploading.</p>
            <div className="modal-actions">
              <button 
                className="btn main" 
                onClick={() => setShowErrorModal(false)}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="modal-overlay" onClick={handleCloseSuccessModal}>
          <div className="modal success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon success-icon">✅</div>
            <h3>Upload Successful!</h3>
            <p><strong>{uploadType}</strong> uploaded successfully</p>
            <p style={{fontSize: '13px', color: 'var(--muted)', marginTop: '8px'}}>
              File: {uploadedFileName}
            </p>
            <p style={{fontSize: '13px', color: 'var(--muted)'}}>
              Patient: {selectedPatient?.name}
            </p>
            <div className="modal-actions">
              <button 
                className="btn main" 
                onClick={handleCloseSuccessModal}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorOverviewStats;