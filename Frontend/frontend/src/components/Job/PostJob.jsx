import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
import { API_BASE_URL } from "../../utils/apiBaseUrl";

const PostJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  const [fixedSalary, setFixedSalary] = useState("");
  const [salaryType, setSalaryType] = useState("default");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthorized || (user && user.role !== "Employer")) navigateTo("/");
  }, [isAuthorized, user]);

  const handleJobPost = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      title, description, category, country, city, location,
      requiredSkills,
      ...(salaryType === "Fixed Salary" ? { fixedSalary } : { salaryFrom, salaryTo }),
    };
    try {
      const res = await axios.post(`${API_BASE_URL}/api/v1/job/post`, payload, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      toast.success(res.data.message);
      setTitle(""); setDescription(""); setCategory(""); setCountry("");
      setCity(""); setLocation(""); setSalaryFrom(""); setSalaryTo(""); setFixedSalary(""); setSalaryType("default");
      setRequiredSkills("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post job");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="postJob page">
      <h3>Post a New Job</h3>
      <form onSubmit={handleJobPost}>
        <div>
          <label>Job Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior React Developer" required />
        </div>

        <div>
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">Select Category</option>
            <option value="Graphics & Design">Graphics & Design</option>
            <option value="Mobile App Development">Mobile App Development</option>
            <option value="Frontend Web Development">Frontend Web Development</option>
            <option value="MERN Stack Development">MERN Stack Development</option>
            <option value="Account & Finance">Account & Finance</option>
            <option value="Artificial Intelligence">Artificial Intelligence</option>
            <option value="Video Animation">Video Animation</option>
            <option value="MEAN Stack Development">MEAN Stack Development</option>
            <option value="MEVN Stack Development">MEVN Stack Development</option>
            <option value="Data Entry Operator">Data Entry Operator</option>
          </select>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label>Country</label>
            <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="India" required />
          </div>
          <div>
            <label>City</label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Bangalore" required />
          </div>
        </div>

        <div>
          <label>Location / Address</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Full office address" />
        </div>

        <div>
          <label>Salary Type</label>
          <select value={salaryType} onChange={(e) => setSalaryType(e.target.value)}>
            <option value="default">Select Salary Type</option>
            <option value="Fixed Salary">Fixed Salary</option>
            <option value="Ranged Salary">Ranged Salary</option>
          </select>
        </div>

        {salaryType === "Fixed Salary" && (
          <div>
            <label>Fixed Salary (₹/year)</label>
            <input type="number" value={fixedSalary} onChange={(e) => setFixedSalary(e.target.value)} placeholder="e.g. 1200000" />
          </div>
        )}

        {salaryType === "Ranged Salary" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label>Salary From (₹)</label>
              <input type="number" value={salaryFrom} onChange={(e) => setSalaryFrom(e.target.value)} placeholder="800000" />
            </div>
            <div>
              <label>Salary To (₹)</label>
              <input type="number" value={salaryTo} onChange={(e) => setSalaryTo(e.target.value)} placeholder="1500000" />
            </div>
          </div>
        )}

        <div>
          <label>Job Description</label>
          <textarea rows="8" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the role, responsibilities, required skills..." required />
        </div>

        <div>
          <label>Required Skills (comma-separated)</label>
          <input
            type="text"
            value={requiredSkills}
            onChange={(e) => setRequiredSkills(e.target.value)}
            placeholder="e.g. React, Node.js, MongoDB, Docker"
          />
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            Used to auto-score applicants' resumes. Leave blank to skip ATS scoring for this job.
          </p>
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Posting..." : "Post Job →"}
        </button>
      </form>
    </section>
  );
};

export default PostJob;
