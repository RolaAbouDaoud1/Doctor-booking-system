import "@fortawesome/fontawesome-free/css/all.min.css";
import Cookies from "js-cookie";
import { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import RegisterDoctor from "../components/register-doctor";
import NavBarLg from "../components/sections/NavBarLg";
import { jwtDecode } from "jwt-decode";
import "./design.css";

export default function Register({ showDropList, setShowDropList }) {
    const navigate = useNavigate();
  const baseUrl = "http://localhost:8080";

  const [token, setToken] = useState("");

  // eslint-disable-next-line no-unused-vars
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+961");
  const [role, setRole] = useState("Patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [Gender, setGender] = useState("Male");



  // Error states
  const [nameError, setNameError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Patient / Doctor data
  const [patientData, setPatientData] = useState({
    dateOfBirth: "",
    insuranceNumber: "",
    medicalHistory: [],
    medicalHistoryInput: "",
    allergies: [],
    allergyInput: ""
  });

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
// parent state `setPatientTotal` (if provided) will be updated after successful registration



  const [doctorErrors, setDoctorErrors] = useState({});

  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const resetAll = () => {
    setName("");
    setFullName("");
    setPhone("");
    setCountryCode("+961");
    setEmail("");
    setPassword("");
    setGender("Male");
    setPatientData({
      dateOfBirth: "",
      insuranceNumber: "",
      medicalHistory: [],
      medicalHistoryInput: "",
      allergies: [],
      allergyInput: ""
    });
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
    setPatientErrors({ dateOfBirth: "", insuranceNumber: "" });
    setDoctorErrors({});
  };

  // Date Picker Functions
  const openDatePicker = () => {
    setShowDatePicker(true);
    if (patientData.dateOfBirth) {
      const date = new Date(patientData.dateOfBirth);
      setCurrentMonth(date);
      setTempDate(date);
    } else {
      setCurrentMonth(new Date());
      setTempDate(null);
    }
  };

  const closeDatePicker = () => {
    setShowDatePicker(false);
  };

  const confirmDate = () => {
    if (tempDate) {
      const year = tempDate.getFullYear();
      const month = String(tempDate.getMonth() + 1).padStart(2, "0");
      const day = String(tempDate.getDate()).padStart(2, "0");
      setPatientData({ ...patientData, dateOfBirth: `${year}-${month}-${day}` });
    }
    closeDatePicker();
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];
    const today = new Date();

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(
        <button
          key={`prev-${i}`}
          type="button"
          className="calendar-day other-month"
        >
          {daysInPrevMonth - i}
        </button>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const btnDate = new Date(year, month, day);
      const isToday = today.toDateString() === btnDate.toDateString();
      const isSelected = tempDate && tempDate.toDateString() === btnDate.toDateString();

      days.push(
        <button
          key={`current-${day}`}
          type="button"
          className={`calendar-day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`}
          onClick={() => setTempDate(btnDate)}
        >
          {day}
        </button>
      );
    }

    // Next month days
    const remainingCells = 42 - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <button
          key={`next-${day}`}
          type="button"
          className="calendar-day other-month"
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

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

    // Basic validation
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

    // Patient-specific validation
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

    // Doctor-specific validation
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

    // Prepare request - combine country code with phone number
    const fullPhoneNumber = `${countryCode}${phone}`;
    const baseData = { name, role, fullName, phone: fullPhoneNumber, email, password, Gender };
    const finalData =
      role === "Patient"
        ? { ...baseData, ...patientData }
        : { ...baseData, ...doctorData };

    const url =
      role === "Patient"
        ? `${baseUrl}/api/v1/auth/register-patient`
        : `${baseUrl}/api/v1/auth/register-doctor`;

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
        throw new Error("Invalid JSON response from backend: " + err);
      }

      if (!response.ok) {
        throw new Error(`${response.status}: ${text}`);
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
      Cookies.set("role", role);

      localStorage.setItem("role", role);
      localStorage.setItem("username", name);
      // store an up-to-date snapshot of patient info instead of relying on possibly stale state
      const patientTotalToStore = {
        username: name,
        useremail: email,
        userphone: fullPhoneNumber,
        userallergies: patientData?.allergies || [],
      };
      if (typeof setPatientTotal === "function") {
        setPatientData(patientTotalToStore);
      }
      localStorage.setItem("patientTotal", JSON.stringify(patientTotalToStore));


      // Decode token
      const decoded = jwtDecode(result.token);
      console.log("Decoded token:", decoded);

      const namefromToken = decoded.name;
      const userId = decoded.id;
      if(role==="patient"){
        localStorage.setItem("patientId", userId);
      }
      else{
        localStorage.setItem("doctorId",userId);
      }
      console.log("name from token: ", namefromToken);

      resetAll();
      localStorage.setItem("loggedIn", "true");
      navigate("/");
      // Use loggedIn variable to make eslint-disable necessary
      if (loggedIn) {
        console.log("Already logged in");
      }

    } catch (error) {
      console.error("Error during registration:", error.message);
      alert("Registration failed. Please try again.");
    }
  };


  return (
    <>
      <NavBarLg setShowDropList={setShowDropList} showDropList={showDropList} />
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
            <div className="phone-input-wrapper">
              <div className="country-code-selector">
                <select 
                  className="country-code-select"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                >
                  <option value="+961">+961 (Lebanon)</option>
                  <option value="+1">+1 (USA/Canada)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+33">+33 (France)</option>
                  <option value="+49">+49 (Germany)</option>
                  <option value="+39">+39 (Italy)</option>
                  <option value="+34">+34 (Spain)</option>
                  <option value="+971">+971 (UAE)</option>
                  <option value="+966">+966 (Saudi Arabia)</option>
                  <option value="+20">+20 (Egypt)</option>
                  <option value="+962">+962 (Jordan)</option>
                  <option value="+963">+963 (Syria)</option>
                  <option value="+964">+964 (Iraq)</option>
                  <option value="+965">+965 (Kuwait)</option>
                  <option value="+968">+968 (Oman)</option>
                  <option value="+974">+974 (Qatar)</option>
                  <option value="+973">+973 (Bahrain)</option>
                </select>
              </div>
              <input
                type="tel"
                placeholder="Enter phone number"
                className="input-field phone-number-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            {phoneError && <p className="error">{phoneError}</p>}
          </div>

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

          {/* Patient Information - Built In */}
          {role === "Patient" && (
            <>
              <h2 className="title">Patient Information</h2>

              {/* Date of Birth with Custom Modal */}
              <div className="form-group">
                <label>Date of Birth</label>
                <div className="date-input-wrapper">
                  <button
                    type="button"
                    className={`date-display-btn ${!patientData.dateOfBirth ? "placeholder" : ""}`}
                    onClick={openDatePicker}
                  >
                    {patientData.dateOfBirth
                      ? formatDateDisplay(patientData.dateOfBirth)
                      : "Select your date of birth"}
                  </button>
                  <svg
                    className="calendar-icon-btn"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                {patientErrors.dateOfBirth && (
                  <p className="error">{patientErrors.dateOfBirth}</p>
                )}
              </div>

              {/* Insurance Number */}
              <div className="form-group">
                <label>Insurance Number</label>
                <input
                  type="text"
                  placeholder="Enter your insurance number"
                  className={`input-field ${patientErrors.insuranceNumber ? "error-border" : ""}`}
                  value={patientData.insuranceNumber || ""}
                  onChange={(e) =>
                    setPatientData({ ...patientData, insuranceNumber: e.target.value })
                  }
                />
                {patientErrors.insuranceNumber && (
                  <p className="error">{patientErrors.insuranceNumber}</p>
                )}
              </div>
              
              {/* Medical History */}
              <div className="form-group">
                <label>Medical History</label>
                <div className="input-with-button">
                  <input
                    type="text"
                    placeholder="Add medical condition"
                    className="input-field"
                    value={patientData.medicalHistoryInput || ""}
                    onChange={(e) => setPatientData({ ...patientData, medicalHistoryInput: e.target.value })}
                  />
                  <button
                    type="button"
                    className="add"
                    onClick={() => {
                      if (patientData.medicalHistoryInput?.trim()) {
                        const newHistory = patientData.medicalHistory ? 
                          [...patientData.medicalHistory, patientData.medicalHistoryInput.trim()] : 
                          [patientData.medicalHistoryInput.trim()];
                        setPatientData({ 
                          ...patientData, 
                          medicalHistory: newHistory,
                          medicalHistoryInput: "" 
                        });
                      }
                    }}
                  >
                    Add
                  </button>
                </div>
                {patientData.medicalHistory?.length > 0 && (
                  <ul className="list">
                    {patientData.medicalHistory.map((item, index) => (
                      <li key={index}>
                        {item}
                        <button
                          type="button"
                          className="delete"
                          onClick={() => {
                            const updatedHistory = patientData.medicalHistory.filter((_, i) => i !== index);
                            setPatientData({ ...patientData, medicalHistory: updatedHistory });
                          }}
                        >
                          <i className="fas fa-x"></i>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Allergies */}
              <div className="form-group">
                <label>Allergies</label>
                <div className="input-with-button">
                  <input
                    type="text"
                    placeholder="Add allergy"
                    className="input-field"
                    value={patientData.allergyInput || ""}
                    onChange={(e) => setPatientData({ ...patientData, allergyInput: e.target.value })}
                  />
                  <button
                    type="button"
                    className="add"
                    onClick={() => {
                      if (patientData.allergyInput?.trim()) {
                        const newAllergies = patientData.allergies ? 
                          [...patientData.allergies, patientData.allergyInput.trim()] : 
                          [patientData.allergyInput.trim()];
                        setPatientData({ 
                          ...patientData, 
                          allergies: newAllergies,
                          allergyInput: "" 
                        });
                      }
                    }}
                  >
                    Add
                  </button>
                </div>
                {patientData.allergies?.length > 0 && (
                  <ul className="list">
                    {patientData.allergies.map((item, index) => (
                      <li key={index}>
                        {item}
                        <button
                          type="button"
                          className="delete"
                          onClick={() => {
                            const updatedAllergies = patientData.allergies.filter((_, i) => i !== index);
                            setPatientData({ ...patientData, allergies: updatedAllergies });
                          }}
                        >
                          <i className="fas fa-x"></i>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}

          {/* Doctor Information */}
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

        {/* Date Picker Modal */}
        {showDatePicker && (
          <div className="date-modal-overlay" onClick={closeDatePicker}>
            <div className="date-picker-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Select Date</h3>
                <button type="button" className="close-modal-btn" onClick={closeDatePicker}>
                  ×
                </button>
              </div>

              <div className="calendar-nav">
                <button type="button" onClick={prevMonth}>
                  ‹
                </button>
                <div className="month-year-selector">
                  <select 
                    className="month-select"
                    value={currentMonth.getMonth()}
                    onChange={(e) => {
                      const newDate = new Date(currentMonth);
                      newDate.setMonth(parseInt(e.target.value));
                      setCurrentMonth(newDate);
                    }}
                  >
                    {months.map((month, index) => (
                      <option key={month} value={index}>{month}</option>
                    ))}
                  </select>
                  <select 
                    className="year-select"
                    value={currentMonth.getFullYear()}
                    onChange={(e) => {
                      const newDate = new Date(currentMonth);
                      newDate.setFullYear(parseInt(e.target.value));
                      setCurrentMonth(newDate);
                    }}
                  >
                    {Array.from({ length: 100 }, (_, i) => {
                      const year = new Date().getFullYear() - 80 + i;
                      return (
                        <option key={year} value={year}>{year}</option>
                      );
                    })}
                  </select>
                </div>
                <button type="button" onClick={nextMonth}>
                  ›
                </button>
              </div>

              <div className="calendar-weekdays">
                <div className="weekday">Su</div>
                <div className="weekday">Mo</div>
                <div className="weekday">Tu</div>
                <div className="weekday">We</div>
                <div className="weekday">Th</div>
                <div className="weekday">Fr</div>
                <div className="weekday">Sa</div>
              </div>

              <div className="calendar-days">{renderCalendar()}</div>

              <div className="modal-actions">
                <button type="button" className="modal-btn modal-btn-cancel" onClick={closeDatePicker}>
                  Cancel
                </button>
                <button type="button" className="modal-btn modal-btn-confirm" onClick={confirmDate}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}