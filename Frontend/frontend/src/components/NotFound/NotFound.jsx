import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="page notfound">
      <div className="content">
        <img src="/notfound.jpg" alt="notfound"></img>
        <Link to={"/"}>RETURN TO HOME</Link>
      </div>
    </section>
  )
}

export default NotFound;
