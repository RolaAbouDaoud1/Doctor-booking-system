import React, { useState } from "react";
import { Link } from "react-router-dom";
import {useNavigate } from "react-router-dom";
import "./loginPage.css";
import "@fortawesome/fontawesome-free/css/all.min.css";


export default function SignUp(){
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [date, setDate] = useState("");
    const [role, setRole]= useState("Patient");
    const [email, setEmail]= useState("");
    const [password, setPassword]= useState("");
    const [showPassword, setShowPassword]= useState(false);
    
    const [fullNameError, setFullNameError]=useState("");
    const [phoneError, setPhoneError]=useState("");
    const [dateError, setDateError]=useState("");
    const [emailError, setEmailError]= useState("");
    const [passwordError, setPasswordError] = useState("");

     const signUpData = {
        role,
        fullName,
        phone,
        date,
        email,
        password,
    };

    const validateEmail= (email) =>{
        const regex= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

   
    const handleSubmit = (e) =>{
        e.preventDefault();
        let valid=true;

        setFullNameError("");
        setFullNameError("");
        setPhoneError("");
        setDateError("");
        setEmailError("");
        setPasswordError("");

        if(!fullName.trim()){
            setFullNameError("Full name is required");
            valid=false;
        }else if(!/^[a-zA-Z\s]+$/.test(fullName)){
            setFullName("Full name must contain only letters");
            valid=false;
        }

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

        if(!phone){
            setPhoneError("Phone number must be 8-15 digits");
            valid=false;
        }

        if(!date){
            setDateError("Date of birth is required");
            valid=false;
        }else{
            const today= new Date();
            const dob= new Date(date);
            if(dob>today){
                setDateError("Date cannot be in future");
                valid=false;
            }
        }
        if(valid){
            navigate("/");
            console.log("sending Sign Up data: ", signUpData);
        }

    };

    return(
        <div className="login-container">
            <div className="head">
                <button className="goback"> <Link to="/loginPage" className="back-btn">&larr;</Link> </button>
                <h1 className="login-title">Create Account</h1>
            </div>
            <div className="role-section">
                <p className="iam">Join as:</p>
                <div className="role-buts">
                    <button className={role === "Patient" ? "active" : ""} onClick={()=>setRole("Patient")}>Patient</button>
                    <button className={role === "Doctor" ? "active" : ""} onClick={()=>setRole("Doctor")}>Doctor</button>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <h1 className="title">Basic Information</h1>
                <div className="form-group">
                    <label>Full Name</label>
                    <input type="text"
                            placeholder="Enter your full name"
                            value={fullName}
                            className="input-field"
                            onChange={(e) => setFullName(e.target.value)} />
                    {fullNameError && <p className="error">{fullNameError}</p>}
                </div>
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
                        {passwordError && <p className="error">{passwordError}</p>}
                    </div>
                </div>
                <div className="form-group">
                    <label>Phone Number</label>
                    <input type="number"
                            placeholder="Enter your phone number"
                            className="input-field"
                            value={phone}
                            onChange={(e) =>setPhone(e.target.value)} />
                    {phoneError && <p className="error">{phoneError}</p>}
                </div>
                <div className="form-group">
                    <label>Date of Birth</label>
                    <input type="date"
                            value={date}
                            className="input-field"
                            onChange={(e)=>setDate(e.target.value)} />
                    {dateError && <p className="error">{dateError}</p>}
                </div>
                <div>
                    <button type="submit" className="create">Create Account</button>
                </div>
               
            </form>
        </div>
    );
}