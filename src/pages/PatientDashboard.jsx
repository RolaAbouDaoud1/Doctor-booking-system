import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import PatientOverviewStats from "../components/PatientOverviewStats";
import PatientQuickActions from "../components/PatientQuickActions";
import NavBarLg from "../components/sections/NavBarLg";
import "./PatientDashboard.css";
import "./SharedDashboard.css";
import "./WellnessModal.css";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import {
  getAppointmentsForPatient,
  removeLocalAppointment,
  updateLocalAppointment,
  getStatusMeta,
} from "../utils/offlineAppointments";

const PatientDashboard = ({ showDropList, setShowDropList }) => {
  const [modalData, setModalData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patientProfile, setPatientProfile] = useState(null);
  const [medicalDocuments, setMedicalDocuments] = useState([]);
  const [greeting, setGreeting] = useState("");
  const [message, setMessage] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showAppointments, setShowAppointments] = useState(false); // Toggle state
  const navigate = useNavigate();

  const token = Cookies.get("token");
  const decodedToken = useMemo(() => {
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (err) {
      console.warn("Failed to decode auth token", err);
      return null;
    }
  }, [token]);

  const patientId = useMemo(() => {
    if (decodedToken?.id != null) return String(decodedToken.id);
    const stored = localStorage.getItem("patientId");
    return stored ? String(stored) : null;
  }, [decodedToken]);

  const refreshAppointments = useCallback(() => {
    const activePatientId = patientId || localStorage.getItem("patientId") || "1";
    setAppointments(getAppointmentsForPatient(activePatientId));
  }, [patientId]);

  // Load initial data
  useEffect(() => {
    const loadDashboardData = () => {
      refreshAppointments();

      const profile = {
        fullName: localStorage.getItem("username") || "Patient",
        email: localStorage.getItem("userEmail") || "",
      };
      setPatientProfile(profile);
      setMedicalDocuments([]);
    };

    loadDashboardData();

    // Set greeting and motivational message
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    const messages = [
      "Take a deep breath and relax.",
      "Remember to drink water today!",
      "Stay positive and keep smiling.",
      "Focus on your health and wellbeing.",
      "Time for a short walk!",
      "You're doing great with your health journey!",
      "Rest is part of the healing process.",
    ];
    setMessage(messages[new Date().getDate() % messages.length]);
  }, [patientId, refreshAppointments]);

  // Dropdown management
  const toggleDropdown = (key, event) => {
    if (event) event.stopPropagation();

    // If clicking on upcoming appointments, toggle the appointments section
    if (key === "upcomingAppointments") {
      setShowAppointments((prev) => !prev); // Toggle true/false
      return;
    }

    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openDropdown &&
        !event.target.closest(".stat-box") &&
        !event.target.closest(".dropdown-menu")
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openDropdown]);

  const visibleAppointments = useMemo(
    () => appointments.filter((apt) => apt.statusMeta?.includeInUpcoming !== false),
    [appointments]
  );

  // Stats calculation
  const stats = useMemo(() => {
    const medicalReports = medicalDocuments.filter(
      (doc) => doc.type === "medical_report"
    ).length;
    const prescriptions = medicalDocuments.filter(
      (doc) => doc.type === "prescription"
    ).length;
    const pendingLabResults = medicalDocuments.filter(
      (doc) => doc.type === "lab_result" && doc.status === "pending"
    ).length;

    return {
      upcomingAppointments: visibleAppointments.length,
      medicalRecords: medicalReports,
      activePrescriptions: prescriptions,
      pendingResults: pendingLabResults,
    };
  }, [visibleAppointments, medicalDocuments]);

  // Appointment handlers
  const handleCancel = async (appointment) => {
    if (!appointment) return;
    const targetId = appointment.localId || appointment.appointmentId;
    if (!targetId) {
      setModalData(null);
      return;
    }

    const statusMeta = getStatusMeta(appointment.status);
    if (statusMeta.allowCancel) {
      updateLocalAppointment(targetId, { status: "CANCELLED" });
    } else {
      removeLocalAppointment(targetId);
    }

    refreshAppointments();
    setModalData(null);
  };

  const handleReschedule = (appointment) => {
    setModalData(null);
    if (!appointment) return;

    const targetId = appointment.localId || appointment.appointmentId;
    if (targetId) {
      updateLocalAppointment(targetId, { status: "CANCELLED" });
      refreshAppointments();
    }

    const destinationDoctorId = appointment.doctorId || appointment.id;
    if (destinationDoctorId) {
      navigate(`/book/${destinationDoctorId}`);
    } else {
      navigate("/search");
    }
  };

  const handleBookAppointment = () => {
    // Navigate to the book appointment page with a default doctor ID
    // You can modify this to navigate to a doctor selection page first if needed
    navigate("/book/1"); // Using "1" as a default doctor ID
  };

  const handleFindDoctors = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          navigate("/search", {
            state: {
              userLocation: { latitude, longitude },
              message: "Found your location! Showing nearby doctors.",
            },
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          navigate("/search", {
            state: {
              message: "Search for doctors by name, specialty, or city.",
            },
          });
        }
      );
    } else {
      navigate("/search", {
        state: {
          message: "Search for doctors by name, specialty, or city.",
        },
      });
    }
  };

  const openModal = (type, appointment) => setModalData({ type, appointment });
  const closeModal = () => setModalData(null);

  const getDoctorInitials = (doctorName = "") => {
    const parts = doctorName
      .split(" ")
      .filter(Boolean);
    if (parts.length === 0) return "DR";
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || "D";
    const first = parts[0][0] || "";
    const last = parts[parts.length - 1][0] || "";
    return `${first}${last}`.toUpperCase();
  };

  // Get today's date in a nice format
  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  // ✅ Get patient name from multiple sources with priority
  const displayName = useMemo(() => {
    // Priority 1: Check JWT token for fullName or name
    if (decodedToken?.fullName) return decodedToken.fullName;
    if (decodedToken?.name) return decodedToken.name;
    
    // Priority 2: Check localStorage for fullName
    const storedFullName = localStorage.getItem("fullName");
    if (storedFullName && storedFullName !== "User") return storedFullName;
    
    // Priority 3: Check patientTotal in localStorage (from registration)
    try {
      const patientTotal = localStorage.getItem("patientTotal");
      if (patientTotal) {
        const parsed = JSON.parse(patientTotal);
        if (parsed.fullName) return parsed.fullName;
        if (parsed.username && parsed.username !== "User") return parsed.username;
      }
    } catch (e) {
      console.warn("Could not parse patientTotal:", e);
    }
    
    // Priority 4: Check username in localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername && storedUsername !== "User" && storedUsername !== "Patient") {
      return storedUsername;
    }
    
    // Priority 5: Check patientProfile state (set in useEffect)
    if (patientProfile?.fullName && patientProfile.fullName !== "Patient") {
      return patientProfile.fullName;
    }
    
    // Fallback: return "Patient" only if nothing else is available
    return "Patient";
  }, [decodedToken, patientProfile]);

  return (
    <>
      <NavBarLg setShowDropList={setShowDropList} showDropList={showDropList} />
      <div className="dashboard bg-color">
        <div className="header">
          <div>
            <h1 className="greeting">
              {greeting},{" "}
              <span className="patient-highlight">
                {displayName}!
              </span>
            </h1>
            <p className="date-display">📅{todayDate} </p>
            <p className="subtext">{message}</p>
          </div>
        </div>

        <div className="card quick-actions">
          <PatientQuickActions
            onNavigate={navigate}
            onBookAppointment={handleBookAppointment}
            onFindDoctors={handleFindDoctors}
          />
        </div>

        <div className="card appointments">
          <PatientOverviewStats
            stats={stats}
            onNavigate={navigate}
            openDropdown={openDropdown}
            onDropdownToggle={toggleDropdown}
            appointments={visibleAppointments}
            medicalDocuments={medicalDocuments}
            showAppointments={showAppointments} // Pass the state to show active indicator
          />

          {/* Toggle appointments section visibility */}
          {showAppointments && (
            <>
              <div className="appointments-header">
                <h2>Upcoming Appointments</h2>
                <button
                  className="book-new bg-teal"
                  onClick={handleBookAppointment}
                >
                  ➕ Book Now
                </button>
              </div>

              {visibleAppointments.length === 0 ? (
                <div className="no-appointments">
                  <p>
                    No upcoming appointments. Book your first appointment today!
                  </p>
                </div>
              ) : (
                visibleAppointments.map((apt) => {
                  const key = apt.appointmentId || apt.localId || apt.id;
                  const isOffline = Boolean(apt.isOffline);
                  const doctorName = apt.doctorName || "Pending Doctor";
                  const doctorId = apt.doctorId || apt.id;
                  const displayDate = apt.date
                    ? new Date(apt.date).toLocaleDateString()
                    : apt.slot?.start
                    ? new Date(apt.slot.start).toLocaleDateString()
                    : null;
                  const displayTime = apt.timeLabel || apt.time || (apt.slot?.start
                    ? new Date(apt.slot.start).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
                    : "--");
                  const statusMeta = apt.statusMeta || getStatusMeta(apt.status);
                  const badgeClass = statusMeta.badgeClass || (isOffline ? "pending" : "confirmed");
                  const statusLabel = statusMeta.label || (isOffline ? "Pending" : "Scheduled");
                  const canReschedule = Boolean(statusMeta.allowReschedule);
                  const canCancel = Boolean(statusMeta.allowCancel);

                  return (
                    <div
                      className={`appointment ${isOffline ? "appointment-offline" : ""}`}
                      key={key}
                    >
                      <div className="appt-info">
                        <div className="appt-avatar teal">
                          {getDoctorInitials(doctorName)}
                        </div>
                        <div>
                          <p
                            className={`doctor-name link ${!doctorId ? "disabled" : ""}`}
                            onClick={() => {
                              if (doctorId) {
                                navigate(`/doctor-profile/${doctorId}`);
                              }
                            }}
                          >
                            {doctorName}
                          </p>
                          <div className="doctor-spec">
                            {apt.specialty || "General"}
                            <span className={`status-badge ${badgeClass}`}>
                              {statusLabel}
                            </span>
                          </div>
                          <p className="doctor-time">{displayTime}</p>
                          {displayDate && (
                            <p className="appointment-date">{displayDate}</p>
                          )}
                          {apt.offlineError && statusMeta.badgeClass === "pending" && (
                            <p className="offline-error">
                              Last error: {apt.offlineError}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="appt-actions">
                        <button
                          className="appt-btn coral"
                          onClick={() => canReschedule && openModal("reschedule", apt)}
                          disabled={!canReschedule}
                          title={
                            canReschedule
                              ? "Reschedule"
                              : "This appointment can no longer be rescheduled"
                          }
                        >
                          Reschedule
                        </button>
                        <button
                          className="appt-btn gray"
                          onClick={() => canCancel && openModal("cancel", apt)}
                          disabled={!canCancel}
                        >
                          {canCancel ? "Cancel" : "Remove"}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>

        {modalData && (
          <Modal
            title={
              modalData.type === "cancel"
                ? "Cancel Appointment"
                : "Reschedule Appointment"
            }
            message={`Are you sure you want to ${modalData.type} your appointment with ${modalData.appointment.doctorName}?`}
            confirmText={
              modalData.type === "cancel" ? "Yes, Cancel" : "Yes, Reschedule"
            }
            onConfirm={() =>
              modalData.type === "cancel"
                ? handleCancel(modalData.appointment)
                : handleReschedule(modalData.appointment)
            }
            onCancel={closeModal}
          />
        )}
      </div>
    </>
  );
};

export default PatientDashboard;