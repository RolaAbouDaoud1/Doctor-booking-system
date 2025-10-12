import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PatientHeader from "../components/PatientHeader";
import PatientCard from "../components/PatientCard";
import PatientHistory from "../components/PatientHistory";
import "./PatientProfile.css";

export default function PatientProfile() {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseURL = "http://localhost:8080/api/users/patient"; // ✅ backend base URL

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetch(`${baseURL}/${patientId}/profile`);
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        setPatient(data);
        setFormData(data);
      } catch (err) {
        console.error("Error fetching patient data:", err);
        setError(err.message);

        // 💖 fallback demo data (shown when API fails)
        const demoPatient = {
          initials: "AM",
          name: "Ahmad Mansour",
          email: "ahmad.mansour@email.com",
          phone: "+961 (11) 123-4567",
        };

        const demoHistory = [
          { id: 1, type: "Cardiology Consultation", doctor: "Dr. Layla Khoury", date: "Oct 15, 2024", time: "2:30 PM", status: "Completed" },
          { id: 2, type: "Medication Prescription", doctor: "Dr. Layla Khoury", date: "Oct 15, 2024", details: "Lisinopril 10mg - Take once daily with food" },
          { id: 3, type: "Follow-up Appointment", doctor: "Dr. Layla Khoury", date: "Nov 5, 2024", time: "10:00 AM", status: "Scheduled" },
        ];

        setPatient(demoPatient);
        setFormData(demoPatient);
        setHistory(demoHistory);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [patientId]);

  const handleCancel = (id) => {
    setHistory((prev) => prev.map((item) => (item.id === id ? { ...item, status: "Cancelled" } : item)));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    setPatient(formData);
    setIsEditing(false);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="patient-profile-page">
      <PatientHeader />

      {error && (
        <div className="error-message">
          <p>⚠️ Failed to fetch patient data, showing demo info.</p>
        </div>
      )}

      <div className="profile-content">
        <PatientCard
          patient={patient}
          isEditing={isEditing}
          formData={formData}
          handleChange={handleChange}
          handleSave={handleSave}
          setIsEditing={setIsEditing}
        />
        <PatientHistory history={history} handleCancel={handleCancel} />
      </div>
    </div>
  );
}
