<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DoctorProfile from "./dr/DoctorProfile";
import PatientProfile from "./patient/PatientProfile";
=======

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DoctorProfile from "./DoctorProfile";
import PatientProfile from "./PatientProfile";
>>>>>>> c80ad85e4e471be09c017fc211642a29866c423f

function App() {
  return (
    <Router>
      <Routes>
<<<<<<< HEAD
        {/* :doctorId means dynamic parameter */}
        <Route path="/doctor/:doctorId/profile" element={<DoctorProfile />} />
        
        {/* :patientId dynamic parameter */}
        <Route path="/patient/:patientId/profile" element={<PatientProfile />} />
=======
        <Route path="/doctors/:id" element={<DoctorProfile />} />
        <Route path="/patients/:id" element={<PatientProfile/>} />
>>>>>>> c80ad85e4e471be09c017fc211642a29866c423f
      </Routes>
    </Router>
  );
}

export default App;
