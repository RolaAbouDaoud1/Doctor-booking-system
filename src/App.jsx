import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DoctorProfile from "./dr/DoctorProfile";
import PatientProfile from "./patient/PatientProfile";

function App() {
  return (
    <Router>
      <Routes>
        {/* :doctorId means dynamic parameter */}
        <Route path="/doctor/:doctorId/profile" element={<DoctorProfile />} />
        
        {/* :patientId dynamic parameter */}
        <Route path="/patient/:patientId/profile" element={<PatientProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
