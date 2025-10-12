import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DoctorHeader() {
  const navigate = useNavigate();

  return (
    <div className="header">
      <button className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
      </button>
      <h1 className="header-title">Doctor Profile</h1>
    </div>
  );
}
