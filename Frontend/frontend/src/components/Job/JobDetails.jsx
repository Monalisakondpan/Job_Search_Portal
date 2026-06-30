import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../../main";
import { FaMapMarkerAlt, FaRupeeSign, FaCalendarAlt, FaTag, FaCity, FaGlobe } from "react-icons/fa";
import { API_BASE_URL } from "../../utils/apiBaseUrl";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigateTo = useNavigate();
  const { isAuthorized, user } = useContext(Context);

  useEffect(() => {
    if (!isAuthorized) { navigateTo("/login"); return; }
    axios.get(`${API_BASE_URL}/api/v1/job/${id}`, { withCredentials: true })
      .then((res) => { setJob(res.data.job); setLoading(false); })
      .catch(() => { setLoading(false); });
  }, [id, isAuthorized]);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", color: "var(--text-muted)" }}>
      Loading job details...
    </div>
  );

  if (!job) return (
    <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
      Job not found.
    </div>
  );

  return (
    <section className="jobDetail page">
      <div className="detail-card">
        <span style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "1rem", display: "block" }}>
          {job.category}
        </span>
        <h3>{job.title}</h3>

        <div className="info-grid">
          <div className="info-item">
            <label><FaGlobe style={{ marginRight: 4 }} /> Country</label>
            <p>{job.country || "N/A"}</p>
          </div>
          <div className="info-item">
            <label><FaCity style={{ marginRight: 4 }} /> City</label>
            <p>{job.city || "N/A"}</p>
          </div>
          <div className="info-item">
            <label><FaMapMarkerAlt style={{ marginRight: 4 }} /> Location</label>
            <p>{job.location || "N/A"}</p>
          </div>
          <div className="info-item">
            <label><FaRupeeSign style={{ marginRight: 4 }} /> Salary</label>
            <p>
              {job.fixedSalary
                ? `₹${Number(job.fixedSalary).toLocaleString()} / year`
                : job.salaryFrom
                ? `₹${Number(job.salaryFrom).toLocaleString()} – ₹${Number(job.salaryTo).toLocaleString()}`
                : "Not Disclosed"}
            </p>
          </div>
          <div className="info-item">
            <label><FaTag style={{ marginRight: 4 }} /> Category</label>
            <p>{job.category || "N/A"}</p>
          </div>
          <div className="info-item">
            <label><FaCalendarAlt style={{ marginRight: 4 }} /> Posted On</label>
            <p>{job.jobPostedOn ? new Date(job.jobPostedOn).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : "N/A"}</p>
          </div>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <label style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.75rem", display: "block" }}>
            Job Description
          </label>
          <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.8, whiteSpace: "pre-line" }}>{job.description}</p>
        </div>

        {user && user.role !== "Employer" && (
          <Link to={`/application/${job._id}`}>
            <button className="apply-btn" style={{ maxWidth: 240, borderRadius: "50px", padding: "0.85rem 2rem" }}>
              Apply Now →
            </button>
          </Link>
        )}
      </div>
    </section>
  );
};

export default JobDetails;