import React, { useContext, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { FaPencilAlt, FaRegUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaPhoneFlip } from "react-icons/fa6";
import { Navigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../../utils/apiBaseUrl";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);

  const handleRegister = async (e) => {
    e.preventDefault();

    const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;
    if (!complexityRegex.test(password)) {
      toast.error("Password must include an uppercase letter, a lowercase letter, a number, and a special character.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/v1/user/register`,
        { name, email, password, phone, role },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      toast.success(data.message);
      setName(""); setEmail(""); setPassword(""); setPhone(""); setRole("");
      setIsAuthorized(true);
      setUser(data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isAuthorized) return <Navigate to="/" />;

  return (
    <div className="authPage">
      <div className="container">
        <div className="header">
          <img src="/mascot-logo.png" alt="CareerForge logo" />
          <div className="auth-logo">
            <span className="logo-job">Career</span><span className="logo-search">Forge</span>
          </div>
          <h3>Create your account</h3>
          <p>Join thousands finding their dream jobs</p>
        </div>
        <form>
          <div className="inputTag">
            <label>Register As</label>
            <div>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="">Select Role</option>
                <option value="Employer">Employer</option>
                <option value="Job Seeker">Job Seeker</option>
              </select>
              <FaRegUser />
            </div>
          </div>
          <div className="inputTag">
            <label>Full Name</label>
            <div>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
              <FaPencilAlt />
            </div>
          </div>
          <div className="inputTag">
            <label>Email Address</label>
            <div>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
              <MdOutlineMailOutline />
            </div>
          </div>
          <div className="inputTag">
            <label>Phone Number</label>
            <div>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9876543210" />
              <FaPhoneFlip />
            </div>
          </div>
          <div className="inputTag">
            <label>Password</label>
            <div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
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
          <button type="submit" onClick={handleRegister} disabled={loading}>
            {loading ? "Creating account..." : "Create Account →"}
          </button>
          <Link to="/login">Already have an account? Login</Link>
        </form>
      </div>
      <div className="banner">
        <div className="auth-illustration">
          <div className="illus-circle big"></div>
          <div className="illus-circle med"></div>
          <div className="illus-circle small"></div>
          <div className="illus-card">
            <div className="illus-text">
              <p>Join 2,34,200+</p>
              <span>Job Seekers Today</span>
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

export default Register;