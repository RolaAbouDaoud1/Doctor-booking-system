import { useState, useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorSearchPage from "./pages/DoctorSearchPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/Login";
import PatientDashboard from "./pages/PatientDashboard";
import Register from "./pages/Register";
import DoctorProfile from "./pages/DoctorProfile";
import PatientProfile from "./pages/PatientProfile";
import BookAppointment from "./pages/BookAppointment";
import ForgotPassword from "./components/forgot-pass";

function App() {
  const [showDropList, setShowDropList] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [role, setRole] = useState(() => localStorage.getItem("role") || null);
  const patientId = localStorage.getItem("patientId");
  const doctorId = localStorage.getItem("doctorId");
  useEffect(() => {
    if (role === null) {
      localStorage.removeItem("role");
    } else {
      localStorage.setItem("role", role);
    }
  }, [role]);
  useEffect(() => {
    console.log(
      "Patient ID:",
      patientId,
      "Doctor ID:",
      doctorId,
      "role:",
      role
    );
  }, [patientId, doctorId, role]);

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                showDropList={showDropList}
                setShowDropList={setShowDropList}
              />
            }
          />
          <Route
            path="/doctor/:doctorId/profile"
            element={<DoctorProfile doctorId={doctorId} />}
          />
          <Route
            path="/patient/:patientId/profile"
            element={<PatientProfile patientId={patientId} />}
          />
          <Route
            path="/search"
            element={
              <DoctorSearchPage
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                setShowDropList={setShowDropList}
                showDropList={showDropList}
                patientId={patientId}
              />
            }
          />
          <Route
            path="/doctor-dashboard"
            element={
              <DoctorDashboard
                showDropList={showDropList}
                setShowDropList={setShowDropList}
                doctorId={doctorId}
              />
            }
          />
          <Route
            path="/patient-dashboard"
            element={
              <PatientDashboard
                showDropList={showDropList}
                setShowDropList={setShowDropList}
                patientId={patientId}
              />
            }
          />
          <Route
            path="/login"
            element={
              <LoginPage
                showDropList={showDropList}
                setShowDropList={setShowDropList}
                patientId={patientId}
                doctorId={doctorId}
              />
            }
          />
          <Route
            path="/register"
            element={
              <Register
                showDropList={showDropList}
                setShowDropList={setShowDropList}
                patientId={patientId}
                doctorId={doctorId}
              />
            }
          />
          <Route path="forgot-pass" element={<ForgotPassword />} />
          {/* <Route path="/book" element={<BookAppointment />} /> */}
          <Route
            path="/book/:doctorId"
            element={<BookAppointment patientId={patientId} />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
