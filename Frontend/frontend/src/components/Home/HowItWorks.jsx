import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaArrowRight } from "react-icons/fa";
import { MdFindInPage } from "react-icons/md";
import { IoMdSend } from "react-icons/io";

const HowItWorks = () => {
  const navigate = useNavigate();

  const steps = [
    {
      num: "01",
      icon: <FaUserPlus />,
      title: "Create Your Account",
      desc: "Sign up for free in minutes. Choose your role as a Job Seeker or Employer and build your profile.",
      action: () => navigate("/register"),
      btnText: "Register Now",
    },
    {
      num: "02",
      icon: <MdFindInPage />,
      title: "Find or Post a Job",
      desc: "Browse thousands of curated opportunities or post your opening to reach qualified candidates instantly.",
      action: () => navigate("/job/getall"),
      btnText: "Browse Jobs",
    },
    {
      num: "03",
      icon: <IoMdSend />,
      title: "Apply & Get Hired",
      desc: "Submit your application with your resume or recruit the perfect candidate — all from one seamless platform.",
      action: () => navigate("/job/getall"),
      btnText: "Get Started",
    },
  ];

  return (
    <div className="howitworks">
      <div className="container">
        <span className="section-label">How It Works</span>
        <h3>Three Steps to Your Dream Job</h3>
        <div className="banner">
          {steps.map((step) => (
            <div className="card" key={step.num} onClick={step.action} style={{ cursor: "pointer" }}>
              <div className="step-num">{step.num}</div>
              {step.icon}
              <p>{step.title}</p>
              <p>{step.desc}</p>
              <div className="step-btn">
                {step.btnText} <FaArrowRight style={{ fontSize: "0.7rem" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;