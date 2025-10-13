import React from "react";
import{ BrowserRouter as Router,Routes, Route, BrowserRouter} from "react-router-dom";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";

function App(){
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
      </Routes>
    </div>
    </BrowserRouter>
  );
}
export default App;
