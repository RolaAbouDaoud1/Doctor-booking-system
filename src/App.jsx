import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DoctorProfile from "./pages/DoctorProfile";
import PatientProfile from "./pages/PatientProfile";

function App() {
  return (
    <Router>
      <Routes>
       
        <Route path="/doctor/:doctorId/profile" element={<DoctorProfile />} />
        <Route path="/patient/:patientId/profile" element={<PatientProfile />} />
      </Routes>
    </Router>
  );
}

export default App;


