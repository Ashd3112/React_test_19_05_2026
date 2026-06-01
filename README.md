# React + Vite Multi-tier Application

A modern full-stack web application featuring a React front-end powered by Vite and a Node.js Express backend.

## Project Structure

```
├── backend/                  # Express server directory
│   ├── db.js                 # Database configuration/connection
│   ├── server.js             # API entry point & routes
│   ├── users.json            # Local user store / mock DB fallback
│   ├── package.json          # Backend dependencies
│   └── package-lock.json
├── src/                      # Frontend React code
│   ├── components/           # Reusable UI components (Landing, Login, Dashboard, etc.)
│   ├── utils/                # Helper utilities
│   ├── App.jsx               # Main React entry component with Auth routing
│   ├── main.jsx              # React app mount script
│   ├── index.css             # Main styling layer
│   └── dashboard.css         # Styling for the application dashboard
├── package.json              # Frontend & workspace configuration
├── vite.config.js            # Vite configuration
└── index.html                # App entry document
```

## Features

- **Authentication System**: Secure user registration and login with protected route guards.
- **Dynamic Dashboard**: Beautiful and responsive layout.
- **Multi-language Support**: Locale state persisted in local storage.
- **RESTful API**: Custom Express backend handles authentication, user registration, and data storage.
- **Responsive Styling**: Crafted using modular and optimized modern vanilla CSS layout techniques.

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (v18 or higher is recommended).

### Backend Setup

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the backend server:
   ```bash
   npm run start # or node server.js
   ```

The backend server runs by default on `http://localhost:5000` (or as configured in your environment).

### Frontend Setup

1. Navigate back to the root directory:
   ```bash
   cd ..
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`.

### Combined/Quick Start Script

In the root `package.json`, you can run:
- Frontend: `npm run dev`
- Backend: `npm run server`

## Tech Stack

- **Frontend**: React 18, Vite, React Router DOM, Lucide React (Icons).
- **Backend**: Express, CORS, bcrypt (password hashing), dotenv, mssql (SQL Server client).
- **Styling**: Modern CSS variables, flexbox, and CSS grid layout.
