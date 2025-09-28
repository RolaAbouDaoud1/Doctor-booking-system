import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import './design.css';
import RegisterPatient from "../components/register-patient";
import RegisterDoctor from "../components/register-doctor";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Register() {
  const navigate = useNavigate();
  const baseUrl = "http://localhost:8080"; 

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [gender, setGender] = useState("Male");

  const [fullNameError, setFullNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [avatarError, setAvatarError] = useState("");

  const [patientData, setPatientData] = useState({});
  const [patientErrors, setPatientErrors] = useState({ dateOfBirth: "" });

   const [doctorData, setDoctorData] = useState({
    languages: [],
    yearsOfExperience: "",
    bio: "",
    clinicLocation: { lat: "", lng: "" },
    city: "",
    services: [],
    specialities: [],
  });
  const [doctorErrors, setDoctorErrors] = useState({});

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    const newErrors = { dateOfBirth: "" };
    const errors = {};

    setFullNameError("");
    setPhoneError("");
    setEmailError("");
    setPasswordError("");
    setAvatarError("");

    if (!fullName.trim()) {
      setFullNameError("Full name is required");
      valid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(fullName)) {
      setFullNameError("Full name must contain only letters");
      valid = false;
    }

    if (!email) {
      setEmailError("Email is required");
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      valid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      valid = false;
    }

    if (!phone) {
      setPhoneError("Phone number is required");
      valid = false;
    }

    if (!avatar) {
      setAvatarError("Avatar URL is required");
      valid = false;
    }
    //error validation for patient
     if (!patientData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
      valid = false;
    }

    setPatientErrors(newErrors);

    //error validation for doctor
    if (!doctorData.languages.length) {
      errors.languages = "Please add at least one language";
      valid = false;
    }

    if (!doctorData.yearsOfExperience || doctorData.yearsOfExperience < 0) {
      errors.yearsOfExperience = "Enter valid years of experience";
      valid = false;
    }

    if (!doctorData.bio.trim()) {
      errors.bio = "Bio is required";
      valid = false;
    }

    if (!doctorData.clinicLocation.lat || !doctorData.clinicLocation.lng) {
      errors.clinicLocation = "Clinic latitude and longitude are required";
      valid = false;
    }

    if (!doctorData.city.trim()) {
      errors.city = "City is required";
      valid = false;
    }

    if (!doctorData.services.length) {
      errors.services = "Add at least one service";
      valid = false;
    }

    if (!doctorData.specialities.length) {
      errors.specialities = "Add at least one speciality";
      valid = false;
    }

    setDoctorErrors(errors);

    if (!valid) return;

    const baseData = { role, fullName, phone, email, password, avatar, gender };
    const finalData = role === "Patient" ? { ...baseData, ...patientData } : { ...baseData, ...doctorData };
    const url =
      role === "Patient"
        ? `${baseUrl}/api/v1/auth/register-patient`
        : `${baseUrl}/api/v1/auth/register-doctor`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(errMsg || "Failed to register");
      }

      const result = await response.json();
      console.log("Registration successful:", result);
      navigate("/"); // redirect after success
    } catch (error) {
      console.error("Error during registration:", error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="head">
        <button className="goback">
          <Link to="/loginPage" className="back-btn">&larr;</Link>
        </button>
        <h1 className="login-title">Create Account</h1>
      </div>

      <div className="role-section">
        <p className="iam">Join as:</p>
        <div className="role-buts">
          <button className={role === "Patient" ? "active" : ""} onClick={() => setRole("Patient")}>Patient</button>
          <button className={role === "Doctor" ? "active" : ""} onClick={() => setRole("Doctor")}>Doctor</button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <h1 className="title">Basic Information</h1>

        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            className="input-field"
            onChange={(e) => setFullName(e.target.value)}
          />
          {fullNameError && <p className="error">{fullNameError}</p>}
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            className="input-field"
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <p className="error">{emailError}</p>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className={`input-field ${passwordError ? "error-border" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <i
              className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} eye-icon`}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
            {passwordError && <p className="error">{passwordError}</p>}
          </div>
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="number"
            placeholder="Enter your phone number"
            className="input-field"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {phoneError && <p className="error">{phoneError}</p>}
        </div>

        <div className="form-group">
          <label>Avatar URL</label>
          <input
            type="text"
            value={avatar}
            className="input-field"
            placeholder="Enter your avatar URL"
            onChange={(e) => setAvatar(e.target.value)}
          />
          {avatarError && <p className="error">{avatarError}</p>}
        </div>

        <div className="form-group">
          <label>Gender</label>
          <div className="label-radio">
            <label>
              <input type="radio" name="gender" value="Male" checked={gender === "Male"} onChange={(e) => setGender(e.target.value)} />
              Male
            </label>
            <label>
              <input type="radio" name="gender" value="Female" checked={gender === "Female"} onChange={(e) => setGender(e.target.value)} />
              Female
            </label>
          </div>
        </div>

        {role === "Patient" && (
          <RegisterPatient
            data={patientData}
            setData={setPatientData}
            errors={patientErrors}
            setErrors={setPatientErrors}
          />
        )}

         {role === "Doctor" && (
          <RegisterDoctor
            data={doctorData}
            setData={setDoctorData}
            errors={doctorErrors}
          />
        )}

        <div>
          <button type="submit" className="create">Create Account</button>
        </div>
      </form>
    </div>
  );
}
