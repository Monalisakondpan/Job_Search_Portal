# CareerForge

A full-stack job portal built with the MERN stack (MongoDB, Express, React, Node.js) that connects job seekers with employers.

Job seekers create profiles, search jobs, and apply with a resume. Employers post listings and review applicants ranked by an ATS resume score. An admin oversees the platform through a dashboard. The platform sends email notifications for registrations, applications, status updates, and job postings.

**Live demo:** [add your Render/deployed URL here]

## Tech Stack
- **Frontend:** React (Vite), React Router, Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT with httpOnly cookies
- **File storage:** Cloudinary
- **Email:** Nodemailer

## Architecture
```
CAREERFORGE/
├── Backend/        # Express API + MongoDB models, routes, controllers
├── Frontend/       # React (Vite) app
└── .github/        # CI/CD workflows (build + lint on push)
```

## Key Features

**Role-based accounts**
Three account types — Job Seeker, Employer, Admin — each with own permissions and JWT role claim, session stored in httpOnly cookie.

**Job seeker flow**
Create profile → search/filter jobs → apply with resume upload (Cloudinary) → track application status.

**Employer flow**
Post job listings → review applicants ranked by ATS resume score → update application status (triggers email notification).

**Admin dashboard**
Platform oversight — manage users, listings, and monitor activity.

**Notifications**
Automated emails (Nodemailer) for registrations, applications, status changes, and new job postings.

## Security
- JWT auth with httpOnly cookies (mitigates XSS token theft)
- Rate limiting on API routes, configured for trust proxy behind Render's reverse proxy
- Content-Security-Policy headers, including `frame-src` scoped for Cloudinary resume previews
- Input validation client + server side

## Running Locally

**Prerequisites:** Node.js 18+, MongoDB

```bash
# Backend
cd Backend
npm install
cp .env.example .env   # fill in MongoDB URI, JWT secret, Cloudinary keys, etc.
npm run dev

# Frontend
cd Frontend
npm install
npm run dev
```

CI runs build + lint checks automatically on every push via GitHub Actions.

## Known Limitations (by design)
- No real-time chat between employer and applicant.
- ATS scoring is keyword/heuristic-based, not a trained ML model.
- Single currency / region assumptions in job posting fields.

## Why This Project
Built as a portfolio piece demonstrating a production-style job portal: role-based auth, file uploads, transactional email, resume-ranking logic, and CI checks — not just a CRUD tutorial clone.

## License
Copyright © CareerForge. All rights reserved.
This project is provided for viewing only. No permission is granted to copy, modify, distribute, or use this code, in whole or in part, without the express written consent of the author.
