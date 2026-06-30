import React, { useContext, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { FaRegUser, FaBriefcase, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { Navigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../../utils/apiBaseUrl";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/v1/user/login`,
        { email, password, role },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      toast.success(data.message);
      setEmail(""); setPassword(""); setRole("");
      setIsAuthorized(true);
      setUser(data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
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
          <h3>Welcome back</h3>
          <p>Sign in to your account to continue</p>
        </div>
        <form>
          <div className="inputTag">
            <label>Login As</label>
            <div>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="">Select Role</option>
                <option value="Employer">Employer</option>
                <option value="Job Seeker">Job Seeker</option>
                <option value="Admin">Admin</option>
              </select>
              <FaRegUser />
            </div>
          </div>
          <div className="inputTag">
            <label>Email Address</label>
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
              <MdOutlineMailOutline />
            </div>
          </div>
          <div className="inputTag">
            <label>Password</label>
            <div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
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
          </div>
          <button onClick={handleLogin} type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login →"}
          </button>
          <Link to="/password/forgot" style={{ fontSize: "0.82rem" }}>Forgot your password?</Link>
          <Link to="/register">Don't have an account? Register Now</Link>
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

export default Login;