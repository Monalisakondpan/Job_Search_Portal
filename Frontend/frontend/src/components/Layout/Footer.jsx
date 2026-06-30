import React, { useContext } from "react";
import { Context } from "../../main";
import { Link } from "react-router-dom";
import { FaFacebookF, FaYoutube, FaLinkedin } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";

const Footer = () => {
  const { isAuthorized } = useContext(Context);
  return (
    <footer className={isAuthorized ? "footerShow" : "footerHide"}>
      <div>© {new Date().getFullYear()} CareerForge · All Rights Reserved</div>
      <div>
        <Link to="/" target="_blank" rel="noreferrer"><FaFacebookF /></Link>
        <Link to="/" target="_blank" rel="noreferrer"><FaYoutube /></Link>
        <Link to="/" target="_blank" rel="noreferrer"><FaLinkedin /></Link>
        <Link to="/" target="_blank" rel="noreferrer"><RiInstagramFill /></Link>
      </div>
    </footer>
  );
};

export default Footer;
