import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ResumeModal from "./ResumeModal";

const MyApplications = () => {
  const { user, isAuthorized } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");
  const navigateTo = useNavigate();

  // Redirect if not authorized
  useEffect(() => {
    if (!isAuthorized) {
      navigateTo("/");
    }
  }, [isAuthorized, navigateTo]);

  // Fetch applications based on user role
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const endpoint =
          user && user.role === "Employer"
            ? "http://localhost:4000/api/v1/application/employer/getall"
            : "http://localhost:4000/api/v1/application/jobseeker/getall";

        const { data } = await axios.get(endpoint, {
          withCredentials: true,
        });
        console.log("Applications Response:", data.applications); // Debugging
        setApplications(data.applications);
      } catch (error) {
        console.error("Error fetching applications:", error); // Debugging
        toast.error(
          error.response?.data?.message || "Failed to fetch applications."
        );
      }
    };

    if (user) {
      fetchApplications();
    }
  }, [user]);

  // Delete an application
  const deleteApplication = async (id) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:4000/api/v1/application/delete/${id}`,
        {
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setApplications((prevApplications) =>
        prevApplications.filter((application) => application._id !== id)
      );
    } catch (error) {
      console.error("Error deleting application:", error); // Debugging
      toast.error(
        error.response?.data?.message || "Failed to delete application."
      );
    }
  };

  // Open resume modal
  const openModal = (imageUrl) => {
    console.log("Opening modal with image URL:", imageUrl); // Debugging
    setResumeImageUrl(imageUrl);
    setModalOpen(true);
  };

  // Close resume modal
  const closeModal = () => {
    setModalOpen(false);
  };

  if (user === undefined || isAuthorized === undefined) {
    return <p>Loading...</p>;
  }

  return (
    <section className="my_applications page">
      {user && user.role === "Job Seeker" ? (
        <div className="container">
          <h1>My Applications</h1>
          {applications.length > 0 ? (
            applications.map((element) => (
              <JobSeekerCard
                element={element}
                key={element._id}
                deleteApplication={deleteApplication}
                openModal={openModal}
              />
            ))
          ) : (
            <h4>No Applications Found</h4>
          )}
        </div>
      ) : (
        <div className="container">
          <h1>Applications From Job Seekers</h1>
          {applications.length > 0 ? (
            applications.map((element) => (
              <EmployerCard
                element={element}
                key={element._id}
                openModal={openModal}
              />
            ))
          ) : (
            <h4>No Applications Found</h4>
          )}
        </div>
      )}
      {modalOpen && (
        <ResumeModal imageUrl={resumeImageUrl} onClose={closeModal} />
      )}
    </section>
  );
};

export default MyApplications;

// Job Seeker Card Component
const JobSeekerCard = ({ element, deleteApplication, openModal }) => {
  console.log("Rendering JobSeekerCard:", element); // Debugging
  return (
    <div className="job_seeker_card">
      <div className="detail">
        <p>
          <span>Name:</span> {element.name}
        </p>
        <p>
          <span>Email:</span> {element.email}
        </p>
        <p>
          <span>Phone:</span> {element.phone}
        </p>
        <p>
          <span>Address:</span> {element.address}
        </p>
        <p>
          <span>Cover Letter:</span> {element.coverLetter}
        </p>
      </div>
      <div className="resume">
        <img
          src={element.resume?.url || "default-image-url.jpg"}
          alt="resume"
          onClick={() => openModal(element.resume?.url || "")}
        />
      </div>
      <div className="btn_area">
        <button onClick={() => deleteApplication(element._id)}>
          Delete Application
        </button>
      </div>
    </div>
  );
};

// Employer Card Component
const EmployerCard = ({ element, openModal }) => {
  console.log("Rendering EmployerCard:", element); // Debugging
  return (
    <div className="job_seeker_card">
      <div className="detail">
        <p>
          <span>Name:</span> {element.name}
        </p>
        <p>
          <span>Email:</span> {element.email}
        </p>
        <p>
          <span>Phone:</span> {element.phone}
        </p>
        <p>
          <span>Address:</span> {element.address}
        </p>
        <p>
          <span>Cover Letter:</span> {element.coverLetter}
        </p>
      </div>
      <div className="resume">
        <img
          src={element.resume?.url || "default-image-url.jpg"}
          alt="resume"
          onClick={() => openModal(element.resume?.url || "")}
        />
      </div>
    </div>
  );
};