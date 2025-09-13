import React, { useState } from "react";
import { Link } from "react-router-dom";
import {useNavigate } from "react-router-dom";
import "./loginPage.css";
import "@fortawesome/fontawesome-free/css/all.min.css";


export default function LoginPage(){
    const navigate = useNavigate();
    const [role, setRole]= useState("Patient");
    const [email, setEmail]= useState("");
    const [password, setPassword]= useState("");
    const [showPassword, setShowPassword]= useState(false);

    const [emailError, setEmailError]= useState("");
    const [passwordError, setPasswordError] = useState("");

    const validateEmail= (email) =>{
        const regex= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const loginData = {
        role,
        email,
        password,
    };


    const handleSubmit = async (e) =>{
        e.preventDefault();
        let valid=true;

        if(!email){
            setEmailError("Email is required");
            valid=false;
        } else if(!validateEmail(email)){
            setEmailError("Please enter a valid email address");
            valid=false;
        }
       
        if(!password){
            setPasswordError("Password is required");
            valid=false;
        }else if(password.length <6){
            setPasswordError("Password must be at least 6 characters");
            valid=false;
        }
        if(valid){
            navigate("/HomePage");
            console.log("sending login data: ", loginData);
        }

        try {
            const response= await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers:{
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify(loginData)
            });

            if(response.ok){
                const data= await response.json();
                console.log("login success:", data);
                navigate("/HomePage")
            }
            else{
                const errorData=await response.json();
                console.error("Login failed:",errorData);
                alert(errorData.message || "Login failed");
            }
            
        } catch (error) {
            console.error("Error while logging in:", error);
            alert("Something went wrong, Please try again.");
        }

    };

    return(
        <div className="login-container">
            <div className="head">
                <button className="goback"> <Link to="/LandingPage" className="back-btn">&larr;</Link> </button>
                <h1 className="login-title">Welcome Back</h1>
            </div>
            <div className="role-section">
                <p className="iam">I am a:</p>
                <div className="role-buts">
                    <button className={role === "Patient" ? "active" : ""} onClick={()=>setRole("Patient")}>Patient</button>
                    <button className={role === "Doctor" ? "active" : ""} onClick={()=>setRole("Doctor")}>Doctor</button>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <h1 className="title">Sign in to Your Account</h1>
                <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" 
                           placeholder="Enter your email"
                           value={email}
                           className="input-field"
                           onChange={(e)=> setEmail(e.target.value)}
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
                    <Link to="/forgotPassword" className="forgotpass">Forgot Password?</Link>
                </div>
                <div>
                    <button type="submit" className="signin-btn">Sign In</button>
                </div>
               
            </form>
            <p className="signup-text">Don't have an account? <Link to="/SignUp">Sign Up</Link></p>
        </div>
    );
}