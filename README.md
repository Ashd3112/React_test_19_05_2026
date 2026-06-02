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
<img width="1870" height="865" alt="image" src="https://github.com/user-attachments/assets/77b9ab14-2123-4585-93ed-f0910863c5e6" />
<img width="1919" height="881" alt="image" src="https://github.com/user-attachments/assets/b9fb0ebd-0811-4fd5-afd2-b58f31e55de7" />
<img width="1852" height="586" alt="image" src="https://github.com/user-attachm<img width="1742" height="762" alt="image" src="https://github.com/user-attachments/assets/df81f572-fe25-4f0a-af34-ea9425fe042d" />
ents/assets/2af98df1-b2aa-4771-9900-1726a4bc25ae" />
<img width="1716" height="875" alt="image" src="https://github.com/user-attachments/assets/2294154f-d88e-4772-966a-491503ae29c7" />
<img width="1793" height="555" alt="image" src="https://github.com/user-attachments/assets/f803e1bb-1efe-49df-bfba-e0bdbd3b0938" />
<img width="1617" height="652" alt="image" src="https://github.com/user-attachments/assets/c4ff0c6f-236c-49ea-bfa1-6ef7e14574ba" />
<img width="1726" height="836" alt="image" src="https://github.com/user-attachments/assets/096a24f3-9a2d-4545-9555-2b7f9c06231a" />
<img width="1914" height="589" alt="image" src="https://github.com/user-attachments/assets/e66c4c75-baa4-4a79-988c-1eac40c333b2" />
