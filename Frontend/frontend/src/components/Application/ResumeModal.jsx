import React from "react";
import { IoClose } from "react-icons/io5";

const ResumeModal = ({ imageUrl, onClose }) => {
  return (
    <div className="resumeModal" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose}><IoClose /></button>
        {imageUrl ? (
          imageUrl.endsWith(".pdf") ? (
            <iframe src={imageUrl} title="Resume" style={{ width: "80vw", height: "80vh", border: "none", borderRadius: "12px" }} />
          ) : (
            <img src={imageUrl} alt="Resume" />
          )
        ) : (
          <p style={{ color: "var(--text-muted)", padding: "2rem" }}>No resume available.</p>
        )}
      </div>
    </div>
  );
};

export default ResumeModal;
