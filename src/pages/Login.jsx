import "@fortawesome/fontawesome-free/css/all.min.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBarLg from "../components/sections/NavBarLg";
import "./design.css";
import Cookies from "js-cookie";
import * as jwtDecode from "jwt-decode"; // ✅ Vite-compatible import

export default function LoginPage({ showDropList, setShowDropList }) {
  const navigate = useNavigate();
  const [role, setRole] = useState("Patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError(""); 
    setPasswordError("");

    if (!email) return setEmailError("Email is required");
    if (!validateEmail(email)) return setEmailError("Invalid email");
    if (!password) return setPasswordError("Password is required");
    if (password.length < 6) return setPasswordError("Password must be at least 6 characters");

    try {
      const res = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        const decoded = jwtDecode.default(data.token); 
        const userId = decoded.id || data.id || null;
        const nameFromToken = decoded.name || "User";

        // Save cookies and localStorage
        Cookies.set("token", data.token, { secure: true, sameSite: "Strict" });
        Cookies.set("userEmail", email);
        Cookies.set("userRole", role);

        localStorage.setItem("registrationToken", data.token);
        localStorage.setItem("userRole", role);
        localStorage.setItem("username", nameFromToken);

        if (role === "Doctor" && userId) localStorage.setItem("doctorId", userId);
        if (role === "Patient" && userId) localStorage.setItem("patientId", userId);

        navigate("/");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <>
      <NavBarLg setShowDropList={setShowDropList} showDropList={showDropList} />
      <div className="login-container">
        <div className="head">
          <button className="goback">
            <Link to="/" className="back-btn">&larr;</Link>
          </button>
          <h1 className="login-title">Welcome Back</h1>
        </div>

        <div className="role-section">
          <p className="iam">I am a:</p>
          <div className="role-buts">
            <button
              className={role === "Patient" ? "active" : ""}
              onClick={() => setRole("Patient")}
            >
              Patient
            </button>
            <button
              className={role === "Doctor" ? "active" : ""}
              onClick={() => setRole("Doctor")}
            >
              Doctor
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <h1 className="title">Sign in to Your Account</h1>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              className="input-field"
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <p className="error">{emailError}</p>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`input-field ${passwordError ? "error-border" : ""}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i
                className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} eye-icon`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>
            {passwordError && <p className="error">{passwordError}</p>}
          </div>

          <div className="forgot">
            <Link to="/forgot-pass" className="forgotpass">Forgot Password?</Link>
          </div>

          <button type="submit" className="signin-btn">Sign In</button>
        </form>

        <p className="signup-text">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </>
  );
}
