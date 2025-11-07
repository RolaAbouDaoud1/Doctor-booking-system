export const LOCAL_APPOINTMENTS_KEY = "pendingAppointments";

export const APPOINTMENT_STATUS_META = {
  REQUESTED: {
    label: "Waiting for doctor approval",
    badgeClass: "pending",
    allowReschedule: false,
    allowCancel: true,
    includeInToday: true,
    includeInUpcoming: true,
  },
  CONFIRMED: {
    label: "Confirmed",
    badgeClass: "confirmed",
    allowReschedule: true,
    allowCancel: true,
    includeInToday: true,
    includeInUpcoming: true,
  },
  RESCHEDULED: {
    label: "Rescheduled",
    badgeClass: "rescheduled",
    allowReschedule: true,
    allowCancel: true,
    includeInToday: true,
    includeInUpcoming: true,
  },
  DECLINED: {
    label: "Declined",
    badgeClass: "declined",
    allowReschedule: false,
    allowCancel: false,
    includeInToday: false,
    includeInUpcoming: false,
  },
  CANCELLED: {
    label: "Cancelled",
    badgeClass: "cancelled",
    allowReschedule: false,
    allowCancel: false,
    includeInToday: false,
    includeInUpcoming: false,
  },
  COMPLETED: {
    label: "Completed",
    badgeClass: "completed",
    allowReschedule: false,
    allowCancel: false,
    includeInToday: false,
    includeInUpcoming: false,
  },
  DEFAULT: {
    label: "Scheduled",
    badgeClass: "confirmed",
    allowReschedule: true,
    allowCancel: true,
    includeInToday: true,
    includeInUpcoming: true,
  },
};

export const getStatusMeta = (status) =>
  APPOINTMENT_STATUS_META[status] || APPOINTMENT_STATUS_META.DEFAULT;

const safeParse = (value) => {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("Failed to parse stored appointments", err);
    return [];
  }
};

const safeStringify = (value) => {
  try {
    return JSON.stringify(value);
  } catch (err) {
    console.error("Failed to stringify appointments", err);
    return "[]";
  }
};

const generateLocalId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `local-${crypto.randomUUID()}`;
  }
  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const readLocalAppointments = () => {
  const stored = localStorage.getItem(LOCAL_APPOINTMENTS_KEY);
  if (!stored) return [];
  return safeParse(stored).filter(Boolean);
};

export const writeLocalAppointments = (appointments) => {
  localStorage.setItem(LOCAL_APPOINTMENTS_KEY, safeStringify(appointments));
};

export const saveLocalAppointment = (appointment) => {
  try {
    const record = {
      ...appointment,
      status: appointment.status || "REQUESTED",
      localId: appointment.localId || generateLocalId(),
      createdAt: appointment.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isOffline: true,
    };

    const existing = readLocalAppointments();
    existing.push(record);
    writeLocalAppointments(existing);
    return record;
  } catch (err) {
    console.error("Failed to save local appointment", err);
    return null;
  }
};

export const removeLocalAppointment = (localId) => {
  if (!localId) return;
  const filtered = readLocalAppointments().filter((item) => item.localId !== localId);
  writeLocalAppointments(filtered);
};

const formatTimeDisplay = (date) =>
  date
    ? date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })
    : "--";

const deriveDateTime = (appointment) => {
  const slotStart = appointment.slot?.start ? new Date(appointment.slot.start) : null;
  const date = appointment.date || (slotStart ? slotStart.toISOString().split("T")[0] : null);
  const timeLabel =
    appointment.timeLabel ||
    appointment.time ||
    (slotStart ? formatTimeDisplay(slotStart) : "--");
  return { slotStart, date, timeLabel };
};

export const normalizeLocalAppointment = (appointment) => {
  if (!appointment) return null;

  const { slotStart, date, timeLabel } = deriveDateTime(appointment);
  const status = appointment.status || "REQUESTED";
  const statusMeta = getStatusMeta(status);

  const doctorName = appointment.doctorName || "Pending Doctor";
  const patientName = appointment.patientName || "Patient";
  const type = appointment.caseType || appointment.type || "Consultation";

  return {
    ...appointment,
    appointmentId: appointment.localId,
    localId: appointment.localId,
    doctorId: appointment.doctorId,
    doctorName,
    patientId: appointment.patientId,
    patientName,
    specialty: appointment.doctorSpecialty || appointment.specialty || "General",
    date,
    time: timeLabel,
    timeLabel,
    status,
    statusMeta,
    slotStart,
    type,
    isOffline: true,
    offlineError: appointment.error,
  };
};

const sortAppointments = (list = []) =>
  [...list].sort((a, b) => {
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

export const mergeLocalWithRemote = ({ remote = [], local = [] } = {}) => {
  const normalizedLocal = local
    .map(normalizeLocalAppointment)
    .filter(Boolean);

  return [...normalizedLocal, ...(remote || [])];
};

export const getAppointmentsForPatient = (patientId) => {
  if (!patientId) return [];
  const records = readLocalAppointments().filter(
    (item) => String(item.patientId) === String(patientId)
  );
  return sortAppointments(records).map(normalizeLocalAppointment).filter(Boolean);
};

export const getAppointmentsForDoctor = (doctorId) => {
  if (!doctorId) return [];
  const records = readLocalAppointments().filter(
    (item) => String(item.doctorId) === String(doctorId)
  );
  return sortAppointments(records).map(normalizeLocalAppointment).filter(Boolean);
};

export const updateLocalAppointment = (localId, updater) => {
  if (!localId) return null;
  const records = readLocalAppointments();
  const idx = records.findIndex((item) => item.localId === localId);
  if (idx === -1) return null;

  const current = records[idx];
  const next =
    typeof updater === "function"
      ? { ...current, ...updater(current) }
      : { ...current, ...updater };

  records[idx] = {
    ...next,
    updatedAt: new Date().toISOString(),
  };

  writeLocalAppointments(records);
  return normalizeLocalAppointment(records[idx]);
};

export const clearLocalAppointments = () => {
  writeLocalAppointments([]);
};

