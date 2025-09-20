import React, { useEffect, useMemo, useState } from "react";

export const NotificationSystem = ({
  appointments = [],
  feedback = [],
  doctorName = "Dr. Layla Khoury",
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  // Dynamic notifications logic
  const dynamicNotifications = useMemo(() => {
    const notifications = [];
    let id = 1;

    // Check for pending appointments
    const pendingCount = appointments.filter(
      (a) => a.status === "pending"
    ).length;
    if (pendingCount > 0) {
      notifications.push({
        id: id++,
        text: `${pendingCount} pending appointment${
          pendingCount > 1 ? "s" : ""
        } need${pendingCount === 1 ? "s" : ""} your attention`,
      });
    }

    // Show latest feedback
    if (feedback.length > 0) {
      const latestFeedback = feedback[feedback.length - 1];
      notifications.push({
        id: id++,
        text: `New ${latestFeedback.rating}⭐ rating from ${latestFeedback.patient}`,
      });
    }

    // Morning report reminder
    const hour = new Date().getHours();
    if (hour < 10) {
      notifications.push({
        id: id++,
        text: "Daily patient summary report is ready",
      });
    }

    // Busy day alert
    if (appointments.length > 3) {
      notifications.push({
        id: id++,
        text: "Busy day ahead - review today's schedule",
      });
    }

    return notifications;
  }, [appointments, feedback]);

  // Toggle dropdown function
  const toggleDropdown = (key, event) => {
    if (event) event.stopPropagation();
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest(".notif-area")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openDropdown]);

  // Close dropdown with Escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpenDropdown(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="notif-area">
      <button
        className="notif-btn"
        aria-expanded={openDropdown === "notifications"}
        aria-controls="notifications-menu"
        onClick={(e) => toggleDropdown("notifications", e)}
        title={`${dynamicNotifications.length} notifications`}
      >
        🔔
        {dynamicNotifications.length > 0 && (
          <span className="notif-badge">{dynamicNotifications.length}</span>
        )}
      </button>

      {openDropdown === "notifications" && (
        <div
          id="notifications-menu"
          className="dropdown-menu notifications-dropdown"
        >
          <h4>Notifications</h4>
          {dynamicNotifications.length ? (
            <ul>
              {dynamicNotifications.map((n) => (
                <li key={n.id}>{n.text}</li>
              ))}
            </ul>
          ) : (
            <p className="muted">No new notifications</p>
          )}
        </div>
      )}
    </div>
  );
};
