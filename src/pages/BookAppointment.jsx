import React, { useState } from "react";
import Step1SelectDate from "../components/Step1SelectDate";
import Step2Details from "../components/Step2Details";
import Step3Summary from "../components/Step3Summary";
import "./BookAppointment.css";

export default function BookAppointment() {
  const [step , setStep] = useState(1);
  const[selectedDate , setSelectedDate] = useState(null);
  const[selectedTime , setSelectedTime] = useState(null);
  const role= localStorage.getItem("userRole");
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

