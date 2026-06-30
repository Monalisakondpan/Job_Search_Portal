import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../main";
import { API_BASE_URL } from "../../utils/apiBaseUrl";

const Application = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [resume, setResume] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!isAuthorized || (user && user.role === "Employer")) navigateTo("/");
  }, [isAuthorized, user]);

  const handleFileChange = (e) => setResume(e.target.files[0]);

  const handleApplication = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("coverLetter", coverLetter);
    formData.append("resume", resume);
    formData.append("jobId", id);

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/v1/application/post`,
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success(data.message);
      setName(""); setEmail(""); setCoverLetter(""); setPhone(""); setAddress(""); setResume(null);
      navigateTo("/job/getall");
    } catch (error) {
      toast.error(error.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="application page">
      <h3>Submit Your Application</h3>
      <form onSubmit={handleApplication}>
        <div>
          <label>Full Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required />
        </div>
        <div>
          <label>Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required />
        </div>
        <div>
          <label>Phone Number</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 9876543210" required />
        </div>
        <div>
          <label>Address</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Your current address" required />
        </div>
        <div>
          <label>Cover Letter</label>
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Tell the employer why you're the right fit for this role..."
            rows={6}
            required
          />
        </div>
        <div>
          <label>Resume (PDF, JPG, PNG)</label>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} required />
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Send Application →"}
        </button>
      </form>
    </section>
  );
};

export default Application;