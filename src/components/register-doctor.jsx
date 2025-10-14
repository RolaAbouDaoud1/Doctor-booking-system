import React, { useState } from "react";
import "../pages/design.css";

export default function RegisterDoctor({ data = {}, setData, errors = {} }) {
  const [language, setLanguage] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [specialtyName, setSpecialtyName] = useState("");
  const [specialtyYears, setSpecialtyYears] = useState("");
  const [major, setMajor] = useState(false);

  const clinicLocation = data.clinicLocation || {
    x: "",
    y: "",
    type: "string",
    coordinates: ["", ""],
  };

  // 🔹 Languages
  const handleAddLanguage = () => {
    if (language.trim()) {
      const updated = [...(data.languages || []), language.trim()];
      setData((prev) => ({ ...prev, languages: updated }));
      setLanguage("");
    }
  };

  const handleRemoveLanguage = (index) => {
    const updated = (data.languages || []).filter((_, i) => i !== index);
    setData((prev) => ({ ...prev, languages: updated }));
  };

  // 🔹 Services
  const handleAddService = () => {
    if (serviceName.trim() && servicePrice) {
      const updated = [
        ...(data.services || []),
        { serviceName: serviceName.trim(), price: parseFloat(servicePrice) },
      ];
      setData((prev) => ({ ...prev, services: updated }));
      setServiceName("");
      setServicePrice("");
    }
  };

  const handleRemoveService = (index) => {
    const updated = (data.services || []).filter((_, i) => i !== index);
    setData((prev) => ({ ...prev, services: updated }));
  };

  // 🔹 Specialties
  const handleAddSpecialty = () => {
    if (specialtyName.trim() && specialtyYears) {
      const updated = [
        ...(data.specialties || []),
        {
          name: specialtyName.trim(),
          yearsExperience: parseInt(specialtyYears),
          major: Boolean(major),
        },
      ];
      setData((prev) => ({ ...prev, specialties: updated }));
      setSpecialtyName("");
      setSpecialtyYears("");
      setMajor(false);
    }
  };

  const handleRemoveSpecialty = (index) => {
    const updated = (data.specialties || []).filter((_, i) => i !== index);
    setData((prev) => ({ ...prev, specialties: updated }));
  };

  // 🔹 Clinic Location
  const handleLocationChange = (field, value) => {
    const updated = { ...clinicLocation };

    if (field === "x" || field === "y") {
      updated[field] = parseFloat(value);
    } else if (field === "coordinates0") {
      updated.coordinates[0] = parseFloat(value);
    } else if (field === "coordinates1") {
      updated.coordinates[1] = parseFloat(value);
    }

    setData((prev) => ({ ...prev, clinicLocation: updated }));
  };

  return (
    <div className="doctor-section">
      {/* Languages */}
      <div className="form-group">
        <label>Languages</label>
        <input
          type="text"
          placeholder="Add a language"
          value={language}
          className="input-field"
          onChange={(e) => setLanguage(e.target.value)}
        />
        <button type="button" className="add" onClick={handleAddLanguage}>
          Add
        </button>
        {errors.languages && <p className="error">{errors.languages}</p>}
        <ul className="list">
          {(data.languages || []).map((lang, i) => (
            <li key={i}>
              {lang}{" "}
              <button
                type="button"
                className="delete"
                onClick={() => handleRemoveLanguage(i)}
              >
                <i className="fa-solid fa-x"></i>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Years of Experience */}
      <div className="form-group">
        <label>Total Years of Experience</label>
        <input
          type="number"
          min="0"
          value={data.yearsOfExperience || ""}
          className="input-field"
          placeholder="Enter total years"
          onChange={(e) =>
            setData((prev) => ({
              ...prev,
              yearsOfExperience: parseInt(e.target.value),
            }))
          }
        />
        {errors.yearsOfExperience && (
          <p className="error">{errors.yearsOfExperience}</p>
        )}
      </div>

      {/* Bio */}
      <div className="form-group">
        <label>Bio</label>
        <textarea
          value={data.bio || ""}
          className="input-field"
          placeholder="Enter bio"
          onChange={(e) =>
            setData((prev) => ({ ...prev, bio: e.target.value }))
          }
        />
        {errors.bio && <p className="error">{errors.bio}</p>}
      </div>

      {/* Clinic Location */}
      <div className="form-group">
        <label>Clinic Location</label>
        <input
          type="number"
          placeholder="X"
          value={clinicLocation.x}
          className="input-field"
          onChange={(e) => handleLocationChange("x", e.target.value)}
        />
        <input
          type="number"
          placeholder="Y"
          value={clinicLocation.y}
          className="input-field"
          onChange={(e) => handleLocationChange("y", e.target.value)}
        />
        <input
          type="number"
          placeholder="Coordinate 1"
          value={clinicLocation.coordinates[0]}
          className="input-field"
          onChange={(e) => handleLocationChange("coordinates0", e.target.value)}
        />
        <input
          type="number"
          placeholder="Coordinate 2"
          value={clinicLocation.coordinates[1]}
          className="input-field"
          onChange={(e) => handleLocationChange("coordinates1", e.target.value)}
        />
        {errors.clinicLocation && (
          <p className="error">{errors.clinicLocation}</p>
        )}
      </div>

      {/* City */}
      <div className="form-group">
        <label>City</label>
        <input
          value={data.city || ""}
          className="input-field"
          placeholder="Enter city"
          onChange={(e) => setData((prev) => ({ ...prev, city: e.target.value }))}
        />
        {errors.city && <p className="error">{errors.city}</p>}
      </div>

      {/* Services */}
      <div className="form-group">
        <label>Services</label>
        <input
          value={serviceName}
          className="input-field"
          placeholder="Service name"
          onChange={(e) => setServiceName(e.target.value)}
        />
        <input
          type="number"
          value={servicePrice}
          className="input-field"
          placeholder="Service price"
          onChange={(e) => setServicePrice(e.target.value)}
        />
        <button type="button" className="add" onClick={handleAddService}>
          Add
        </button>
        {errors.services && <p className="error">{errors.services}</p>}
        <ul className="list">
          {(data.services || []).map((s, i) => (
            <li key={i}>
              {s.serviceName} — ${s.price.toFixed(2)}{" "}
              <button
                type="button"
                className="delete"
                onClick={() => handleRemoveService(i)}
              >
                <i className="fa-solid fa-x"></i>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Specialties */}
      <div className="form-group">
        <label>Specialties</label>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            value={specialtyName}
            className="input-field"
            placeholder="Specialty name"
            onChange={(e) => setSpecialtyName(e.target.value)}
          />
          <input
            type="number"
            value={specialtyYears}
            className="input-field"
            placeholder="Years experience"
            onChange={(e) => setSpecialtyYears(e.target.value)}
          />
          <label>
            <input
              type="checkbox"
              checked={major}
              onChange={(e) => setMajor(e.target.checked)}
            />{" "}
            Major
          </label>
          <button type="button" className="add" onClick={handleAddSpecialty}>
            Add
          </button>
        </div>
        {errors.specialties && <p className="error">{errors.specialties}</p>}
        <ul className="list">
          {(data.specialties || []).map((s, i) => (
            <li key={i}>
              {s.name} — {s.yearsExperience} years —{" "}
              {s.major ? "Major" : "Minor"}{" "}
              <button
                type="button"
                className="delete"
                onClick={() => handleRemoveSpecialty(i)}
              >
                <i className="fa-solid fa-x"></i>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}