import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./DoctorProfile.css";
import DoctorHeader from "../components/DoctorHeader";
import DoctorCard from "../components/DoctorCard";
import DoctorAbout from "../components/DoctorAbout";
import DoctorEducation from "../components/DoctorEducation";
import BookAppointmentButton from "../components/BookAppointmentButton";

export default function DoctorProfile() {
  const { doctorId } = useParams(); // get dynamic doctorId from URL
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await fetch(`/api/users/doctor/${doctorId}/profile`)

        if (!response.ok) {
          throw new Error("Failed to fetch doctor data");
        }
        const data = await response.json();
        setDoctor(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!doctor) return <p>No doctor found</p>;

  return (
    <div className="page-container">
      <div className="card-container">
        <DoctorHeader />

        <div className="profile-layout">
          <DoctorCard doctor={doctor} />

          <div className="profile-details">
            <DoctorAbout doctor={doctor} />
            <DoctorEducation education={doctor.education} />
            <BookAppointmentButton doctorId={doctor.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
