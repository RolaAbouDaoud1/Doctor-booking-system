import "@fortawesome/fontawesome-free/css/all.min.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBarLg from "../components/sections/NavBarLg";
import "./design.css";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Changed from: import * as jwtDecode from "jwt-decode";

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
        const decoded = jwtDecode(data.token);
        const userId = decoded.id || data.id || null;
        const nameFromToken = decoded.name || "User";
        const fullNameFromToken = decoded.fullName || decoded.name || nameFromToken; // ✅ Get fullName if available

        // Debug logging for MVP testing
        console.log("🔐 Login Debug:");
        console.log("  - Decoded token:", decoded);
        console.log("  - User ID from token:", userId);
        console.log("  - Role selected:", role);
        console.log("  - User name:", nameFromToken);
        console.log("  - Full name:", fullNameFromToken);

        // Save cookies and localStorage
        Cookies.set("token", data.token, { secure: true, sameSite: "Strict" });
        Cookies.set("userEmail", email);
        Cookies.set("userRole", role);

        localStorage.setItem("registrationToken", data.token);
        localStorage.setItem("userRole", role);
        localStorage.setItem("role", role);
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("username", nameFromToken);
        localStorage.setItem("fullName", fullNameFromToken); // ✅ Store fullName separately

        if (role === "Doctor" && userId) {
          localStorage.setItem("doctorId", String(userId));
          console.log("✅ Doctor ID saved to localStorage:", String(userId));
        } else if (role === "Doctor" && !userId) {
          console.warn("⚠️ Warning: Doctor role selected but no userId found in token!");
          console.warn("  - Decoded token keys:", Object.keys(decoded || {}));
          console.warn("  - Data keys:", Object.keys(data || {}));
        }
        
        if (role === "Patient" && userId) {
          localStorage.setItem("patientId", String(userId));
          console.log("✅ Patient ID saved to localStorage:", String(userId));
        }

        // Verify what was saved
        console.log("📦 localStorage after login:");
        console.log("  - loggedIn:", localStorage.getItem("loggedIn"));
        console.log("  - role:", localStorage.getItem("role"));
        console.log("  - username:", localStorage.getItem("username"));
        console.log("  - fullName:", localStorage.getItem("fullName")); // ✅ Log fullName
        console.log("  - doctorId:", localStorage.getItem("doctorId"));
        console.log("  - patientId:", localStorage.getItem("patientId"));

        navigate("/");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      console.error("  - Error details:", err.message);
      alert("Something went wrong: " + err.message);
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
