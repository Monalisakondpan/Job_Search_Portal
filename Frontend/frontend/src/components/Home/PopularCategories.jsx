import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MdOutlineDesignServices, MdOutlineWebhook, MdAccountBalance, MdOutlineAnimation,
} from "react-icons/md";
import { TbAppsFilled } from "react-icons/tb";
import { FaReact } from "react-icons/fa";
import { GiArtificialIntelligence } from "react-icons/gi";
import { IoGameController } from "react-icons/io5";

const PopularCategories = () => {
  const navigate = useNavigate();

  const categories = [
    { id: 1, title: "Graphics & Design", subTitle: "305 Open Positions", icon: <MdOutlineDesignServices />, value: "Graphics & Design" },
    { id: 2, title: "Mobile App Development", subTitle: "500 Open Positions", icon: <TbAppsFilled />, value: "Mobile App Development" },
    { id: 3, title: "Frontend Web Dev", subTitle: "200 Open Positions", icon: <MdOutlineWebhook />, value: "Frontend Web Development" },
    { id: 4, title: "MERN Stack Dev", subTitle: "1000+ Open Positions", icon: <FaReact />, value: "MERN Stack Development" },
    { id: 5, title: "Account & Finance", subTitle: "150 Open Positions", icon: <MdAccountBalance />, value: "Account & Finance" },
    { id: 6, title: "Artificial Intelligence", subTitle: "867 Open Positions", icon: <GiArtificialIntelligence />, value: "Artificial Intelligence" },
    { id: 7, title: "Video Animation", subTitle: "50 Open Positions", icon: <MdOutlineAnimation />, value: "Video Animation" },
    { id: 8, title: "Game Development", subTitle: "80 Open Positions", icon: <IoGameController />, value: "Game Development" },
  ];

  const handleCategoryClick = (cat) => {
    navigate(`/job/getall?category=${encodeURIComponent(cat.value)}`);
  };

  return (
    <div className="categories">
      <span className="section-label">Browse by Category</span>
      <h3>Popular Categories</h3>
      <div className="banner">
        {categories.map((el) => (
          <div className="card" key={el.id} onClick={() => handleCategoryClick(el)} style={{ cursor: "pointer" }}>
            <div className="icon">{el.icon}</div>
            <div className="text">
              <p>{el.title}</p>
              <p>{el.subTitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularCategories;