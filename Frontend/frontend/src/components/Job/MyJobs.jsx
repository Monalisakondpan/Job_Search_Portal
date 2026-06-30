import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCheck, FaPen, FaTrash } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../utils/apiBaseUrl";

const MyJobs = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [editingMode, setEditingMode] = useState(null);
  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthorized || (user && user.role !== "Employer")) { navigateTo("/"); return; }
    axios.get(`${API_BASE_URL}/api/v1/job/getmyjobs`, { withCredentials: true })
      .then(({ data }) => setMyJobs(data.myJobs))
      .catch((err) => { toast.error(err.response?.data?.message || "Failed to load"); setMyJobs([]); });
  }, [isAuthorized, user]);

  const handleUpdateJob = async (jobId) => {
    const updatedJob = myJobs.find((j) => j._id === jobId);
    try {
      const res = await axios.put(`${API_BASE_URL}/api/v1/job/update/${jobId}`, updatedJob, { withCredentials: true });
      toast.success(res.data.message);
      setEditingMode(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/api/v1/job/delete/${jobId}`, { withCredentials: true });
      toast.success(res.data.message);
      setMyJobs((prev) => prev.filter((j) => j._id !== jobId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const handleInputChange = (jobId, field, value) => {
    setMyJobs((prev) => prev.map((j) => j._id === jobId ? { ...j, [field]: value } : j));
  };

  const inputStyle = (editing) => ({
    background: editing ? "var(--primary)" : "transparent",
    border: editing ? "1px solid var(--border)" : "none",
    borderRadius: 8,
    padding: editing ? "0.5rem 0.75rem" : "0",
    color: "var(--text)",
    fontFamily: "DM Sans, sans-serif",
    fontSize: "0.88rem",
    width: "100%",
    outline: "none",
    transition: "all 0.3s ease",
  });

  return (
    <section className="myJobs page">
      <h3>My Posted Jobs</h3>
      <div className="container">
        {myJobs.length > 0 ? myJobs.map((job, i) => {
          const editing = editingMode === job._id;
          return (
            <div className="card" key={job._id} style={{ animationDelay: `${i * 0.07}s`, position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: job.expired ? "var(--accent2)" : "var(--accent3)", background: job.expired ? "rgba(193,71,61,0.1)" : "rgba(111,166,107,0.1)", padding: "0.2rem 0.65rem", borderRadius: "50px", border: `1px solid ${job.expired ? "rgba(193,71,61,0.25)" : "rgba(111,166,107,0.25)"}` }}>
                  {job.expired ? "Expired" : "Active"}
                </span>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {editing ? (
                    <>
                      <button onClick={() => handleUpdateJob(job._id)} style={{ background: "rgba(111,166,107,0.15)", border: "1px solid rgba(111,166,107,0.3)", color: "var(--accent3)", padding: "0.4rem 0.8rem", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8rem", fontFamily: "DM Sans, sans-serif" }}>
                        <FaCheck /> Save
                      </button>
                      <button onClick={() => setEditingMode(null)} style={{ background: "rgba(193,71,61,0.1)", border: "1px solid rgba(193,71,61,0.25)", color: "var(--accent2)", padding: "0.4rem 0.8rem", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8rem", fontFamily: "DM Sans, sans-serif" }}>
                        <RxCross2 /> Cancel
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setEditingMode(job._id)} style={{ background: "rgba(194,117,75,0.12)", border: "1px solid rgba(194,117,75,0.3)", color: "var(--accent)", padding: "0.4rem 0.8rem", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8rem", fontFamily: "DM Sans, sans-serif" }}>
                      <FaPen /> Edit
                    </button>
                  )}
                  <button onClick={() => handleDeleteJob(job._id)} style={{ background: "rgba(193,71,61,0.1)", border: "1px solid rgba(193,71,61,0.25)", color: "var(--accent2)", padding: "0.4rem 0.8rem", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8rem", fontFamily: "DM Sans, sans-serif" }}>
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {[
                  { label: "Title", field: "title" },
                  { label: "Country", field: "country" },
                  { label: "City", field: "city" },
                ].map(({ label, field }) => (
                  <div key={field}>
                    <label style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: "0.3rem" }}>{label}</label>
                    <input type="text" value={job[field] || ""} disabled={!editing} onChange={(e) => handleInputChange(job._id, field, e.target.value)} style={inputStyle(editing)} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: "0.3rem" }}>Salary</label>
                  {job.fixedSalary ? (
                    <input type="number" value={job.fixedSalary} disabled={!editing} onChange={(e) => handleInputChange(job._id, "fixedSalary", e.target.value)} style={inputStyle(editing)} />
                  ) : (
                    <span style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
                      {job.salaryFrom?.toLocaleString()} – {job.salaryTo?.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ marginTop: "1rem" }}>
                <label style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: "0.3rem" }}>Description</label>
                <textarea value={job.description || ""} disabled={!editing} rows={3} onChange={(e) => handleInputChange(job._id, "description", e.target.value)}
                  style={{ ...inputStyle(editing), resize: "vertical", minHeight: "80px", lineHeight: 1.6 }} />
              </div>
            </div>
          );
        }) : (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
            <p>You haven't posted any jobs yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MyJobs;