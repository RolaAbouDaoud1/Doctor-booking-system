import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DoctorAppointmentsManager from "../components/DoctorAppointmentsManager";
import DoctorOverviewStats from "../components/DoctorOverviewStats";
import DoctorQuickActions from "../components/DoctorQuickActions";
import Modal from "../components/Modal";
import RescheduleModal from "../components/ReschedualModal";
import NavBarLg from "../components/sections/NavBarLg";
import {
  updateLocalAppointment,
  getStatusMeta,
  readLocalAppointments,
  normalizeLocalAppointment,
} from "../utils/offlineAppointments";
import "./DoctorDashboard.css";
import "./SharedDashboard.css";
import "./WellnessModal.css";

const INITIAL_MODAL_STATE = {
  visible: false,
  action: "",
  appointmentId: null,
  text: "",
};

const INITIAL_RESCHEDULE_STATE = {
  visible: false,
  appointmentId: null,
  appointmentName: "",
  newDate: "",
  newTime: "",
};

const toIsoString = (date, time) => {
  if (!date || !time) return null;
  const trimmed = String(time).trim();

  const ampmMatch = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  let hours;
  let minutes;

  if (ampmMatch) {
    hours = parseInt(ampmMatch[1], 10);
    minutes = parseInt(ampmMatch[2], 10);
    const period = ampmMatch[3].toUpperCase();
    if (period === "PM" && hours < 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
  } else {
    const hhmmMatch = trimmed.match(/^(\d{1,2}):(\d{2})$/);
    if (hhmmMatch) {
      hours = parseInt(hhmmMatch[1], 10);
      minutes = parseInt(hhmmMatch[2], 10);
    }
  }

  if (hours === undefined || minutes === undefined) {
    const fallback = new Date(`${date} ${time}`);
    return Number.isNaN(fallback.getTime()) ? null : fallback.toISOString();
  }

  const constructed = new Date(`${date}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`);
  return Number.isNaN(constructed.getTime()) ? null : constructed.toISOString();
};

const DoctorDashboard = ({ showDropList, setShowDropList }) => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [modal, setModal] = useState(INITIAL_MODAL_STATE);
  const [rescheduleModal, setRescheduleModal] = useState(INITIAL_RESCHEDULE_STATE);
  const [showAppointments, setShowAppointments] = useState(false);

  const doctorId = useMemo(() => {
    const stored = localStorage.getItem("doctorId");
    return stored ? String(stored) : "1";
  }, []);

  // ✅ Get doctor name from multiple sources with priority
  const doctorName = useMemo(() => {
    // Priority 1: Check localStorage for fullName
    const storedFullName = localStorage.getItem("fullName");
    if (storedFullName && storedFullName !== "User" && storedFullName !== "Doctor") {
      return storedFullName;
    }
    
    // Priority 2: Check username in localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername && storedUsername !== "User" && storedUsername !== "Doctor") {
      return storedUsername;
    }
    
    // Fallback
    return "Doctor";
  }, []);

  const specialties = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("specialties") || "[]");
    } catch (err) {
      console.warn("Failed to parse specialties", err);
        return [];
      }
  }, []);

  const refreshAppointments = useCallback(() => {
    // ✅ For MVP testing: Show ALL appointments to any doctor account
    // This allows testing with 2 accounts on one device - any patient's appointments will show
    const allAppointments = readLocalAppointments();
    
    // Normalize and sort all appointments
    const normalized = allAppointments
      .map(normalizeLocalAppointment)
      .filter(Boolean);
    
    // Sort by date/time
    const sorted = normalized.sort((a, b) => {
      const getTime = (apt) => {
        const date = apt.slot?.start || apt.start;
        if (date) {
          const value = new Date(date).getTime();
          if (!Number.isNaN(value)) return value;
        }
        if (apt.date && apt.time) {
          return new Date(`${apt.date}T${apt.time}`).getTime();
        }
        if (apt.date) {
          return new Date(`${apt.date}T00:00:00`).getTime();
        }
        return apt.createdAt ? new Date(apt.createdAt).getTime() : 0;
      };
      return getTime(a) - getTime(b);
    });
    
    const data = sorted.map((apt) => ({
      ...apt,
      id: apt.localId || apt.appointmentId || apt.id,
      statusMeta: apt.statusMeta || getStatusMeta(apt.status),
    }));
    
    setAppointments(data);
  }, []); // ✅ No dependencies - showing all appointments

  useEffect(() => {
    refreshAppointments();
  }, [refreshAppointments]);

  const handlePatientNavigation = useCallback(
    (patientId) => {
      if (!patientId) return;
      navigate(`/patient/${patientId}/profile`);
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

  const applyStatusChange = useCallback(
    (appointmentId, status) => {
      if (!appointmentId) return;
      updateLocalAppointment(appointmentId, {
        status,
      });
      refreshAppointments();
    },
    [refreshAppointments]
  );

  const pendingAppointments = useMemo(
    () => appointments.filter((apt) => apt.status === "REQUESTED"),
    [appointments]
  );

  const upcomingAppointments = useMemo(
    () => appointments.filter((apt) => apt.statusMeta?.includeInUpcoming !== false),
    [appointments]
  );

  const stats = useMemo(() => {
    const uniquePatients = new Map();
    upcomingAppointments.forEach((apt) => {
      if (!uniquePatients.has(apt.patientId)) {
        uniquePatients.set(apt.patientId, {
          id: apt.patientId || apt.localId,
          name: apt.patientName || "Patient",
        });
      }
    });

    return {
      todayAppointments: pendingAppointments.length,
      weeklyAppointments: upcomingAppointments.length,
      totalPatients: uniquePatients.size,
      averageRating: 4.7,
      todayAppointmentsList: pendingAppointments,
      weeklyAppointmentsList: upcomingAppointments,
      patientsList: [...uniquePatients.values()],
      feedback: [],
    };
  }, [pendingAppointments, upcomingAppointments]);

  const prepareAction = useCallback(
    (appointmentId, action) => {
      const appointment = appointments.find((apt) => apt.id === appointmentId);
      if (!appointment) return;

      if (action === "Reschedule") {
        setRescheduleModal({
          visible: true,
          appointmentId,
          appointmentName: appointment.patientName || "Patient",
          newDate: appointment.date || "",
          newTime: appointment.time || appointment.timeLabel || "",
        });
        return;
      }

      const text = `Are you sure you want to ${action.toLowerCase()} the appointment for ${
        appointment.patientName || "this patient"
      }?`;
      setModal({ visible: true, action, appointmentId, text });
    },
    [appointments]
  );

  const confirmModal = useCallback(() => {
    if (!modal.visible || !modal.appointmentId) {
      setModal(INITIAL_MODAL_STATE);
      return;
    }

    switch (modal.action) {
      case "Accept":
        applyStatusChange(modal.appointmentId, "CONFIRMED");
        break;
      case "Decline":
        applyStatusChange(modal.appointmentId, "DECLINED");
        break;
      case "Cancel":
        applyStatusChange(modal.appointmentId, "CANCELLED");
        break;
      default:
        break;
    }

    setModal(INITIAL_MODAL_STATE);
  }, [modal, applyStatusChange]);

  const confirmReschedule = useCallback(() => {
    const { appointmentId, newDate, newTime } = rescheduleModal;
    if (!appointmentId) {
      setRescheduleModal(INITIAL_RESCHEDULE_STATE);
      return;
    }

    updateLocalAppointment(appointmentId, (current) => {
      const startIso = toIsoString(newDate || current.date, newTime || current.time || current.timeLabel);
      let endIso = current.slot?.end;
      if (startIso) {
        const endDate = new Date(new Date(startIso).getTime() + 30 * 60 * 1000);
        endIso = endDate.toISOString();
      }

      return {
        status: "RESCHEDULED",
        date: newDate || current.date,
        time: newTime || current.time || current.timeLabel,
        timeLabel: newTime || current.timeLabel || current.time,
        slot: {
          ...(current.slot || {}),
          start: startIso || current.slot?.start,
          end: endIso,
        },
      };
    });

    refreshAppointments();
    setRescheduleModal(INITIAL_RESCHEDULE_STATE);
  }, [rescheduleModal, refreshAppointments]);

  const now = useMemo(() => new Date(), []);
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

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
              {greeting}, <span className="doctor-highlight">{doctorName}</span>
            </p>
            <p className="motivational">{motivationalByDay}</p>

            <div className="subtle">
              {specialties.length > 0 ? (
                specialties.map((s, i) => (
                  <span key={i} className="specialty-item">
                    Specialty: {s.name || "N/A"} — Price: ${s.price ?? "N/A"} — Years: {s.yearsExperience ?? "N/A"} — Major: {s.major ? "Yes" : "No"}
                    <br />
                  </span>
                ))
              ) : (
                <span>No specialties saved</span>
              )}
              <span className="dashboard-date">
                <br />
                <br /> Date: {now.toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="section-container">
          <DoctorQuickActions onNavigate={navigate} />
        </div>

        <div className="section-container">
          <DoctorOverviewStats
            stats={stats}
            openDropdown={openDropdown}
            onDropdownToggle={toggleDropdown}
            onPatientNavigation={handlePatientNavigation}
          />
        </div>

        {showAppointments && (
          <div className="section-container">
            <DoctorAppointmentsManager
              appointments={pendingAppointments}
              onAppointmentAction={prepareAction}
              onPatientNavigation={handlePatientNavigation}
              onHideAppointments={() => setShowAppointments(false)}
            />
          </div>
        )}

        {modal.visible && (
          <Modal
            title={`Confirm ${modal.action}`}
            message={modal.text}
            onConfirm={confirmModal}
            onCancel={() => setModal(INITIAL_MODAL_STATE)}
          />
        )}

        <RescheduleModal
          visible={rescheduleModal.visible}
          appointmentName={rescheduleModal.appointmentName}
          newDate={rescheduleModal.newDate}
          newTime={rescheduleModal.newTime}
          onConfirm={confirmReschedule}
          onCancel={() => setRescheduleModal(INITIAL_RESCHEDULE_STATE)}
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