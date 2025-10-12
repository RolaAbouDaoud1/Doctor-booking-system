import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./DoctorProfile.css";
import DoctorHeader from "../components/DoctorHeader";
import DoctorCard from "../components/DoctorCard";
import DoctorAbout from "../components/DoctorAbout";
import DoctorEducation from "../components/DoctorEducation";
import BookAppointmentButton from "../components/BookAppointmentButton";

export default function DoctorProfile() {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseURL = "http://localhost:8080/api/doctors"; // backend base URL

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await fetch(`${baseURL}/${doctorId}/profile`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setDoctor(data);
      } catch (err) {
        console.error("Error fetching doctor data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  if (loading) return <p>Loading...</p>;

  const demoDoctor = {
    id: "demo123",
    name: "Dr. Layla Khoury",
    specialty: "Cardiologist",
    rating: 4.8,
    reviews: 120,
    experience: "10 years",
    location: "Beirut, Lebanon",
    price: "$100 per consultation",
    bio: "Passionate about helping patients achieve better heart health through personalized care.",
    education: ["MD - University of Beirut", "Cardiology Fellowship - Harvard Medical School"],
  };

  const displayDoctor = doctor || demoDoctor;

  return (
    <div className="doctor-profile">
      <DoctorHeader />
      {error && (
        <div className="error-message">
          <p>⚠️ Failed to fetch doctor data, showing demo info.</p>
        </div>
      )}
      <div className="profile-container">
        <DoctorCard doctor={displayDoctor} />
        <div className="profile-details">
          <DoctorAbout doctor={displayDoctor} />
          <DoctorEducation education={displayDoctor.education} />
          <BookAppointmentButton doctorId={displayDoctor.id} />
        </div>
      </div>
    </div>
  );
}

