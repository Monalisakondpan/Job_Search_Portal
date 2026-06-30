# Frontend for Job Seeking Portal

This frontend was developed to provide a user-friendly interface for job seekers and employers. It is part of the **Job Seeking Portal** application, built using the MERN stack (MongoDB, Express.js, React.js, Node.js).

---

## Features Implemented

### 1. **Responsive UI**
- Designed and implemented responsive UI components using **React.js**.
- Ensured compatibility across devices (desktop, tablet, and mobile).

### 2. **Client-Side Routing**
- Used **React Router** for seamless navigation between pages.
- Implemented routes for:
  - Login and Registration
  - Job Listings
  - My Applications (for Job Seekers)
  - Applications Received (for Employers)

### 3. **API Integration**
- Integrated **RESTful API endpoints** to fetch and display data dynamically.
- Examples:
  - Fetch job listings for job seekers.
  - Fetch submitted applications for employers.
  - Submit job applications with file uploads (resumes).

### 4. **State Management**
- Managed global state using **React Context API**.
- Stored user authentication status and role (Job Seeker or Employer).

### 5. **Authentication**
- Implemented login and registration forms with role-based access.
- Used **JWT tokens** for authentication and session management.

### 6. **Dynamic Forms**
- Created dynamic forms for:
  - Job application submission (Job Seekers).
  - Job posting (Employers).

### 7. **Error Handling**
- Displayed error messages using **react-hot-toast** for better user feedback.
- Handled API errors gracefully with fallback messages.

---

## Technologies Used

- **React.js**: For building the user interface.
- **React Router**: For client-side routing.
- **Axios**: For making API requests.
- **react-hot-toast**: For displaying notifications.
- **CSS**: For styling and responsiveness.
