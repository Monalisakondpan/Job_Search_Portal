import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Context } from "../../main";
import { FaMapMarkerAlt, FaBriefcase, FaRupeeSign, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { API_BASE_URL } from "../../utils/apiBaseUrl";

const PAGE_SIZE = 9;

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!isAuthorized) navigateTo("/login");
  }, [isAuthorized]);

  // Read category from URL query param (set by PopularCategories click)
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setFilterCategory(cat);
  }, [searchParams]);

  // Full category list, fetched once — independent of pagination, so the
  // dropdown always shows every category even when the current page doesn't.
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/v1/job/categories`, { withCredentials: true })
      .then((res) => setCategories(res.data.categories || []))
      .catch(console.error);
  }, []);

  // Debounced search — avoids firing a request on every single keystroke.
  useEffect(() => {
    if (!isAuthorized) return;
    setLoading(true);
    const timer = setTimeout(() => {
      axios.get(`${API_BASE_URL}/api/v1/job/getall`, {
        withCredentials: true,
        params: { search: search || undefined, category: filterCategory || undefined, page, limit: PAGE_SIZE },
      })
        .then((res) => {
          setJobs(res.data.jobs || []);
          setTotalPages(res.data.totalPages || 1);
          setTotalJobs(res.data.totalJobs || 0);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 350);
    return () => clearTimeout(timer);
  }, [isAuthorized, search, filterCategory, page]);

  // Reset to page 1 whenever the search/category changes — otherwise you
  // could land on "page 4" of a filtered set that only has 1 page.
  useEffect(() => { setPage(1); }, [search, filterCategory]);

  return (
    <section className="jobs page">
      <div className="container">
        <div className="jobs-header">
          <h3>All Available Jobs</h3>
          <p>{totalJobs} opportunit{totalJobs === 1 ? "y" : "ies"} found</p>
        </div>

        <div className="search-filter-bar">
          <input
            type="text"
            placeholder="🔍  Search by title, city, country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="banner">
          {loading ? (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
              Loading jobs...
            </div>
          ) : jobs.length > 0 ? jobs.map((job, i) => (
            <div className="card" key={job._id} style={{ animationDelay: `${i * 0.06}s` }}>
              <span className="job-badge">{job.category || "General"}</span>
              <h5>{job.title}</h5>
              <div className="job-meta">
                {job.country && (
                  <span><FaMapMarkerAlt /> {job.city ? `${job.city}, ` : ""}{job.country}</span>
                )}
                {job.fixedSalary && (
                  <span><FaRupeeSign /> {Number(job.fixedSalary).toLocaleString()}/yr</span>
                )}
                {job.salaryFrom && (
                  <span><FaRupeeSign /> {Number(job.salaryFrom).toLocaleString()} – {Number(job.salaryTo).toLocaleString()}</span>
                )}
              </div>
              {job.description && (
                <p>{job.description.slice(0, 110)}{job.description.length > 110 ? "..." : ""}</p>
              )}
              <Link to={`/job/${job._id}`}>
                <button className="apply-btn">View Details →</button>
              </Link>
            </div>
          )) : (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
              <FaBriefcase style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.4, display: "block", margin: "0 auto 1rem" }} />
              <p>No jobs match your search. Try different keywords.</p>
              {filterCategory && (
                <button onClick={() => setFilterCategory("")}
                  style={{ marginTop: "1rem", background: "rgba(194,117,75,0.15)", border: "1px solid rgba(194,117,75,0.3)",
                    color: "var(--accent)", padding: "0.5rem 1.2rem", borderRadius: "50px", cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>
                  Clear Filter
                </button>
              )}
            </div>
          )}
        </div>

        {!loading && totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: "2.5rem" }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                background: "var(--glass)", border: "1px solid var(--border)", color: page === 1 ? "var(--text-muted)" : "var(--text)",
                borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center",
                cursor: page === 1 ? "default" : "pointer", opacity: page === 1 ? 0.5 : 1,
              }}
            >
              <FaChevronLeft />
            </button>
            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                background: "var(--glass)", border: "1px solid var(--border)", color: page === totalPages ? "var(--text-muted)" : "var(--text)",
                borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center",
                cursor: page === totalPages ? "default" : "pointer", opacity: page === totalPages ? 0.5 : 1,
              }}
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Jobs;