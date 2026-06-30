import React, { useContext, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaBriefcase } from "react-icons/fa";
import { API_BASE_URL } from "../../utils/apiBaseUrl";

const ResetPassword = () => {
  const { token } = useParams();
  const navigateTo = useNavigate();
  const { setIsAuthorized, setUser } = useContext(Context);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords don't match.");
      return;
    }

    const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;
    if (!complexityRegex.test(password)) {
      toast.error("Password must include an uppercase letter, a lowercase letter, a number, and a special character.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.put(
        `${API_BASE_URL}/api/v1/user/password/reset/${token}`,
        { password },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      toast.success(data.message);
      setIsAuthorized(true);
      setUser(data.user);
      navigateTo("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset link is invalid or has expired.");
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
          <h3>Set a new password</h3>
          <p>Choose a new password for your account.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="inputTag">
            <label>New Password</label>
            <div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
                role="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>
              Must include an uppercase letter, a lowercase letter, a number, and a special character.
            </p>
          </div>
          <div className="inputTag">
            <label>Confirm New Password</label>
            <div>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                required
              />
            </div>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password →"}
          </button>
          <Link to="/login">Back to Login</Link>
        </form>
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

export default ResetPassword;