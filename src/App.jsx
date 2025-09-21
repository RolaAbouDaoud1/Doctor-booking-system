
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DoctorProfile from "./DoctorProfile";
import PatientProfile from "./PatientProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/doctors/:id" element={<DoctorProfile />} />
        <Route path="/patients/:id" element={<PatientProfile/>} />
      </Routes>
    </Router>
  );
}

export default App;
