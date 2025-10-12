import React from "react";

export default function HistoryCard({ item, handleCancel }) {
  return (
    <div className="history-card" key={item.id}>
      <div className="history-icon">{item.icon}</div>
      <div className="history-info">
        <h4>{item.type}</h4>
        <p>{item.doctor}</p>
        <p>{item.date} {item.time && `• ${item.time}`}</p>
        {item.details && <div className="details">{item.details}</div>}
        {item.status && <span className={`status ${item.status.toLowerCase()}`}>{item.status}</span>}
        {item.status === "Scheduled" && (
          <button className="cancel-button" onClick={() => handleCancel(item.id)}>
            Cancel Appointment
          </button>
        )}
      </div>
    </div>
  );
}
