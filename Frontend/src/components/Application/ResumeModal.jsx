import React from "react";

const ResumeModal = ({ imageUrl, onClose }) => {
  if (!imageUrl) {
    return null; // Do not render the modal if no image URL is provided
  }

  return (
    <div className="resume-modal" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <button
          className="close"
          onClick={onClose}
          aria-label="Close Modal"
        >
          &times;
        </button>
        <img src={imageUrl} alt="Resume Preview" />
      </div>
    </div>
  );
};

export default ResumeModal;
