import React from "react";
import { Route,BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import DoctorSearchPage from "./pages/DoctorSearchPage";
function App() {
  const [darkMode, setDarkMode] = React.useState(false);
  const [showDropList, setShowDropList] = React.useState(false);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage darkMode={darkMode} setDarkMode={setDarkMode} setShowDropList={setShowDropList} showDropList={showDropList}/> } />
          <Route path="/search" element={<DoctorSearchPage darkMode={darkMode} setDarkMode={setDarkMode} setShowDropList={setShowDropList} showDropList={showDropList}/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
