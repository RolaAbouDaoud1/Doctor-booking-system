import './App.css';
import LoginPage from "./loginPage";
import ForgotPassword from './forgotPassword';
import SignUp from './signUp';
import LandingPage from "./HomePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
   return(
      <Router>
         <Routes>
            <Route path="/" element={<LoginPage/>}/>
            <Route path="/forgotPassword" element={<ForgotPassword/>} />
            <Route path="/signUp" element={<SignUp/>} />
            <Route path="/HomePage" element={<LandingPage />} />
         </Routes>
      </Router>
   );
}

export default App;
