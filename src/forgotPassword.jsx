import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./loginPage.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;

    setEmailError("");

    if (!email) {
      setEmailError("Email is required");
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      valid = false;
    }

    if (valid) {
      console.log("Password reset link sent to:", email);
      navigate("/"); // redirect if email is valid
    }
  };

  return (
    <div className="login-container">
      <div className="head">
        <Link to="/" className="back-btn">&larr;</Link>
        <h1 className="login-title">Forgot Password</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <p className="reset-text">
          Please enter your email to reset your password
        </p>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            className={`input-field ${emailError ? "error-border" : ""}`}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <p className="error">{emailError}</p>}
        </div>

        <div>
          <button type="submit" className="signin-btn">
            Send Reset Link
          </button>
        </div>
      </form>
    </div>
  );
}
