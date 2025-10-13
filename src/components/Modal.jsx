import React from "react";

const Modal = ({ title, message, onConfirm, onCancel, confirmText }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn main" onClick={onConfirm}>
            {confirmText || "Yes, Confirm"}
          </button>
          <button className="btn coral" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;