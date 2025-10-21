import { useState } from "react";
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
  const [patientTotal,setPatientTotal] = useState("");
  // eslint-disable-next-line no-unused-vars
  // const patientId = localStorage.getItem("patientId");
  // const doctorId = localStorage.getItem("doctorId");
  
  // Use the variables to avoid ESLint warnings
  // console.log("Patient ID:", patientId, "Doctor ID:", doctorId);

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
            element={<DoctorProfile/>} 
          />
          <Route
            path="/patient/:patientId/profile"
            element={<PatientProfile 
              patientTotal={patientTotal} />}
          />
          <Route
            path="/search"
            element={
              <DoctorSearchPage
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                setShowDropList={setShowDropList}
                showDropList={showDropList}
                
              />
            }
          />
          <Route
            path="/doctor-dashboard"
            element={
              <DoctorDashboard
                showDropList={showDropList}
                setShowDropList={setShowDropList}
             
              />
            }
          />
          <Route
            path="/patient-dashboard"
            element={
              <PatientDashboard
                showDropList={showDropList}
                setShowDropList={setShowDropList}
              
              />
            }
          />
          <Route
            path="/login"
            element={
              <LoginPage
                showDropList={showDropList}
                setShowDropList={setShowDropList}
           
              />
            }
          />
          <Route
            path="/register"
            element={
              <Register
                showDropList={showDropList}
                setShowDropList={setShowDropList}
                setPatientTotal={setPatientTotal}
              />
            }
          />
          <Route path="forgot-pass" element={<ForgotPassword />} />
          {/* <Route path="/book" element={<BookAppointment />} /> */}
          <Route 
            path="/book/:doctorId" 
            element={<BookAppointment/>} 
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
