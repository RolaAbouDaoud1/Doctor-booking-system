import React from "react";
import HistoryCard from "./HistoryCard";

export default function PatientHistory({ history, handleCancel }) {
  return (
    <div className="history-section">
      <h3>Medical History</h3>
      {history.map(item => (
        <HistoryCard key={item.id} item={item} handleCancel={handleCancel} />
      ))}
    </div>
  );
}
