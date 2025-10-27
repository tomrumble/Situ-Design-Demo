import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import vsCodeIcon from '../assets/cursor-logo.svg';

const AuthButtons = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (isAuthenticated) {
    return (
      <div className="auth-buttons">
        <Link to="/account" className="auth-button account-button">
          {user?.full_name || user?.email || 'Account'}
        </Link>
        <button onClick={handleLogout} className="auth-button logout-button">
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="auth-buttons">
      <Link to="/register" className="register-button">
        <img src={vsCodeIcon} alt="VS Code" className="vs-code-icon" />
        <span className="get-extension-text">Install in Cursor</span>
      </Link>
    </div>
  );
};

export default AuthButtons;
