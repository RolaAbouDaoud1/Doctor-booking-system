import React, { useState } from "react";
import Step1SelectDate from "../components/Step1SelectDate";
import Step2Details from "../components/Step2Details";
import Step3Summary from "../components/Step3Summary";
import "./BookAppointment.css";

export default function BookAppointment() {
  const [step , setStep] = useState(1);
  const[selectedDate , setSelectedDate] = useState(null);
  const[selectedTime , setSelectedTime] = useState(null);
  const [appointment, setAppointment] = useState({
    date: "",
    time: "",
    reason: "",
    symptoms: "",
    notes: "",
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="book-container">
      {step === 1 && (
        <Step1SelectDate
          appointment={appointment}
          setAppointment={setAppointment}
          nextStep={nextStep}
          prevStep={prevStep}

        />
      )}
      {step === 2 && (
        <Step2Details
          appointment={appointment}
          setAppointment={setAppointment}
          nextStep={nextStep}
          prevStep={prevStep}
          
          
        />
      )}
      {step === 3 && (
        <Step3Summary
          appointment={appointment}
          prevStep={prevStep}
          
        />
      )}
    </div>
  );
}




































// import React,{useState} from "react";
// import "./BookAppointment.css";


// export default function BookAppointment(){
  
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedTime, setSelectedTime] = useState(null);
//   const [appointment , setAppointment] = useState(null);
//   const [step, setStep] = useState(1);
   
//   const nextStep = () => {
//     if (step < 3) setStep(step + 1);
//   };

//    const prevStep = () => {
//     if (step > 1) setStep(step - 1);
//   };

//   // ⏱ Create dynamic dates (7 days from today)
//    const generateDates = () => {
//    const today = new Date();
//    const result = [];

//     for (let i = 0; i < 7; i++) {
//       const date = new Date(today);
//       date.setDate(today.getDate() + i);

//       const options = { weekday: "short", month: "short", day: "numeric" };
//       const formatted = date.toLocaleDateString("en-US", options);
//       result.push(formatted);
//     }

//     return result;
//   };

//   const handleNext = () => {
//     if(!selectedDate || !selectedTime){
//       alert('please select both a date and a time. ');
      
//     }
//     alert(`Appointment booked on :${selectedDate} \n at: ${selectedTime}`);
//     setAppointment({date: selectedDate,time:selectedTime});
//     nextStep();
//   }


//   const dates = generateDates();

//   const times = [
//     "09:00 AM",
//     "09:30 AM",
//     "10:00 AM",
//     "10:30 AM",
//     "11:00 AM",
//     "11:30 AM",
//     "02:00 PM",
//     "02:30 PM",
//     "03:00 PM",
//     "03:30 PM",
//     "04:00 PM",
//     "04:30 PM",
//   ];

//   return (
//     <>

//     {step === 1 && (
//     <div className="appointment-container">
      
//         <div className="header">
//           <button className="back-btn">←</button>
//           <h2 className="title">Book Appointment</h2>
//           <div className="dots">
//              <span className="dot active"></span>
//              <span className="dot"></span>
//              <span className="dot"></span>
//           </div>
//         </div>

//         <div className="doctor-card">
//            <div className="doctor-info">
//            <div className="avatar">LK</div>
//            <div className="doc-info">
//              <span className="name"><h3>Dr. Layla Khoury</h3></span>
//             <span className="cardiology"><p>Cardiology</p></span> 
//            </div>
//            </div>
//            <div className="price">$150</div>
//          </div>

//          {/* SELECT DATE */}
//          <div className="section">
//           <h4 > Select Date</h4>
//           <div className="dates-grid">
//             {dates.map((date) => (
//               <button
//                 key={date}
//                className={`date-btn ${selectedDate === date ? "active" : ""}`}

//                 onClick={() => setSelectedDate(date)}
//               >
//                 {date}
//               </button>
//             ))}
//           </div>
//         </div>

        
//         <div className="section">
//           <h4>Available Times</h4>
//           <div className="times-grid">
//             {times.map((time) => (
//               <button
//                 key={time}
//                 className={`time-btn ${selectedTime === time ? "active" : ""}`}

//                 onClick={() => setSelectedTime(time)}
//               >
//                 {time}
//               </button>
//             ))}
//           </div>
//         </div>

//         <button className="next-btn" disabled={!selectedDate || !selectedTime} onClick={nextStep}>
//           Next
//         </button>
//         </div>
//         )}



      
//       {step === 2 && (
//         <div className="page">
//             <div className="header">
//           <button className="back-btn">←</button>
//           <h2 className="title">Book Appointment</h2>
//           <div className="dots">
//              <span className="dot active"></span>
//              <span className="dot"></span>
//              <span className="dot"></span>
//           </div>
//         </div>
//           <div className="doctor-card">
//             <div className="avatar" >LK</div>
//             <div>
//               <h4 className="name">Dr. Layla Khoury</h4>
//               <p className="cardiology">Cardiology</p>
//             </div>
//             <span className="price">$150</span>
//           </div>

//           <div className="section">
//             <h3>Appointment Details</h3>
//             <label >Reason for Visit * </label>
//             <input type="text"  placeholder="e.g. Regular checkup,chest pain,follow up" />

//             <label>Current Symptoms</label>
//             <input type="text" placeholder="Describe any symptoms you're experience"  />

//             <label>Additional Notes</label>
//             <input type="text"  placeholder="Any additional information for the doctor..."/>
//           </div>
 
//           <button className="next-btn" onClick={nextStep}>Next</button>
//         </div>
//   )}

      
//       {step === 3 && (
//         <div className="page"> 
//             <div className="header">
//           <button className="back-btn">←</button>
//           <h2 className="title">Book Appointment</h2>
//           <div className="dots">
//              <span className="dot active"></span>
//              <span className="dot"></span>
//              <span className="dot"></span>
//           </div>
//         </div>
  
//     <div className="doctor-card">
//       <div className="avatar">LK</div>
//       <div className="doc-details">
//         <h4 className="name">Dr. Layla Khoury</h4>
//         <p className="cardiology">Cardiology</p>
//       </div>
//       <span className="price">$150</span>
//     </div>

//     <div className="section">
//       <h3>Appointment Summary</h3>
//       <p className="date-time">
//        <div className="div"> <b>Date & <br/>
//          Time:</b> 
//         {" "}
//         {appointment?.date && appointment?.time
//           ? '${appointment.date} at ${appointment.time}'
//           : "Not selected"}  </div>
//       </p>
//       <p className="div"><b>Doctor:</b> Dr. Layla Khoury</p>
//       <p className="div"><b>Reason:</b> {appointment?.reason || "Not provided"}</p>
//       <p className="div"><b>Consultation Fee:</b> $150</p>
// </div>
//       <div className="payment-box">
//         <p><b>Payment on Visit</b></p>
//         <small>You can pay when you visit the doctor.</small>
//       </div>
    

//     <button
//   className="next-btn"
//   onClick={() => {
//     alert(
//       '✅ Appointment Confirmed!\n\nDate: ${appointment.date}\nTime: ${appointment.time}\nDoctor: Dr. Layla Khoury'
//     );
//   }}
// >
//   Confirm Booking
// </button>
//   </div>
// )}
//   </>
//   );

// }





