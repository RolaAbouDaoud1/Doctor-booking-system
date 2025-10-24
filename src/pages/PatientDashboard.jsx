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

const API_BASE = "http://localhost:8080/api";

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

  // Get auth headers with token
  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  };

  // REAL API CALLS FROM YOUR PDF DOCUMENTATION

  // GET /api/appointments/patient/{patientId}
  const fetchPatientAppointments = useCallback(async (patientId) => {
    try {
      const response = await fetch(
        `${API_BASE}/appointments/patient/${patientId}`,
        {
          headers: getAuthHeaders(),
        }
      );
      if (!response.ok) throw new Error("Failed to fetch appointments");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return [];
    }
  }, []);

  // DELETE /api/appointments/{patientId}/{appointmentId}/cancel
  const cancelAppointment = useCallback(async (patientId, appointmentId) => {
    try {
      const response = await fetch(
        `${API_BASE}/appointments/${patientId}/${appointmentId}/cancel`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );
      return response.ok;
    } catch (error) {
      console.error("Error canceling appointment:", error);
      return false;
    }
  }, []);

  // GET /api/users/patients/{id} - Patient profile
  const fetchPatientProfile = useCallback(async (patientId) => {
    try {
      const response = await fetch(`${API_BASE}/users/patients/${patientId}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch patient profile");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching patient profile:", error);
      return null;
    }
  }, []);

  // POST /api/appointments - Book new appointment
  const bookAppointment = useCallback(async (appointmentData) => {
    try {
      const response = await fetch(`${API_BASE}/appointments`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(appointmentData),
      });
      return response.ok;
    } catch (error) {
      console.error("Error booking appointment:", error);
      return false;
    }
  }, []);

  // PUT /api/appointments/{appointmentId}/reschedule - Reschedule appointment
  const rescheduleAppointment = useCallback(
    async (appointmentId, newDate, newTime) => {
      try {
        const response = await fetch(
          `${API_BASE}/appointments/${appointmentId}/reschedule`,
          {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify({ newDate, newTime }),
          }
        );
        return response.ok;
      } catch (error) {
        console.error("Error rescheduling appointment:", error);
        return false;
      }
    },
    []
  );

  // Load initial data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const patientId = 1; // This should come from authentication context

        // Fetch appointments and profile from real APIs
        const [appointmentsData, profileData] = await Promise.all([
          fetchPatientAppointments(patientId),
          fetchPatientProfile(patientId),
        ]);

        setAppointments(appointmentsData || []);
        setPatientProfile(profileData);
        setMedicalDocuments([]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setAppointments([]);
        setMedicalDocuments([]);
      }
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
  }, [fetchPatientAppointments, fetchPatientProfile]);

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
      upcomingAppointments: appointments.length,
      medicalRecords: medicalReports,
      activePrescriptions: prescriptions,
      pendingResults: pendingLabResults,
    };
  }, [appointments, medicalDocuments]);

  // Appointment handlers
  const handleCancel = async (appointment) => {
    const patientId = 1;
    const success = await cancelAppointment(
      patientId,
      appointment.appointmentId
    );

    if (success) {
      setAppointments((prev) =>
        prev.filter((a) => a.appointmentId !== appointment.appointmentId)
      );
    }
    setModalData(null);
  };

  const handleReschedule = async (appointment) => {
    setModalData(null);

    const newDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    const newTime = "10:00 AM";

    const success = await rescheduleAppointment(
      appointment.appointmentId,
      newDate,
      newTime
    );

    if (success) {
      setAppointments((prev) =>
        prev.map((a) =>
          a.appointmentId === appointment.appointmentId
            ? { ...a, date: newDate, time: newTime }
            : a
        )
      );

      navigate("/search", {
        state: {
          message: "Appointment rescheduled successfully!",
          rescheduledAppointment: {
            ...appointment,
            date: newDate,
            time: newTime,
          },
        },
      });
    } else {
      navigate("/search", {
        state: {
          error: "Failed to reschedule appointment. Please try again.",
        },
      });
    }
  };

  const handleBookAppointment = async () => {
    const newAppointmentData = {
      patientId: 1,
      doctorId: 1,
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      time: "02:00 PM",
      type: "Consultation",
      status: "pending",
    };

    const success = await bookAppointment(newAppointmentData);

    if (success) {
      navigate("/book/:doctorId", {
        state: {
          message: "Ready to book a new appointment!",
          prefillData: newAppointmentData,
        },
      });
    } else {
      navigate("/book/:doctorId", {
        state: {
          error: "Unable to prepare appointment booking. Please try again.",
        },
      });
    }
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

  const getDoctorInitials = (doctorName) => {
    return doctorName
      .split(" ")
      .slice(1)
      .map((n) => n[0])
      .join("");
  };

  // Get today's date in a nice format
  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
const token = Cookies.get("token");
const decoded = jwtDecode(token);
const namefromToken = decoded.name;

return (
    <>
      <NavBarLg setShowDropList={setShowDropList} showDropList={showDropList} />
      <div className="dashboard bg-color">
        <div className="header">
          <div>
            <h1 className="greeting">
              {greeting},{" "}
              <span className="patient-highlight">
                {decoded.name|| "test"}!
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
            appointments={appointments}
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

              {appointments.length === 0 ? (
                <div className="no-appointments">
                  <p>
                    No upcoming appointments. Book your first appointment today!
                  </p>
                </div>
              ) : (
                appointments.map((apt) => (
                  <div className="appointment" key={apt.appointmentId}>
                    <div className="appt-info">
                      <div className="appt-avatar teal">
                        {getDoctorInitials(apt.doctorName)}
                      </div>
                      <div>
                        <p
                          className="doctor-name link"
                          onClick={() =>
                            navigate(
                              `/doctor-profile/${apt.doctorId || apt.id}`
                            )
                          }
                        >
                          {apt.doctorName}
                        </p>
                        <p className="doctor-spec">{apt.specialty}</p>
                        <p className="doctor-time">{apt.time}</p>
                        {apt.date && (
                          <p className="appointment-date">
                            {new Date(apt.date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="appt-actions">
                      <button
                        className="appt-btn coral"
                        onClick={() => openModal("reschedule", apt)}
                      >
                        Reschedule
                      </button>
                      <button
                        className="appt-btn gray"
                        onClick={() => openModal("cancel", apt)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))
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
