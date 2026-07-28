import React, { useContext, useEffect } from "react";
import "./App.css";
import { Context } from "./main";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Home from "./components/Home/Home";
import Jobs from "./components/Job/Jobs";
import JobDetails from "./components/Job/JobDetails";
import Application from "./components/Application/Application";
import MyApplications from "./components/Application/MyApplications";
import PostJob from "./components/Job/PostJob";
import NotFound from "./components/NotFound/NotFound";
import MyJobs from "./components/Job/MyJobs";
import AdminDashboard from "./components/Admin/AdminDashboard";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import { API_BASE_URL } from "./utils/apiBaseUrl";
const App = () => {
  const { setIsAuthorized, setUser } = useContext(Context);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/user/getuser`,
          { withCredentials: true }
        );
        setUser(response.data.user);
        setIsAuthorized(true);
      } catch {
        // A 401 here just means "not logged in yet" — expected, not a real error.
        // Silently mark as logged out without surfacing anything.
        setIsAuthorized(false);
        setUser({});
      }
    };
    fetchUser();
    // Run ONCE on mount only. Removing the [isAuthorized] dependency stops the
    // check from re-firing (and re-triggering the harmless 401) on every change.
  }, []);
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/password/reset/:token" element={<ResetPassword />} />
          <Route path="/" element={<Home />} />
          <Route path="/job/getall" element={<Jobs />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/application/:id" element={<Application />} />
          <Route path="/applications/me" element={<MyApplications />} />
          <Route path="/job/post" element={<PostJob />} />
          <Route path="/job/me" element={<MyJobs />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </>
  );
};
export default App;