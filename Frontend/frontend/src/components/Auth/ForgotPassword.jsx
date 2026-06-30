import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaBriefcase } from "react-icons/fa";
import { API_BASE_URL } from "../../utils/apiBaseUrl";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/v1/user/password/forgot`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success(data.message);
      setSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authPage">
      <div className="container">
        <div className="header">
          <img src="/mascot-logo.png" alt="CareerForge logo" />
          <div className="auth-logo">
            <span className="logo-job">Career</span><span className="logo-search">Forge</span>
          </div>
          <h3>Forgot your password?</h3>
          <p>Enter your email and we'll send you a link to reset it.</p>
        </div>

        {sent ? (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              If an account exists for <strong style={{ color: "var(--text)" }}>{email}</strong>, a reset link is on its way.
              Check your inbox (and spam folder) — the link expires in 30 minutes.
            </p>
            <Link to="/login">Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="inputTag">
              <label>Email Address</label>
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
                <MdOutlineMailOutline />
              </div>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link →"}
            </button>
            <Link to="/login">Back to Login</Link>
          </form>
        )}
      </div>
      <div className="banner">
        <div className="auth-illustration">
          <div className="illus-circle big"></div>
          <div className="illus-circle med"></div>
          <div className="illus-circle small"></div>
          <div className="illus-card">
            <FaBriefcase className="illus-icon" />
            <div className="illus-text">
              <p>1,23,441</p>
              <span>Jobs Available</span>
            </div>
          </div>
          <div className="illus-tagline">
            <span className="logo-job">Career</span><span className="logo-search">Forge</span>
            <p>Your career, your future.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;