import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../main";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { API_BASE_URL } from "../../utils/apiBaseUrl";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthorized, setIsAuthorized, user, setUser } = useContext(Context);
  const navigateTo = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setShow(false); }, [location]);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/user/logout`, { withCredentials: true });
      toast.success(response.data.message);
      setIsAuthorized(false);
      setUser(null);
      navigateTo("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
      setIsAuthorized(true);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Delete your account permanently? This does not delete jobs or applications you've already created — they'll stay in the system without an owner. This cannot be undone."
    );
    if (!confirmed) return;
    try {
      const { data } = await axios.delete(`${API_BASE_URL}/api/v1/user/delete-me`, { withCredentials: true });
      toast.success(data.message);
      setIsAuthorized(false);
      setUser(null);
      navigateTo("/register");
    } catch (error) {
      toast.error(error.response?.data?.message || "Account deletion failed");
    }
  };

  return (
    <nav className={isAuthorized ? "navbarShow" : "navbarHide"}
      style={scrolled ? { boxShadow: "0 4px 30px rgba(0,0,0,0.4)" } : {}}>
      <div className="container">
        <div className="logo">
          <Link to="/" className="logo-text">
            <img src="/mascot-logo.png" alt="CareerForge logo" />
            <span className="logo-job">Career</span><span className="logo-search">Forge</span>
          </Link>
        </div>

        <ul className={show ? "menu show-menu" : "menu"}>
          <li><Link to="/" onClick={() => setShow(false)}>Home</Link></li>
          <li><Link to="/job/getall" onClick={() => setShow(false)}>All Jobs</Link></li>
          {user && user.role !== "Admin" && (
            <li>
              <Link to="/applications/me" onClick={() => setShow(false)}>
                {user.role === "Employer" ? "Applicants" : "My Applications"}
              </Link>
            </li>
          )}
          {user && user.role === "Employer" && (
            <>
              <li><Link to="/job/post" onClick={() => setShow(false)}>Post Job</Link></li>
              <li><Link to="/job/me" onClick={() => setShow(false)}>My Jobs</Link></li>
            </>
          )}
          {user && user.role === "Admin" && (
            <li><Link to="/admin/dashboard" onClick={() => setShow(false)}>Admin Dashboard</Link></li>
          )}
          {user && (
            <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
              <span style={{ color: "var(--text)", fontWeight: 600 }}>{user.name}</span>
              <span style={{
                background: "var(--glass)",
                border: "1px solid var(--border)",
                borderRadius: "999px",
                padding: "0.15rem 0.6rem",
                fontSize: "0.72rem",
                color: "var(--accent)",
              }}>
                {user.role}
              </span>
            </li>
          )}
          <button onClick={handleLogout}>Logout</button>
          {user && (
            <button
              onClick={handleDeleteAccount}
              style={{ background: "transparent", border: "1px solid rgba(193,71,61,0.4)", color: "var(--accent2)" }}
            >
              Delete Account
            </button>
          )}
        </ul>

        <div className="hamburger" onClick={() => setShow(!show)}>
          {show ? <IoClose /> : <GiHamburgerMenu />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;