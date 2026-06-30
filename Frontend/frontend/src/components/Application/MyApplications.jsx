import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ResumeModal from "./ResumeModal";
import { FaEye, FaTrash } from "react-icons/fa";
import { API_BASE_URL } from "../../utils/apiBaseUrl";

// Keep in sync with Backend/models/applicationSchema.js -> APPLICATION_STATUSES.
// No shared module between frontend/backend in this project, so this list
// is duplicated here on purpose — update both places if statuses change.
const APPLICATION_STATUSES = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Interview Scheduled",
  "Selected",
  "Rejected",
];

const STATUS_COLORS = {
  Applied: "#6b7280",
  "Under Review": "#d97706",
  Shortlisted: "#2563eb",
  "Interview Scheduled": "#7c3aed",
  Selected: "#16a34a",
  Rejected: "#dc2626",
};

const MyApplications = () => {
  const { user, isAuthorized } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthorized) { navigateTo("/"); return; }
  }, [isAuthorized]);

  useEffect(() => {
    if (!user) return;
    const endpoint = user.role === "Employer"
      ? `${API_BASE_URL}/api/v1/application/employer/getall`
      : `${API_BASE_URL}/api/v1/application/jobseeker/getall`;

    axios.get(endpoint, { withCredentials: true })
      .then(({ data }) => { setApplications(data.applications); setLoading(false); })
      .catch((err) => { toast.error(err.response?.data?.message || "Failed to fetch"); setLoading(false); });
  }, [user]);

  const deleteApplication = async (id) => {
    try {
      const { data } = await axios.delete(`${API_BASE_URL}/api/v1/application/delete/${id}`, { withCredentials: true });
      toast.success(data.message);
      setApplications((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const updateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const { data } = await axios.put(
        `${API_BASE_URL}/api/v1/application/status/${id}`,
        { status: newStatus },
        { withCredentials: true }
      );
      toast.success(data.message);
      setApplications((prev) => prev.map((a) => (a._id === id ? data.application : a)));
    } catch (err) {
      toast.error(err.response?.data?.message || "Status update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div style={{ padding: "4rem", textAlign: "center", color: "var(--text-muted)" }}>Loading applications...</div>;

  return (
    <section className="myApplications page">
      <h3>{user?.role === "Employer" ? "Applications Received" : "My Applications"}</h3>
      <div className="container">
        {applications.length > 0 ? applications.map((app, i) => (
          <div className="card" key={app._id} style={{ animationDelay: `${i * 0.07}s` }}>
            <p><span>Name:</span> {app.name}</p>
            <p><span>Email:</span> {app.email}</p>
            <p><span>Phone:</span> {app.phone}</p>
            <p><span>Address:</span> {app.address}</p>

            <div style={{ marginTop: "0.75rem", borderTop: "1px solid var(--border)", paddingTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "0.2rem 0.65rem",
                  borderRadius: "999px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "#fff",
                  backgroundColor: STATUS_COLORS[app.status] || "#6b7280",
                }}
              >
                {app.status || "Applied"}
              </span>

              {user?.role === "Employer" ? (
                <select
                  value={app.status || "Applied"}
                  disabled={updatingId === app._id}
                  onChange={(e) => updateStatus(app._id, e.target.value)}
                  style={{ fontSize: "0.8rem", padding: "0.2rem 0.4rem" }}
                >
                  {APPLICATION_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              ) : null}

              {app.statusHistory?.length > 0 && (
                <button
                  type="button"
                  onClick={() => setExpandedHistoryId(expandedHistoryId === app._id ? null : app._id)}
                  style={{ fontSize: "0.75rem", color: "var(--text-muted)", background: "none", border: "none", textDecoration: "underline", cursor: "pointer", padding: 0 }}
                >
                  {expandedHistoryId === app._id ? "Hide history" : "View history"}
                </button>
              )}
            </div>

            {expandedHistoryId === app._id && (
              <ul style={{ marginTop: "0.5rem", paddingLeft: "1rem", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                {app.statusHistory.map((h, idx) => (
                  <li key={idx}>
                    {h.status} — {new Date(h.changedAt).toLocaleString()}
                  </li>
                ))}
              </ul>
            )}

            <p style={{ marginTop: "0.75rem", borderTop: "1px solid var(--border)", paddingTop: "0.75rem" }}>
              <span>Cover Letter:</span><br />
              <span style={{ fontWeight: 400, color: "var(--text-muted)", fontSize: "0.85rem" }}>{app.coverLetter?.slice(0, 150)}{app.coverLetter?.length > 150 ? "..." : ""}</span>
            </p>
            {user?.role === "Employer" && app.atsScore && (
              <div style={{ marginTop: "0.75rem", borderTop: "1px solid var(--border)", paddingTop: "0.75rem" }}>
                {app.atsScore.score !== null ? (
                  <>
                    <p style={{ fontWeight: 600 }}>
                      ATS Score:{" "}
                      <span style={{
                        color: app.atsScore.score >= 70 ? "#16a34a" : app.atsScore.score >= 40 ? "#d97706" : "#dc2626",
                      }}>
                        {app.atsScore.score}%
                      </span>
                    </p>
                    {app.atsScore.matchedSkills?.length > 0 && (
                      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        Matched: {app.atsScore.matchedSkills.join(", ")}
                      </p>
                    )}
                    {app.atsScore.missingSkills?.length > 0 && (
                      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        Missing: {app.atsScore.missingSkills.join(", ")}
                      </p>
                    )}
                  </>
                ) : (
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    ATS Score: not available — {app.atsScore.note}
                  </p>
                )}
              </div>
            )}
            <div className="btn-group">
              <button className="btn-view" onClick={() => { setResumeImageUrl(app.resume?.url || ""); setModalOpen(true); }}>
                <FaEye style={{ marginRight: 6 }} /> View Resume
              </button>
              {user?.role !== "Employer" && (
                <button className="btn-delete" onClick={() => deleteApplication(app._id)}>
                  <FaTrash style={{ marginRight: 6 }} /> Delete
                </button>
              )}
            </div>
          </div>
        )) : (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
            <p style={{ fontSize: "1.1rem" }}>No applications found.</p>
          </div>
        )}
      </div>
      {modalOpen && <ResumeModal imageUrl={resumeImageUrl} onClose={() => setModalOpen(false)} />}
    </section>
  );
};

export default MyApplications;