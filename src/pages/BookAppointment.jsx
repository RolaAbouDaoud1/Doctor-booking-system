import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import Step1SelectDate from "../components/Step1SelectDate";
import Step2Details from "../components/Step2Details";
import Step3Summary from "../components/Step3Summary";
import "./BookAppointment.css";

export default function BookAppointment() {
  const [step, setStep] = useState(1);
  const [appointment, setAppointment] = useState({
    date: "",
    time: "",
    reason: "",
    symptoms: "",
    notes: "",
  });
  const { doctorId: doctorIdParam } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [doctorLoading, setDoctorLoading] = useState(true);
  const [doctorError, setDoctorError] = useState(null);

  const resolvedDoctorId = useMemo(() => {
    return doctorIdParam || localStorage.getItem("doctorId") || doctor?.id || doctor?.doctorId || null;
  }, [doctorIdParam, doctor?.doctorId, doctor?.id]);

  useEffect(() => {
    let mounted = true;

    if (!resolvedDoctorId) {
      setDoctorLoading(false);
      setDoctorError("No doctor selected");
      return undefined;
    }

    localStorage.setItem("doctorId", resolvedDoctorId);
    const controller = new AbortController();

    (async () => {
      try {
        setDoctorLoading(true);
        setDoctorError(null);
        const token = Cookies.get("token");
        const response = await fetch(
          `http://localhost:8080/api/users/doctor/${resolvedDoctorId}/profile`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            credentials: "include",
            signal: controller.signal,
          }
        );

        const payloadText = await response.text();
        const payload = payloadText ? JSON.parse(payloadText) : {};

        if (!response.ok) {
          throw new Error(payload?.message || "Failed to load doctor profile");
        }

        const parent = payload && typeof payload === "object" ? payload : {};
        const nested = parent.doctor || parent.data || parent.result || parent || {};

        const normalizedDoctor = {
          id: nested.id || nested.doctorId || parent.id || parent.doctorId || resolvedDoctorId,
          doctorId: nested.doctorId || nested.id || parent.doctorId || parent.id || resolvedDoctorId,
          fullName:
            nested.fullName ||
            nested.name ||
            nested.username ||
            parent.fullName ||
            parent.name ||
            parent.username ||
            "Doctor",
          specialties: Array.isArray(nested.specialties)
            ? nested.specialties
            : nested.specialty
            ? [nested.specialty]
            : Array.isArray(parent.specialties)
            ? parent.specialties
            : [],
          price:
            nested.consultationFee ||
            nested.price ||
            parent.consultationFee ||
            parent.price ||
            "$150",
          avatar:
            nested.avatarUrl ||
            nested.avatar ||
            parent.avatarUrl ||
            null,
          languages: Array.isArray(nested.languages)
            ? nested.languages
            : Array.isArray(parent.languages)
            ? parent.languages
            : [],
          yearsOfExperience:
            nested.yearsOfExperience ?? nested.experience ?? parent.yearsOfExperience ?? parent.experience ?? null,
          raw: payload,
        };

        if (mounted) {
          setDoctor(normalizedDoctor);
          setDoctorLoading(false);
        }
      } catch (error) {
        if (error.name === "AbortError") return;
        console.error("Failed to fetch doctor profile", error);
        if (mounted) {
          setDoctorError(error.message || "Could not load doctor");
          setDoctorLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [resolvedDoctorId]);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="book-container">
      {step === 1 && (
        <Step1SelectDate
          appointment={appointment}
          setAppointment={setAppointment}
          nextStep={nextStep}
          doctor={doctor}
          doctorId={resolvedDoctorId}
          doctorLoading={doctorLoading}
          doctorError={doctorError}
        />
      )}
      {step === 2 && (
        <Step2Details
          appointment={appointment}
          setAppointment={setAppointment}
          nextStep={nextStep}
          prevStep={prevStep}
          doctor={doctor}
          doctorLoading={doctorLoading}
          doctorError={doctorError}
        />
      )}
      {step === 3 && (
        <Step3Summary
          appointment={appointment}
          prevStep={prevStep}
          doctor={doctor}
          doctorId={resolvedDoctorId}
        />
      )}
    </div>
  );
}