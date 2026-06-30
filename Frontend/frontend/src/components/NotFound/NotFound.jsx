import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="notFound page">
      <img src="/notfound.jpg" alt="Not Found" />
      <h3>404 · Page Not Found</h3>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn-primary">← Back to Home</Link>
    </section>
  );
};

export default NotFound;
