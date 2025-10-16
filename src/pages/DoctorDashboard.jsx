import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DoctorAppointmentsManager from "../components/DoctorAppointmentsManager";
import DoctorOverviewStats from "../components/DoctorOverviewStats";
import DoctorQuickActions from "../components/DoctorQuickActions";
import Modal from "../components/Modal";
import RescheduleModal from "../Components/ReschedualModal";
import NavBarLg from "../components/sections/NavBarLg";
import "./DoctorDashboard.css";
import "./SharedDashboard.css";
import "./WellnessModal.css";

const API_BASE = "http://localhost:8080/api";

const DoctorDashboard = ({ showDropList, setShowDropList }) => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [modal, setModal] = useState({
    visible: false,
    action: "",
    appointmentId: null,
    text: "",
  });
  const [rescheduleModal, setRescheduleModal] = useState({
    visible: false,
    appointmentId: null,
    appointmentName: "",
    newDate: "",
    newTime: "",
  });
  const [showAppointments, setShowAppointments] = useState(false);
//hi
  // Get auth headers with token
  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  }, []);

  // REAL API CALLS FROM YOUR PDF DOCUMENTATION

  // GET /api/appointments/doctor/{doctorId}
  const fetchDoctorAppointments = useCallback(
    async (doctorId) => {
      try {
        const response = await fetch(
          `${API_BASE}/appointments/doctor/${doctorId}`,
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
    },
    [getAuthHeaders]
  );

  // GET /api/users/doctors/{id} - Doctor profile
  const fetchDoctorProfile = useCallback(
    async (doctorId) => {
      try {
        const response = await fetch(`${API_BASE}/users/doctors/${doctorId}`, {
          headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch doctor profile");
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching doctor profile:", error);
        return null;
      }
    },
    [getAuthHeaders]
  );

  // PUT /api/appointments/{patientId}/{appointmentId}/confirm
  const confirmAppointment = useCallback(
    async (patientId, appointmentId) => {
      try {
        const response = await fetch(
          `${API_BASE}/appointments/${patientId}/${appointmentId}/confirm`,
          {
            method: "PUT",
            headers: getAuthHeaders(),
          }
        );
        return response.ok;
      } catch (error) {
        console.error("Error confirming appointment:", error);
        return false;
      }
    },
    [getAuthHeaders]
  );

  // PUT /api/appointments/{patientId}/{appointmentId}/decline
  const declineAppointment = useCallback(
    async (patientId, appointmentId) => {
      try {
        const response = await fetch(
          `${API_BASE}/appointments/${patientId}/${appointmentId}/decline`,
          {
            method: "PUT",
            headers: getAuthHeaders(),
          }
        );
        return response.ok;
      } catch (error) {
        console.error("Error declining appointment:", error);
        return false;
      }
    },
    [getAuthHeaders]
  );

  // DELETE /api/appointments/{patientId}/{appointmentId}/cancel
  const cancelAppointment = useCallback(
    async (patientId, appointmentId) => {
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
    },
    [getAuthHeaders]
  );

  // POST /api/appointments - Book new appointment (for reschedule simulation)
  const rescheduleAppointment = useCallback(
    async (appointmentData) => {
      try {
        const response = await fetch(`${API_BASE}/appointments`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(appointmentData),
        });
        return response.ok;
      } catch (error) {
        console.error("Error rescheduling appointment:", error);
        return false;
      }
    },
    [getAuthHeaders]
  );

  // Sample data fallback (remove when APIs are ready)
  const fallbackPatients = useMemo(
    () => [
      { id: 1, name: "Ahmad Mansour", patientId: "P001" },
      { id: 2, name: "Rania Sabbagh", patientId: "P002" },
      { id: 3, name: "Maya Haddad", patientId: "P003" },
    ],
    []
  );

  const fallbackWeeklyAppointments = useMemo(
    () => [
      {
        id: 1,
        patientName: "Ahmad Mansour",
        patientId: 1,
        type: "Consultation",
        time: "09:00 AM",
        status: "confirmed",
        day: "Today",
      },
      {
        id: 2,
        patientName: "Rania Sabbagh",
        patientId: 2,
        type: "Follow-up",
        time: "10:30 AM",
        status: "pending",
        day: "Today",
      },
    ],
    []
  );

  const fallbackFeedback = useMemo(
    () => [
      {
        id: 1,
        patientName: "Ahmad Mansour",
        patientId: 1,
        rating: 5,
        comment: "Excellent care...",
      },
    ],
    []
  );

  // Stats calculation
  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    // NOTE: In a real app, `apt.date` must be consistent (e.g., YYYY-MM-DD) for this filter to work correctly.
    const todayAppointmentsList = appointments.filter(
      (apt) => apt.date === today
    );

    return {
      todayAppointments: todayAppointmentsList.length,
      weeklyAppointments: appointments.length,
      totalPatients: doctorProfile?.totalPatients || fallbackPatients.length,
      averageRating: doctorProfile?.avgRating || 4.7,
      todayAppointmentsList: todayAppointmentsList,
      weeklyAppointmentsList: fallbackWeeklyAppointments,
      patientsList: fallbackPatients,
      feedback: fallbackFeedback,
    };
  }, [
    appointments,
    doctorProfile,
    fallbackPatients,
    fallbackWeeklyAppointments,
    fallbackFeedback,
  ]);

  // Event handlers
  const handlePatientNavigation = useCallback(
    (patientId, e) => {
      if (e) e.stopPropagation();
      navigate(`/patients/${patientId}`);
    },
    [navigate]
  );

  const toggleDropdown = useCallback((key, e) => {
    if (e) e.stopPropagation();

    if (key === "todayAppointments") {
      setShowAppointments((prev) => !prev);
      setOpenDropdown(null);
    } else {
      setOpenDropdown((prev) => (prev === key ? null : key));
      setShowAppointments(false);
    }
  }, []);

  const prepareAction = useCallback(
    (apptId, action) => {
      const appt = appointments.find((a) => a.id === apptId);
      if (!appt) return;

      if (action === "Reschedule") {
        setRescheduleModal({
          visible: true,
          appointmentId: apptId,
          appointmentName: appt.patientName,
          newDate: "",
          newTime: "",
        });
        return;
      }

      const text = `Are you sure you want to ${action.toLowerCase()} appointment for ${
        appt.patientName
      }?`;
      setModal({ visible: true, action, appointmentId: apptId, text });
    },
    [appointments]
  );

  const confirmModal = useCallback(async () => {
    const appointment = appointments.find((a) => a.id === modal.appointmentId);
    if (!appointment) return;

    let success = false;

    switch (modal.action) {
      case "Accept":
        success = await confirmAppointment(
          appointment.patientId,
          modal.appointmentId
        );
        break;
      case "Decline":
        success = await declineAppointment(
          appointment.patientId,
          modal.appointmentId
        );
        break;
      case "Cancel":
        success = await cancelAppointment(
          appointment.patientId,
          modal.appointmentId
        );
        break;
      default:
        break;
    }

    if (success) {
      setAppointments((prev) => {
        if (modal.action === "Accept") {
          return prev.map((a) =>
            a.id === modal.appointmentId ? { ...a, status: "confirmed" } : a
          );
        }
        // Decline/Cancel removes the appointment from the list
        return prev.filter((a) => a.id !== modal.appointmentId);
      });
    }
    setModal({ visible: false, action: "", appointmentId: null, text: "" });
  }, [
    modal,
    appointments,
    confirmAppointment,
    declineAppointment,
    cancelAppointment,
  ]);

  const confirmReschedule = useCallback(async () => {
    const appointment = appointments.find(
      (a) => a.id === rescheduleModal.appointmentId
    );
    if (!appointment) return;

    // Create new appointment data for reschedule
    // NOTE: This logic assumes rescheduling creates a *new* entry in the backend.
    // A more common approach might be an UPDATE on the existing one.
    const rescheduleData = {
      patientId: appointment.patientId,
      doctorId: 1, // Current doctor ID
      date: rescheduleModal.newDate,
      time: rescheduleModal.newTime,
      type: appointment.type,
      status: "rescheduled",
    };

    const success = await rescheduleAppointment(rescheduleData);

    if (success) {
      // Update the original appointment to reflect the new status/details
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === rescheduleModal.appointmentId
            ? {
                ...a,
                status: "rescheduled",
                time: rescheduleModal.newTime, // Update time/date
                date: rescheduleModal.newDate,
              }
            : a
        )
      );
    }
    setRescheduleModal({
      visible: false,
      appointmentId: null,
      appointmentName: "",
      newDate: "",
      newTime: "",
    });
  }, [rescheduleModal, appointments, rescheduleAppointment]);

  // Load initial data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const doctorId = 1; // This should come from authentication context

        // Fetch doctor appointments
        const appointmentsData = await fetchDoctorAppointments(doctorId);
        setAppointments(appointmentsData);

        // Fetch doctor profile for ratings and stats
        const profileData = await fetchDoctorProfile(doctorId);
        setDoctorProfile(profileData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);

        // Fallback data if API fails
        setAppointments([
          {
            id: 1,
            patientName: "Ahmad Mansour",
            patientId: 1,
            type: "Consultation",
            time: "09:00 AM",
            status: "confirmed",
            date: new Date().toISOString().split("T")[0],
          },
          {
            id: 2,
            patientName: "Rania Sabbagh",
            patientId: 2,
            type: "Follow-up",
            time: "10:30 AM",
            status: "pending",
            date: new Date().toISOString().split("T")[0],
          },
        ]);
      }
    };

    loadDashboardData();
  }, [fetchDoctorAppointments, fetchDoctorProfile]);

  // Greeting and time
  const now = useMemo(() => new Date(), []);
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const motivationalByDay = useMemo(() => {
    const messages = [
      "Small steps every day lead to big wins. ✨",
      "Take one patient at a time, you're doing great. 💪",
      "Recharge, then continue making a difference. 🔋",
      "Your care makes a difference every day. 🌟",
      "Stay focused and compassionate. 💚",
      "Weekend warrior - you've got this! 🏆",
      "New week, new opportunities to heal. 🌈",
    ];
    return messages[now.getDay()];
  }, [now]);

  return (
    <>
      <NavBarLg setShowDropList={setShowDropList} showDropList={showDropList} />
      <div className="dashboard">
        <div className="dashboard-header">
          <div>
            <p className="greeting">
              {greeting},{" "}
              <span className="doctor-highlight">Dr. Layla Khoury!</span>
            </p>
            <p className="motivational">{motivationalByDay}</p>
            <p className="subtle">
              Cardiology -- Date: {now.toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="section-container">
          <DoctorQuickActions
            onShowAppointments={() => setShowAppointments(!showAppointments)}
            showAppointments={showAppointments}
            onNavigate={navigate}
          />
        </div>

        <div className="section-container">
          <DoctorOverviewStats
            stats={stats}
            openDropdown={openDropdown}
            onDropdownToggle={toggleDropdown}
            onPatientNavigation={handlePatientNavigation}
          />
        </div>

        {/* Conditional Rendering for Appointments Manager (Full Toggle) */}
        {showAppointments && (
          <div className="section-container">
            <DoctorAppointmentsManager
              appointments={stats.todayAppointmentsList}
              onAppointmentAction={prepareAction}
              onPatientNavigation={handlePatientNavigation} // Use the consolidated handler
              onHideAppointments={() => setShowAppointments(false)}
            />
          </div>
        )}

        {/* Modal for Accept/Decline/Cancel */}
        {modal.visible && (
          <Modal
            title={`Confirm ${modal.action}`}
            message={modal.text}
            onConfirm={confirmModal}
            onCancel={() =>
              setModal({
                visible: false,
                action: "",
                appointmentId: null,
                text: "",
              })
            }
          />
        )}

        {/* Reschedule Modal */}
        <RescheduleModal
          visible={rescheduleModal.visible}
          appointmentName={rescheduleModal.appointmentName}
          newDate={rescheduleModal.newDate}
          newTime={rescheduleModal.newTime}
          onConfirm={confirmReschedule}
          onCancel={() =>
            setRescheduleModal({
              visible: false,
              appointmentId: null,
              appointmentName: "",
              newDate: "",
              newTime: "",
            })
          }
          onDateChange={(e) =>
            setRescheduleModal((prev) => ({ ...prev, newDate: e.target.value }))
          }
          onTimeChange={(e) =>
            setRescheduleModal((prev) => ({ ...prev, newTime: e.target.value }))
          }
        />
      </div>
    </>
  );
};

export default DoctorDashboard;
