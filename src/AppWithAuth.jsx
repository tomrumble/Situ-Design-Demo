import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AccountPage } from './pages/AccountPage';
import App from './App';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '18px',
        color: '#667eea',
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const GoogleCallbackHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { handleGoogleCallback, user, tokens, isAuthenticated } = useAuth();
  const [callbackProcessed, setCallbackProcessed] = useState(false);

  // Process the callback when component mounts or location changes
  useEffect(() => {
    const handleCallback = async () => {
      // Skip if already processed
      if (callbackProcessed) return;
      
      try {
        // Check for error in query params
        const searchParams = new URLSearchParams(location.search);
        const error = searchParams.get('error');
        
        if (error) {
          const message = searchParams.get('message') || 'Authentication failed';
          console.error('Google OAuth error:', error, message);
          navigate('/login?error=' + encodeURIComponent(message), { replace: true });
          return;
        }

        // Check for tokens in hash (web flow only - hash indicates web app, not extension)
        if (location.hash && location.hash.length > 1) {
          await handleGoogleCallback(location.hash);
          setCallbackProcessed(true);
        } else {
          navigate('/login?error=' + encodeURIComponent('No authentication data received'), { replace: true });
        }
      } catch (err) {
        console.error('Google callback error:', err);
        navigate('/login?error=' + encodeURIComponent(err.message || 'Authentication failed'), { replace: true });
      }
    };

    handleCallback();
  }, [location, handleGoogleCallback, navigate, callbackProcessed]);

  // Navigate to account page once authentication is complete
  useEffect(() => {
    if (callbackProcessed && isAuthenticated && user && tokens?.accessToken) {
      navigate('/account', { replace: true });
    }
  }, [callbackProcessed, isAuthenticated, user, tokens, navigate]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      fontSize: '18px',
      color: '#667eea',
    }}>
      Completing authentication...
    </div>
  );
};

export default function AppWithAuth() {
  return (
    <AuthProvider>
      <Router basename="/">
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/google/callback" element={<GoogleCallbackHandler />} />

          {/* Protected Routes */}
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />

          {/* Main App */}
          <Route path="/*" element={<App />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
