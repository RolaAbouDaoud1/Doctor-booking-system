import React, { useState } from "react";
import "../pages/design.css";

export default function RegisterDoctor({ onChange, errors }) {
  const [languages, setLanguages] = useState([]);
  const [language, setLanguage] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [bio, setBio] = useState("");
  const [clinicLocation, setClinicLocation] = useState({ lat: "", lng: "" });
  const [city, setCity] = useState("");
  const [services, setServices] = useState([]);
  const [service, setService] = useState("");
  const [specialities, setSpecialities] = useState([]);
  const [spec, setSpec] = useState("");

  // Add / Remove handlers
  const handleAddLanguage = () => {
    if (language.trim()) {
      const updated = [...languages, language.trim()];
      setLanguages(updated);
      setLanguage("");
      onChange && onChange({ languages: updated });
    }
  };
  const handleRemoveLanguage = (index) => {
    const updated = languages.filter((_, i) => i !== index);
    setLanguages(updated);
    onChange && onChange({ languages: updated });
  };

  const handleAddService = () => {
    if (service.trim()) {
      const updated = [...services, service.trim()];
      setServices(updated);
      setService("");
      onChange && onChange({ services: updated });
    }
  };
  const handleRemoveService = (index) => {
    const updated = services.filter((_, i) => i !== index);
    setServices(updated);
    onChange && onChange({ services: updated });
  };

  const handleAddSpeciality = () => {
    if (spec.trim()) {
      const updated = [...specialities, spec.trim()];
      setSpecialities(updated);
      setSpec("");
      onChange && onChange({ specialities: updated });
    }
  };
  const handleRemoveSpeciality = (index) => {
    const updated = specialities.filter((_, i) => i !== index);
    setSpecialities(updated);
    onChange && onChange({ specialities: updated });
  };

  const handleLocationChange = (field, value) => {
    const updated = { ...clinicLocation, [field]: value };
    setClinicLocation(updated);
    onChange && onChange({ clinicLocation: updated });
  };

  return (
    <div className="doctor-section">
      {/* Languages */}
      <div className="form-group">
        <label>Languages</label>
        <input type="text" value={language} placeholder="Add a language"
          className="input-field" onChange={(e) => setLanguage(e.target.value)} />
        <button type="button" className="add" onClick={handleAddLanguage}>Add</button>
        {errors?.languages && <p className="error">{errors.languages}</p>}
        <ul className="list">
          {languages.map((item, i) => (
            <li key={i}>
              {item} <button type="button" className="delete" onClick={() => handleRemoveLanguage(i)}><i className="fa-solid fa-x"></i></button>
            </li>
          ))}
        </ul>
      </div>

      {/* Years of Experience */}
      <div className="form-group">
        <label>Years of Experience</label>
        <input type="number" min="0" value={yearsOfExperience} className="input-field"
          placeholder="Enter years" onChange={(e) => { setYearsOfExperience(e.target.value); onChange && onChange({ yearsOfExperience: e.target.value }); }} />
        {errors?.yearsOfExperience && <p className="error">{errors.yearsOfExperience}</p>}
      </div>

      {/* Bio */}
      <div className="form-group">
        <label>Bio</label>
        <textarea value={bio} className="input-field" placeholder="Enter bio"
          onChange={(e) => { setBio(e.target.value); onChange && onChange({ bio: e.target.value }); }} />
        {errors?.bio && <p className="error">{errors.bio}</p>}
      </div>

      {/* Clinic Location */}
      <div className="form-group">
        <label>Clinic Location</label>
        <input type="number" placeholder="Latitude" value={clinicLocation.lat} className="input-field"
          onChange={(e) => handleLocationChange("lat", e.target.value)} />
        <input type="number" placeholder="Longitude" value={clinicLocation.lng} className="input-field"
          onChange={(e) => handleLocationChange("lng", e.target.value)} />
        {errors?.clinicLocation && <p className="error">{errors.clinicLocation}</p>}
      </div>

      {/* City */}
      <div className="form-group">
        <label>City</label>
        <input value={city} className="input-field" placeholder="Enter city"
          onChange={(e) => { setCity(e.target.value); onChange && onChange({ city: e.target.value }); }} />
        {errors?.city && <p className="error">{errors.city}</p>}
      </div>

      {/* Services */}
      <div className="form-group">
        <label>Services</label>
        <input value={service} className="input-field" placeholder="Add a service"
          onChange={(e) => setService(e.target.value)} />
        <button type="button" className="add" onClick={handleAddService}>Add</button>
        {errors?.services && <p className="error">{errors.services}</p>}
        <ul className="list">
          {services.map((s, i) => (
            <li key={i}>
              {s} <button type="button" className="delete" onClick={() => handleRemoveService(i)}><i className="fa-solid fa-x"></i></button>
            </li>
          ))}
        </ul>
      </div>

      {/* Specialities */}
      <div className="form-group">
        <label>Specialities</label>
        <input value={spec} className="input-field" placeholder="Add a speciality"
          onChange={(e) => setSpec(e.target.value)} />
        <button type="button" className="add" onClick={handleAddSpeciality}>Add</button>
        {errors?.specialities && <p className="error">{errors.specialities}</p>}
        <ul className="list">
          {specialities.map((s, i) => (
            <li key={i}>
              {s} <button type="button" className="delete" onClick={() => handleRemoveSpeciality(i)}><i className="fa-solid fa-x"></i></button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
