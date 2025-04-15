# Job Seeking Portal - Backend

This document provides a comprehensive guide to the backend implementation of the Job Seeking Portal project. It includes setup instructions, features, and details about API testing using Postman.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technologies Used](#technologies-used)
3. [Setup Instructions](#setup-instructions)
4. [Features Implemented](#features-implemented)
5. [API Endpoints](#api-endpoints)
6. [Postman Testing Guide](#postman-testing-guide)

---

## Project Overview
The backend of the Job Seeking Portal is designed to handle user authentication, job postings, applications, and more. It provides RESTful APIs for interaction with the frontend.

---

## Technologies Used
- **Programming Language**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **API Testing**: Postman

---

## Setup Instructions
1. Clone the repository:
    ```bash
    git clone https://github.com/your-repo/job-seeking-portal-backend.git
    cd job-seeking-portal-backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
    - Create a `.env` file in the root directory.
    - Add the following variables:
      ```
      PORT=5000
      MONGO_URI=your_mongodb_connection_string
      JWT_SECRET=your_jwt_secret
      ```

4. Start the server:
    ```bash
    npm start
    ```

5. Access the API at `http://localhost:4000`.

---

## Features Implemented
1. **User Authentication**:
    - User registration and login with JWT-based authentication.
    - Password hashing using bcrypt.

2. **Job Management**:
    - CRUD operations for job postings.
    - Search and filter jobs by criteria.

3. **Application Management**:
    - Users can apply for jobs.
    - Employers can view applications.

4. **Error Handling**:
    - Centralized error handling for API responses.

---

## API Endpoints
### Authentication
- **POST** `/api/auth/register` - Register a new user.
- **POST** `/api/auth/login` - Login and receive a JWT.

### Jobs
- **GET** `/api/jobs` - Get all job postings.
- **POST** `/api/jobs` - Create a new job posting.
- **PUT** `/api/jobs/:id` - Update a job posting.
- **DELETE** `/api/jobs/:id` - Delete a job posting.

### Applications
- **POST** `/api/applications` - Apply for a job.
- **GET** `/api/applications/:jobId` - Get applications for a specific job.

---

## Postman Testing Guide
1. **Import Collection**:
    - Export the Postman collection from the repository (if available) or create a new collection.

2. **Set Environment**:
    - Add environment variables in Postman for `BASE_URL`, `JWT_TOKEN`, etc.

3. **Test Authentication**:
    - Register a new user using the `/api/auth/register` endpoint.
    - Login with the same credentials and save the JWT token.

4. **Test Job Endpoints**:
    - Use the JWT token in the `Authorization` header.
    - Test creating, updating, and deleting job postings.

5. **Test Applications**:
    - Apply for a job using the `/api/applications` endpoint.
    - Retrieve applications for a specific job.

---

## Notes
- Ensure MongoDB is running locally or use a cloud database service.
- Use tools like Postman or Insomnia for API testing.
- Follow best practices for securing environment variables and sensitive data.

---