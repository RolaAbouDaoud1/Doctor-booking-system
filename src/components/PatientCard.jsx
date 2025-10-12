import React from "react";

export default function PatientCard({ patient, isEditing, formData, handleChange, handleSave, setIsEditing }) {
  return (
    <div className="profile-card">
      <div className="profile-avatar">{patient.initials}</div>
      {isEditing ? (
        <>
          <input className="edit-input" type="text" name="name" value={formData.name} onChange={handleChange} />
          <input className="edit-input" type="email" name="email" value={formData.email} onChange={handleChange} />
          <input className="edit-input" type="text" name="phone" value={formData.phone} onChange={handleChange} />
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
  );
}

