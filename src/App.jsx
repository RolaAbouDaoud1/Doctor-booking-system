import { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorSearchPage from "./pages/DoctorSearchPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/Login";
import PatientDashboard from "./pages/PatientDashboard";
import Register from './pages/Register';
import DoctorProfile from "./pages/DoctorProfile";
import PatientProfile from "./pages/PatientProfile";

function App() {
  const [showDropList, setShowDropList] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("Doctor");
  localStorage.setItem("loggedIn", loggedIn);
  localStorage.setItem("role", role);
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
 <Route path="/doctor/:doctorId/profile" element={<DoctorProfile />} />
        <Route path="/patient/:patientId/profile" element={<PatientProfile />} />
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
<Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/login" element={<LoginPage/>} />
         <Route path="/register" element={<Register/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
