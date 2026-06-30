# CareerForge

A full-stack job portal that connects job seekers with employers. Job seekers can browse and apply to jobs, employers can post openings and review applicants, and an admin oversees the platform. Built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

**Job Seekers**
- Register, log in, and manage a profile
- Browse and search jobs by keyword and category
- Apply to jobs with a resume upload
- Track application status (Under Review, Shortlisted, Selected, and more)
- Receive email confirmations on registration and application updates

**Employers**
- Post, edit, and delete their own job listings
- View applicants for their jobs, ranked by an ATS resume score
- Receive email alerts when someone applies
- Get a confirmation email when a job goes live

**Admin**
- Dashboard with platform stats (users, jobs, applications)
- Manage users and job listings
- Receive email notifications on new registrations, jobs, and applications

## Tech Stack

- **Frontend:** React (Vite), React Router, Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT with httpOnly cookies
- **File storage:** Cloudinary (resume uploads)
- **Email:** Nodemailer

## Getting Started

### Prerequisites
- Node.js (v18 or newer)
- A MongoDB database
- A Cloudinary account
- A Gmail account with an App Password (for email)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd CareerForge
```

### 2. Run the backend
```bash
cd Backend
npm install
```
Add your environment variables in `Backend/config/config.env`, then create the first admin and start the server:
```bash
node seedAdmin.js
npm run dev
```
The backend runs on `http://localhost:4000`.

### 3. Run the frontend
In a new terminal:
```bash
cd Frontend/frontend
npm install
npm run dev
```
The app runs on `http://localhost:5173`.

### 4. Log in as admin
On the login page, choose the **Admin** role and use the admin credentials you configured.

## License

Copyright © CareerForge. All rights reserved.

This project is provided for viewing only. No permission is granted to copy, modify, distribute, or use this code, in whole or in part, without the express written consent of the author.