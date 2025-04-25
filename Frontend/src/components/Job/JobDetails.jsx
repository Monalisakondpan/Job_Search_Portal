import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null); // Initialize as null to handle loading state
  const navigateTo = useNavigate();

  const { isAuthorized, user } = useContext(Context);

  useEffect(() => {
    if (!isAuthorized) {
      navigateTo("/login");
      return;
    }

    axios
      .get(`http://localhost:4000/api/v1/job/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setJob(res.data.job);
      })
      .catch(() => {
        console.log(errorMiddleware.response.data.message);
      });
  }, [id, isAuthorized, navigateTo]); // Added dependencies

  if (!job) {
    return <p>Loading...</p>; // Handle loading state
  }

  return (
    <section className="jobDetail page">
      <div className="container">
        <h3>Job Details</h3>
        <div className="banner">
          <p>
            Title: <span>{job.title || "N/A"}</span>
          </p>
          <p>
            Category: <span>{job.category || "N/A"}</span>
          </p>
          <p>
            Country: <span>{job.country || "N/A"}</span>
          </p>
          <p>
            City: <span>{job.city || "N/A"}</span>
          </p>
          <p>
            Location: <span>{job.location || "N/A"}</span>
          </p>
          <p>
            Description: <span>{job.description || "N/A"}</span>
          </p>
          <p>
            Job Posted On: <span>{job.jobPostedOn || "N/A"}</span>
          </p>
          <p>
            Salary:{" "}
            {job.fixedSalary ? (
              <span>{job.fixedSalary}</span>
            ) : (
              <span>
                {job.salaryFrom || "N/A"} - {job.salaryTo || "N/A"}
              </span>
            )}
          </p>
          {user && user.role === "Employer" ? (
            <></>
          ) : (
            <Link to={`/application/${job._id}`}>Apply Now</Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default JobDetails;
