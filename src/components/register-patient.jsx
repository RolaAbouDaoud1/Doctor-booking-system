import React, { useState } from "react";
import "../pages/design.css";

export default function RegisterPatient({ data, setData, errors, onChange}) {
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [allergies, setAllergies] = useState([]);
  const [allergy, setAllergy] = useState("");
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [mhistory, setMHistory] = useState("");


  // Add allergy
  const handleAddAllergy = () => {
    if (allergy.trim() !== "") {
      setAllergies([...allergies, allergy.trim()]);
      setAllergy("");
      onChange && onChange({ allergies: [...allergies, allergy.trim()] });
    }
  };

  const handleRemoveAllergy = (index) => {
    const updated = allergies.filter((_, i) => i !== index);
    setAllergies(updated);
    onChange && onChange({ allergies: updated });
  };

  // Add medical history
  const handleAddMedicalHistory = () => {
    if (mhistory.trim() !== "") {
      setMedicalHistory([...medicalHistory, mhistory.trim()]);
      setMHistory("");
      onChange && onChange({ medicalHistory: [...medicalHistory, mhistory.trim()] });
    }
  };

  const handleRemoveMedicalHistory = (index) => {
    const updated = medicalHistory.filter((_, i) => i !== index);
    setMedicalHistory(updated);
    onChange && onChange({ medicalHistory: updated });
  };


 const handleDateChange = (value) => {
    setData({ ...data, dateOfBirth: value });
    if (value) errors.dateOfBirth = "";
  };


    return (
      <div className="patient-section">
        {/* Date of Birth */}
        <div className="form-group">
          <label>Date of Birth</label>
          <input
            type="date"
            value={dateOfBirth}
            className="input-field"
            onChange={(e) => handleDateChange(e.target.value)} />
            {errors.dateOfBirth && <p className="error">{errors.dateOfBirth}</p>}
        </div>

        {/* Allergies */}
        <div className="form-group">
          <label>Allergies</label>
          <input
            type="text"
            placeholder="Enter an allergy"
            value={allergy}
            className="input-field"
            onChange={(e) => setAllergy(e.target.value)} />
          <button type="button" className="add" onClick={handleAddAllergy}>Add</button>
          <ul className="list">
            {allergies.map((item, index) => (
              <li key={index}>
                {item} <button type="button" className="delete" onClick={() => handleRemoveAllergy(index)}><i className="fa-solid fa-x"></i></button>
              </li>
            ))}
          </ul>
        </div>

        {/* Medical History */}
        <div className="form-group">
          <label>Medical History</label>
          <input
            type="text"
            placeholder="Enter your medical history (e.g., Diabetes)"
            value={mhistory}
            className="input-field"
            onChange={(e) => setMHistory(e.target.value)} />
          <button type="button" className="add" onClick={handleAddMedicalHistory}>Add</button>
          <ul className="list">
            {medicalHistory.map((item, index) => (
              <li key={index}>
                {item} <button type="button" className="delete" onClick={() => handleRemoveMedicalHistory(index)}><i className="fa-solid fa-x"></i></button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
