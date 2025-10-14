import React, { useState, useEffect } from "react";
import "../pages/design.css";

export default function RegisterPatient({ data = {}, setData, errors = {} }) {
  const [dateOfBirth, setDateOfBirth] = useState(data.dateOfBirth || "");
  const [allergy, setAllergy] = useState("");
  const [medicalHistoryItem, setMedicalHistoryItem] = useState("");
  const [insuranceNumber, setInsuranceNumber] = useState(data.insuranceNumber || "");

  // Sync local fields when parent data changes
  useEffect(() => {
    setDateOfBirth(data.dateOfBirth || "");
    setInsuranceNumber(data.insuranceNumber || "");
  }, [data.dateOfBirth, data.insuranceNumber]);

  // Handle date of birth
  const handleDateChange = (value) => {
    setDateOfBirth(value);
    setData((prev) => ({ ...prev, dateOfBirth: value }));
  };

  // Handle insurance number
  const handleInsuranceChange = (value) => {
    setInsuranceNumber(value);
    setData((prev) => ({ ...prev, insuranceNumber: value }));
  };

  // Add allergy
  const handleAddAllergy = () => {
    if (allergy.trim()) {
      const updated = [...(data.allergies || []), allergy.trim()];
      setData((prev) => ({ ...prev, allergies: updated }));
      setAllergy("");
    }
  };

  const handleRemoveAllergy = (index) => {
    const updated = (data.allergies || []).filter((_, i) => i !== index);
    setData((prev) => ({ ...prev, allergies: updated }));
  };

  // Add medical history
  const handleAddMedicalHistory = () => {
    if (medicalHistoryItem.trim()) {
      const updated = [...(data.medicalHistory || []), medicalHistoryItem.trim()];
      setData((prev) => ({ ...prev, medicalHistory: updated }));
      setMedicalHistoryItem("");
    }
  };

  const handleRemoveMedicalHistory = (index) => {
    const updated = (data.medicalHistory || []).filter((_, i) => i !== index);
    setData((prev) => ({ ...prev, medicalHistory: updated }));
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
          onChange={(e) => handleDateChange(e.target.value)}
        />
        {errors.dateOfBirth && <p className="error">{errors.dateOfBirth}</p>}
      </div>

      {/* Insurance Number */}
      <div className="form-group">
        <label>Insurance Number</label>
        <input
          type="text"
          placeholder="Enter your insurance number"
          value={insuranceNumber}
          className="input-field"
          onChange={(e) => handleInsuranceChange(e.target.value)}
        />
        {errors.insuranceNumber && <p className="error">{errors.insuranceNumber}</p>}
      </div>

      {/* Allergies */}
      <div className="form-group">
        <label>Allergies</label>
        <div className="input-with-button">
          <input
            type="text"
            placeholder="Enter an allergy"
            value={allergy}
            className="input-field"
            onChange={(e) => setAllergy(e.target.value)}
          />
          <button type="button" className="add" onClick={handleAddAllergy}>
            Add
          </button>
        </div>
        <ul className="list">
          {(data.allergies || []).map((item, index) => (
            <li key={index}>
              {item}
              <button
                type="button"
                className="delete"
                onClick={() => handleRemoveAllergy(index)}
              >
                <i className="fa-solid fa-x"></i>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Medical History */}
      <div className="form-group">
        <label>Medical History</label>
        <div className="input-with-button">
          <input
            type="text"
            placeholder="Enter a medical condition (e.g., Diabetes)"
            value={medicalHistoryItem}
            className="input-field"
            onChange={(e) => setMedicalHistoryItem(e.target.value)}
          />
          <button type="button" className="add" onClick={handleAddMedicalHistory}>
            Add
          </button>
        </div>
        <ul className="list">
          {(data.medicalHistory || []).map((item, index) => (
            <li key={index}>
              {item}
              <button
                type="button"
                className="delete"
                onClick={() => handleRemoveMedicalHistory(index)}
              >
                <i className="fa-solid fa-x"></i>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}