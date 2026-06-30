import React from "react";
import { FaBuilding, FaSuitcase, FaUsers, FaUserPlus, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
const HeroSection = () => {
  const details = [
    { id: 1, title: "1,23,441", subTitle: "Live Jobs", icon: <FaSuitcase /> },
    { id: 2, title: "91,220", subTitle: "Companies", icon: <FaBuilding /> },
    { id: 3, title: "2,34,200", subTitle: "Job Seekers", icon: <FaUsers /> },
    { id: 4, title: "1,03,761", subTitle: "Employers", icon: <FaUserPlus /> },
  ];
  return (
    <div className="heroSection">
      <div className="container">
        <div className="title">
          <div className="badge">
            <span></span>
            Now Hiring · 1,200+ New Roles This Week
          </div>
          <h1>
            Find a Job That
            <br />
            <span className="gradient-text">Fits Your Life</span>
          </h1>
          <p>
            Connect with top employers across India. Whether you're a fresh grad
            or a seasoned pro — your next opportunity starts here.
          </p>
          <div className="cta-group">
            <Link to="/job/getall" className="btn-primary">
              Browse Jobs <FaArrowRight />
            </Link>
            <Link to="/job/post" className="btn-secondary">
              Post a Job
            </Link>
          </div>
        </div>
        <div className="image">
          <img src="/heroS.jpg" alt="CareerForge Hero" />
        </div>
      </div>
      <div className="details">
        {details.map((el) => (
          <Link to="/job/getall" key={el.id} style={{ textDecoration: "none" }}>
            <div className="card">
              <div className="icon">{el.icon}</div>
              <div className="content">
                <p>{el.title}</p>
                <p>{el.subTitle}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default HeroSection;