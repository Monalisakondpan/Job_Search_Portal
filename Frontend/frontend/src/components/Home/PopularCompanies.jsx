import React from "react";
import { useNavigate } from "react-router-dom";
import { FaMicrosoft, FaApple } from "react-icons/fa";
import { SiTesla } from "react-icons/si";

const PopularCompanies = () => {
  const navigate = useNavigate();

  const companies = [
    { id: 1, title: "Microsoft", location: "Bangalore, India", openPositions: 10, icon: <FaMicrosoft /> },
    { id: 2, title: "Tesla", location: "Mumbai, India", openPositions: 5, icon: <SiTesla /> },
    { id: 3, title: "Apple", location: "Hyderabad, India", openPositions: 20, icon: <FaApple /> },
  ];

  return (
    <div className="companies">
      <div className="container">
        <span className="section-label">Top Employers</span>
        <h3>Companies Hiring Now</h3>
        <div className="banner">
          {companies.map((el) => (
            <div className="card" key={el.id}>
              <div className="content">
                <div className="icon">{el.icon}</div>
                <div className="text">
                  <p>{el.title}</p>
                  <p>{el.location}</p>
                </div>
              </div>
              <button onClick={() => navigate("/job/getall")}>
                {el.openPositions} Open Roles →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularCompanies;