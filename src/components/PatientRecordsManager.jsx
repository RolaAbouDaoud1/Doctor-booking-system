import React from "react";

const PatientRecordsManager = ({
  patientsList,
  onPatientNavigation,
  onOpenUpload,
  searchTerm,
  onSearchChange,
}) => {
  const initials = (name) => {
    return name
      .split(" ")
      .map(s => s[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };
  
  const filteredPatients = patientsList?.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="patient-records-section">
      {/* Search Bar */}
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-bar"
          placeholder="Search patients by name..."
          value={searchTerm}
          onChange={onSearchChange}
        />
        {searchTerm && (
          <button 
            className="clear-search-btn"
            onClick={() => onSearchChange({ target: { value: '' } })}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Patient Records List or Empty State */}
      {filteredPatients.length === 0 ? (
        <div className="no-appointments">
          <p>
            {searchTerm 
              ? `🔍 No patients found matching "${searchTerm}"`
              : '📋 No patient records available'}
          </p>
        </div>
      ) : (
        <div className="patients-records-list">
          {filteredPatients.map((patient) => (
            <div key={patient.id} className="patient-record-card-large">
              <div className="patient-card-header">
                <div className="patient-info-section">
                  <div className="avatar patient-avatar-large">
                    {initials(patient.name)}
                  </div>
                  <div className="patient-details-section">
                    <button
                      className="patient-name-large"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPatientNavigation(patient.id, e);
                      }}
                    >
                      {patient.name}
                    </button>
                    <span className="patient-id-badge">ID: {patient.id}</span>
                  </div>
                </div>
              </div>
              
              <div className="patient-actions-grid">
                <button
                  className="action-button docs-action"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenUpload(patient, "Health Document");
                  }}
                >
                  <span className="action-icon">📄</span>
                  <span className="action-text">Documents</span>
                </button>
                <button
                  className="action-button labs-action"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenUpload(patient, "Lab Result");
                  }}
                >
                  <span className="action-icon">🧪</span>
                  <span className="action-text">Lab Results</span>
                </button>
                <button
                  className="action-button meds-action"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenUpload(patient, "Medication");
                  }}
                >
                  <span className="action-icon">💊</span>
                  <span className="action-text">Medications</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientRecordsManager;