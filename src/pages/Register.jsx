import "@fortawesome/fontawesome-free/css/all.min.css";
import Cookies from "js-cookie";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RegisterDoctor from "../components/register-doctor";
import RegisterPatient from "../components/register-patient";
import NavBarLg from "../components/sections/NavBarLg";
import "./design.css";

export default function Register() {
  const navigate = useNavigate();
  const baseUrl = "http://localhost:8080";
  const [token, setToken] = useState(Cookies.get("token") || "");

  // Basic info
  const [name, setName] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // const [avatar, setAvatar] = useState("");
  const [Gender, setGender] = useState("Male");

  // Error states
  const [nameError, setNameError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  // const [avatarError, setAvatarError] = useState("");

  // Patient / Doctor data
  const [patientData, setPatientData] = useState({});
  const [patientErrors, setPatientErrors] = useState({
    dateOfBirth: "",
    insuranceNumber: "",
  });

  const [doctorData, setDoctorData] = useState({
    languages: [],
    yearsOfExperience: "",
    bio: "",
    clinicLocation: {
      x: "",
      y: "",
      type: "Point",
      coordinates: ["", ""],
    },
    city: "",
    services: [],
    specialties: [],
  });

  const [doctorErrors, setDoctorErrors] = useState({});

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const resetAll = () => {
    setName("");
    setFullName("");
    setPhone("");
    setEmail("");
    setPassword("");
    // setAvatar("");
    setGender("Male");
    setPatientData({});
    setDoctorData({
      languages: [],
      yearsOfExperience: "",
      bio: "",
      clinicLocation: {
        x: "",
        y: "",
        type: "Point",
        coordinates: ["", ""],
      },
      city: "",
      services: [],
      specialties: [],
    });
    setNameError("");
    setFullNameError("");
    setPhoneError("");
    setEmailError("");
    setPasswordError("");
    // setAvatarError("");
    setPatientErrors({ dateOfBirth: "", insuranceNumber: "" });
    setDoctorErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    const newPatientErrors = { dateOfBirth: "", insuranceNumber: "" };
    const newDoctorErrors = {};

    // Reset previous errors
    setNameError("");
    setFullNameError("");
    setPhoneError("");
    setEmailError("");
    setPasswordError("");
    // setAvatarError("");
    setPatientErrors({ dateOfBirth: "", insuranceNumber: "" });
    setDoctorErrors({});

    // Validation
    if (!name.trim()) {
      setNameError("Name is required");
      valid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(name)) {
      setNameError("Name must contain only letters");
      valid = false;
    }

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

    if (role === "Patient") {
      if (!patientData.dateOfBirth) {
        newPatientErrors.dateOfBirth = "Date of birth is required";
        valid = false;
      }

      if (!patientData.insuranceNumber) {
        newPatientErrors.insuranceNumber = "Insurance number is required";
        valid = false;
      } else if (!/^[A-Za-z0-9-]+$/.test(patientData.insuranceNumber)) {
        newPatientErrors.insuranceNumber =
          "Insurance number must be alphanumeric";
        valid = false;
      }

      setPatientErrors(newPatientErrors);
    }

    if (role === "Doctor") {
      if (!doctorData.languages.length) {
        newDoctorErrors.languages = "Please add at least one language";
        valid = false;
      }
      if (!doctorData.yearsOfExperience || doctorData.yearsOfExperience < 0) {
        newDoctorErrors.yearsOfExperience = "Enter valid years of experience";
        valid = false;
      }
      if (!doctorData.bio.trim()) {
        newDoctorErrors.bio = "Bio is required";
        valid = false;
      }
      if (
        !doctorData.clinicLocation.x ||
        !doctorData.clinicLocation.y ||
        !doctorData.clinicLocation.coordinates[0] ||
        !doctorData.clinicLocation.coordinates[1]
      ) {
        newDoctorErrors.clinicLocation =
          "Clinic location (x, y, and coordinates) is required";
        valid = false;
      }
      if (!doctorData.city.trim()) {
        newDoctorErrors.city = "City is required";
        valid = false;
      }
      if (!doctorData.services.length) {
        newDoctorErrors.services = "Add at least one service";
        valid = false;
      }
      if (!doctorData.specialties.length) {
        newDoctorErrors.specialties = "Add at least one specialty";
        valid = false;
      }
      setDoctorErrors(newDoctorErrors);
    }

    if (!valid) {
      console.log("Form not valid");
      return;
    }

    // Prepare request
    const baseData = { name, role, fullName, phone, email, password, Gender };
    const finalData =
      role === "Patient"
        ? { ...baseData, ...patientData }
        : { ...baseData, ...doctorData };

    const url =
      role === "Patient"
        ? `${baseUrl}/api/v1/auth/register-patient`
        : `${baseUrl}/api/v1/auth/register-doctor;`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify(finalData),
        credentials: "include",
      });

      const text = await response.text();

      let result;
      try {
        result = JSON.parse(text);
      } catch (err) {
        throw new Error("Invalid JSON response from backend: " + text);
      }

      if (!response.ok) {
        throw new Error(HTTP`${response.status}: ${text}`);
      }

      console.log("Registration successful:", result);

      // Store token if provided
      if (result.token) {
        Cookies.set("token", result.token, {
          secure: true,
          sameSite: "Strict",
        });
        setToken(result.token);
      }

      Cookies.set("userEmail", email);
      Cookies.set("userRole", role);

      resetAll();
      navigate("/");
    } catch (error) {
      console.error("Error during registration:", error.message);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <>
      <NavBarLg />
      <div className="login-container">
        <div className="head">
          <button className="goback">
            <Link to="/" className="back-btn">
              &larr;
            </Link>
          </button>
          <h1 className="login-title">Create Account</h1>
        </div>

        <div className="role-section">
          <p className="iam">Join as:</p>
          <div className="role-buts">
            <button
              type="button"
              className={role === "Patient" ? "active" : ""}
              onClick={() => setRole("Patient")}
            >
              Patient
            </button>
            <button
              type="button"
              className={role === "Doctor" ? "active" : ""}
              onClick={() => setRole("Doctor")}
            >
              Doctor
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <h1 className="title">Basic Information</h1>

          {/* Name */}
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={name}
              className="input-field"
              onChange={(e) => setName(e.target.value)}
            />
            {nameError && <p className="error">{nameError}</p>}
          </div>

          {/* Full Name */}
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

          {/* Email */}
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

          {/* Password */}
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
                className={`fas ${
                  showPassword ? "fa-eye-slash" : "fa-eye"
                } eye-icon`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
              {passwordError && <p className="error">{passwordError}</p>}
            </div>
          </div>

          {/* Phone */}
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

          {/* Avatar */}
          {/* <div className="form-group">
          <label>Avatar URL</label>
          <input
            type="text"
            value={avatar}
            className="input-field"
            placeholder="Enter your avatar URL"
            onChange={(e) => setAvatar(e.target.value)}
          />
          {avatarError && <p className="error">{avatarError}</p>}
        </div> */}

          {/* Gender */}
          <div className="form-group">
            <label>Gender</label>
            <div className="label-radio">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={Gender === "Male"}
                  onChange={(e) => setGender(e.target.value)}
                />{" "}
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={Gender === "Female"}
                  onChange={(e) => setGender(e.target.value)}
                />{" "}
                Female
              </label>
            </div>
          </div>

          {/* Role-specific form */}
          {role === "Patient" && (
            <RegisterPatient
              data={patientData}
              setData={setPatientData}
              errors={patientErrors}
            />
          )}
          {role === "Doctor" && (
            <RegisterDoctor
              data={doctorData}
              setData={setDoctorData}
              errors={doctorErrors}
            />
          )}

          <button type="submit" className="create">
            Create Account
          </button>
        </form>
      </div>
    </>
  );
}
