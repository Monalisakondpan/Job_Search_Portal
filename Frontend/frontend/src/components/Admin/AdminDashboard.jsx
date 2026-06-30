import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaBriefcase, FaFileAlt, FaCheckCircle, FaTrash } from "react-icons/fa";
import { API_BASE_URL } from "../../utils/apiBaseUrl";

const API = `${API_BASE_URL}/api/v1/admin`;

const cardStyle = {
  background: "var(--glass)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  padding: "1.25rem 1.5rem",
  flex: "1 1 160px",
};

const thStyle = {
  textAlign: "left",
  padding: "0.7rem 1rem",
  borderBottom: "1px solid var(--border)",
  color: "var(--text-muted)",
  fontSize: "0.78rem",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const tdStyle = {
  padding: "0.7rem 1rem",
  borderBottom: "1px solid var(--border)",
  color: "var(--text)",
  fontSize: "0.88rem",
};

const deleteBtnStyle = {
  background: "rgba(193,71,61,0.1)",
  border: "1px solid rgba(193,71,61,0.25)",
  color: "var(--accent2)",
  borderRadius: "8px",
  padding: "0.35rem 0.7rem",
  cursor: "pointer",
  fontSize: "0.8rem",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.35rem",
};

const AdminDashboard = () => {
  const { user, isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [tab, setTab] = useState("users");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthorized) { navigateTo("/"); return; }
    if (user && user.role !== "Admin") { navigateTo("/"); }
  }, [isAuthorized, user]);

  useEffect(() => {
    if (!user || user.role !== "Admin") return;

    const fetchAll = async () => {
      try {
        const [statsRes, usersRes, jobsRes] = await Promise.all([
          axios.get(`${API}/stats`, { withCredentials: true }),
          axios.get(`${API}/users`, { withCredentials: true }),
          axios.get(`${API}/jobs`, { withCredentials: true }),
        ]);
        setStats(statsRes.data.stats);
        setUsers(usersRes.data.users);
        setJobs(jobsRes.data.jobs);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user]);

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user permanently? This does not delete their jobs or applications.")) return;
    try {
      const { data } = await axios.delete(`${API}/user/${id}`, { withCredentials: true });
      toast.success(data.message);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const deleteJob = async (id) => {
    if (!window.confirm("Delete this job posting permanently?")) return;
    try {
      const { data } = await axios.delete(`${API}/job/${id}`, { withCredentials: true });
      toast.success(data.message);
      setJobs((prev) => prev.filter((j) => j._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) {
    return <div style={{ padding: "4rem", textAlign: "center", color: "var(--text-muted)" }}>Loading admin dashboard...</div>;
  }

  return (
    <section className="page" style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
      <h3 style={{ marginBottom: "1.5rem" }}>Admin Dashboard</h3>

      {/* Stats */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        <div style={cardStyle}>
          <FaUsers style={{ color: "var(--accent)", fontSize: "1.2rem", marginBottom: "0.4rem" }} />
          <p style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text)" }}>{stats?.totalUsers ?? "-"}</p>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            Total Users ({stats?.totalJobSeekers ?? 0} Job Seekers, {stats?.totalEmployers ?? 0} Employers)
          </p>
        </div>
        <div style={cardStyle}>
          <FaBriefcase style={{ color: "var(--accent)", fontSize: "1.2rem", marginBottom: "0.4rem" }} />
          <p style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text)" }}>{stats?.totalJobs ?? "-"}</p>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Total Jobs Posted</p>
        </div>
        <div style={cardStyle}>
          <FaCheckCircle style={{ color: "var(--accent3)", fontSize: "1.2rem", marginBottom: "0.4rem" }} />
          <p style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text)" }}>{stats?.activeJobs ?? "-"}</p>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Active ({stats?.expiredJobs ?? 0} Expired)</p>
        </div>
        <div style={cardStyle}>
          <FaFileAlt style={{ color: "var(--accent)", fontSize: "1.2rem", marginBottom: "0.4rem" }} />
          <p style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text)" }}>{stats?.totalApplications ?? "-"}</p>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Total Applications</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        {["users", "jobs"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "0.5rem 1.2rem",
              borderRadius: "999px",
              border: "1px solid var(--border)",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: 600,
              background: tab === t ? "var(--accent)" : "transparent",
              color: tab === t ? "#fff" : "var(--text-muted)",
            }}
          >
            {t === "users" ? `Users (${users.length})` : `Jobs (${jobs.length})`}
          </button>
        ))}
      </div>

      {tab === "users" && (
        <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Joined</th>
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td style={tdStyle}>{u.name}</td>
                  <td style={tdStyle}>{u.email}</td>
                  <td style={tdStyle}>{u.role}</td>
                  <td style={tdStyle}>{u.phone}</td>
                  <td style={tdStyle}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td style={tdStyle}>
                    {u.role !== "Admin" && (
                      <button style={deleteBtnStyle} onClick={() => deleteUser(u._id)}>
                        <FaTrash /> Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td style={tdStyle} colSpan={6}>No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === "jobs" && (
        <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Title</th>
                <th style={thStyle}>Posted By</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Location</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j._id}>
                  <td style={tdStyle}>{j.title}</td>
                  <td style={tdStyle}>{j.postedBy?.name || "Unknown"} ({j.postedBy?.email || "—"})</td>
                  <td style={tdStyle}>{j.category}</td>
                  <td style={tdStyle}>{j.city}, {j.country}</td>
                  <td style={tdStyle}>
                    <span style={{ color: j.expired ? "var(--accent2)" : "var(--accent3)", fontWeight: 600 }}>
                      {j.expired ? "Expired" : "Active"}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <button style={deleteBtnStyle} onClick={() => deleteJob(j._id)}>
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr><td style={tdStyle} colSpan={6}>No jobs found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default AdminDashboard;