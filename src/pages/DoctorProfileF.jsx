import { useState } from "react";
import "./DoctorProfileF.css";

export default function DoctorProfileF() {
  const [profile, setProfile] = useState({
    fullName: "Dr. Layla Khoury",
    specialty: "Cardiology",
    fee: 150,
    availability: `Monday - Friday: 9:00 AM - 5:00 PM
    Saturday: 9:00 AM - 1:00 PM
    Sunday: Closed`,
  });

  const handleSave = () => {
    alert("Profile saved!");
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* simple arrow icon */}
        <button className="back-button">←</button>

        <h2 className="page-title">Doctor Profile Management</h2>
      </div>

      <div className="info-cardd">
        <div className="icon">
          <i className="fa-regular fa-user"></i>{" "}
        </div>
      </div>

      <div className="info-card">
        <h3 className="Profile-info">Profile Information </h3>
        <br />
        <label>Full Name</label>
        <input className="text" type="text" value={""} readOnly />
        <br />
        <br />
        <label>Specialty</label>
        <input className="text" type="text" value={""} readOnly />
        <br />
        <br />
        <label>Consultation Fee ($)</label>
        <input className="text" type="text" value={""} readOnly />
        <br />
        <br />
        <label>Availability</label>
        <textarea className="textareaaa" readOnly>
          {""}
        </textarea>
      </div>

      <button className="save-btn" onClick={handleSave}>
        💾 Save Profile
      </button>
    </div>
  );
}
