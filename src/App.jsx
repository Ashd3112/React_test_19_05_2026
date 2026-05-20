import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Contact from './components/Contact';

// Auth Context — single source of truth for login state across the app
export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

// Protected Route: redirects to /login if not authenticated
function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

// Guest Route: redirects logged-in users away from login/register
function GuestRoute({ children }) {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const isLoggedIn = !!user;

  const [visitCount, setVisitCount] = useState(0);
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('app_language') || 'en';
  });

  const setLanguage = (lang) => {
    localStorage.setItem('app_language', lang);
    setLanguageState(lang);
  };

  useEffect(() => {
    const stored = localStorage.getItem('visit_count');
    let count = 14250;
    if (stored) {
      count = parseInt(stored, 10) + 1;
    }
    localStorage.setItem('visit_count', count.toString());
    setVisitCount(count);
  }, []);

  // Listen for localStorage changes from other tabs or manual updates
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'user') {
        setUser(e.newValue ? JSON.parse(e.newValue) : null);
      } else if (e.key === 'app_language') {
        setLanguageState(e.newValue || 'en');
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Reactive login/logout helpers that update both localStorage AND state
  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout, visitCount, language, setLanguage }}>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route path="/login" element={
            <GuestRoute>
              <div className="bg-shape shape1"></div>
              <div className="bg-shape shape2"></div>
              <Login />
            </GuestRoute>
          } />

          <Route path="/register" element={
            <GuestRoute>
              <div className="bg-shape shape1"></div>
              <div className="bg-shape shape2"></div>
              <Register />
            </GuestRoute>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/contact" element={<Contact />} />

          {/* Catch-all: redirect unknown routes to landing */}
          <Route path="*" element={<Navigate to="/contact" replace />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
