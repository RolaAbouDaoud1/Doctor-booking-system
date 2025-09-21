import React from "react";
import { ArrowLeft } from "lucide-react"; 
import "./DoctorProfile.css"; 
import { useNavigate } from "react-router-dom"; 

export default function DoctorProfile() {
  const navigate = useNavigate();

  const doctor = {
    id: 1,
    name: "Dr. Layla Khoury",
    specialty: "Cardiology",
    reviews: 2,
    rating: 4.9,
    experience: "12 years",
    location: "Heart Care Medical Center, Downtown",
    price: "$150 / consultation",
    bio: "Dr. Layla Khoury is a board-certified cardiologist with over 12 years of experience in treating heart conditions. She specializes in preventive cardiology, heart disease management, and cardiac rehabilitation. Dr. Khoury is committed to providing personalized, compassionate care to help her patients achieve optimal heart health.",
    education: [
      "MD - American University of Beirut",
      "Residency - Hotel Dieu de France Hospital",
      "Fellowship - Cleveland Clinic"
    ],
  };

  return (
    <div className="page-container">
      <div className="card-container">

        {/* Header */}
        <div className="header">
         <button className="back-button" onClick={() => navigate(-1)}>
  <ArrowLeft size={20} />
</button>       
          <h1 className="header-title">Doctor Profile</h1>
        </div>

        {/* Profile Layout */}
        <div className="profile-layout">
          {/* Left side */}
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

          {/* Right side */}
          <div className="profile-details">
            {/* About Section */}
            <div className="card">
              <h3 className="section-title">About {doctor.name.split(" ")[1]}</h3>
              <p className="section-text">{doctor.bio}</p>
            </div>

            {/* Education Section */}
            <div className="card">
              <h3 className="section-title">Education & Credentials</h3>
              <ul className="education-list">
                {doctor.education.map((edu, index) => (
                  <li key={index}>{edu}</li>
                ))}
              </ul>
            </div>

            {/* Book Appointment Button */}
            <div className="button-container">
              <button  
                onClick={() => navigate(`/book-appointment/${doctor.id}`)}
                className="book-button"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}