import React from "react";

export default function DoctorEducation({ education }) {
  return (
    <div className="card">
      <h3 className="section-title">Education & Credentials</h3>
      <ul className="education-list">
        {education.map((edu, index) => (
          <li key={index}>{edu}</li>
        ))}
      </ul>
    </div>
  );
}
