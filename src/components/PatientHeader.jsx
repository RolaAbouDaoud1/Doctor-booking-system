import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PatientHeader() {
  const navigate = useNavigate();

  return (
    <div className="profile-header">
      <button className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
      </button>
      <h1>Patient Profile</h1>
    </div>
  );
}
