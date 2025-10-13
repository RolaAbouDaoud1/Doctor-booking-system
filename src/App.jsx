import React from "react";
import{ BrowserRouter as Router,Routes, Route} from "react-router-dom";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";

function App(){
  return (
    <Router>
      <Routes>
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
      </Routes>
    </Router>
  );
}
export default App;
