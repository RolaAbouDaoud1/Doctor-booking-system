import React from "react";

export default function DoctorCard({ doctor }) {
  return (
    <div className="profile-card">
      <div className="flex items-center gap-4">
        <div className="profile-circle">
          {doctor.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div className="profile-info">
          <h2>{doctor.name}</h2>
          <p>{doctor.specialty}</p>
          <div className="rating">
            ⭐ {doctor.rating} ({doctor.reviews} reviews)
            <span className="experience-badge">{doctor.experience}</span>
          </div>
          <p className="section-text">{doctor.location}</p>
          <p className="price">{doctor.price}</p>
        </div>
      </div>
    </div>
  );
}
