# Insurance Guy - Full Stack Insurance Website

A production-ready insurance website built with React, Node.js, Express, and MongoDB.

## Features

- **Product Pages**: Health, Life, Motor (Car, Bike, Commercial) insurance with lead generation forms.
- **Admin Dashboard**: View and manage leads and contact messages.
- **Authentication**: Secure admin login using JWT and HTTP-only cookies.
- **Responsive Design**: Mobile-first UI with Tailwind CSS.

## Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Axios, React Router.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT.

## Prerequisites

- Node.js (v16+)
- MongoDB (Local or Atlas)

## Setup & Installation

1. **Clone the repository** (if applicable)

2. **Install Dependencies**
   ```bash
   npm run install:all
   ```
   Or manually:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Environment Variables**
   
   Create `backend/.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/insurance-guy
   JWT_SECRET=your_super_secret_key_change_this
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```

4. **Run Locally**

   From the root directory:
   ```bash
   npm run dev
   ```
   This will start both backend (port 5000) and frontend (port 5173) concurrently.

## Admin Access

- Register a user manually via Postman/Curl to `/api/auth/register` with `role: "admin"`.
- Or use the seed script (if available) to create an initial admin.
- Login at `/login` to access the dashboard.

## Project Structure

- `/frontend`: React application
- `/backend`: Express API server

## License

ISC
