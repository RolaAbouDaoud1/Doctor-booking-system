import './App.css';
import LoginPage from './pages/Login';
import Register from './pages/Register';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
   return(
      <Router>
         <Routes>
            <Route path="/" element={<LoginPage/>}/>
            <Route path="/register" element={<Register/>}/>
         </Routes>
      </Router>
   );
}

export default App;
