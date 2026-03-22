import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { authService } from './services/api';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import OAuthLogin from './pages/OAuthLogin';
import OAuthCallback from './pages/OAuthCallback';
import Dashboard from './pages/Dashboard';

function PrivateRoute({ children }) {
  const token = useAuthStore((state) => state.token);
  return token ? children : <Navigate to="/oauth-login" />;
}

export default function App() {
  const { setUser, token } = useAuthStore();

  useEffect(() => {
    if (token) {
      authService.getProfile().then((res) => setUser(res.data)).catch(() => {
        localStorage.removeItem('token');
      });
    }
  }, [token]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth-login" element={<OAuthLogin />} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
