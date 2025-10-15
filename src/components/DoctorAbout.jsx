import React from "react";

export default function DoctorAbout({ doctor }) {
  return (
    <div className="card">
      <h3 className="section-title">About {doctor.name.split(" ")[1]}</h3>
      <p className="section-text">{doctor.bio}</p>
    </div>
  );
}
