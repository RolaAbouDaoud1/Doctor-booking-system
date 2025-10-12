import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PatientHeader from "../components/PatientHeader";
import PatientCard from "../components/PatientCard";
import PatientHistory from "../components/PatientHistory";
import "./PatientProfile.css";

export default function PatientProfile() {
  const { patientId } = useParams(); // get patientId from URL

  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  // Fetch patient data from API
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/api/users/patient/${patientId}/profile`
        );
        if (!response.ok) throw new Error("Failed to fetch patient data");
        const data = await response.json();

        // Set patient info
        setPatient({
          initials: data.name.split(" ").map((n) => n[0]).join(""),
          name: data.name,
          email: data.email,
          phone: data.phone,
        });

        // Set editable form data
        setFormData({
          name: data.name,
          email: data.email,
          phone: data.phone,
        });

        // Set history if API provides it
        setHistory(data.history || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [patientId]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Save edited info
  const handleSave = () => {
    setPatient({
      ...patient,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    });
    setIsEditing(false);
  };

  // Cancel a history item
  const handleCancel = (id) => {
    setHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "Cancelled" } : item))
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!patient) return <p>No patient found</p>;

  return (
    <div className="patient-profile-page">
      <PatientHeader />
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
