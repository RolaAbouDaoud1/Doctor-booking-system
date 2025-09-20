import React from "react";
import { Route,BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
function App() {
  const [darkMode, setDarkMode] = React.useState(false);
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage darkMode={darkMode} setDarkMode={setDarkMode}/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
