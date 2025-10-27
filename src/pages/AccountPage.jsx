import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/AuthPages.css';

const PLAN_COLORS = {
  beta: '#10B981',
  active: '#8B5CF6',
  inactive: '#6B7280',
};

const PLAN_FEATURES = {
  beta: ['Unlimited projects', 'Real-time editing', 'Priority support', 'Beta features'],
  active: ['Unlimited projects', 'Real-time editing', 'Priority support', 'Team collaboration'],
  inactive: ['No access - subscription required'],
};

export const AccountPage = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Don't render anything if user is not authenticated
  if (!user) {
    return null;
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await updateProfile(fullName);
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const planColor = PLAN_COLORS[user.plan] || '#6B7280';
  const planFeatures = PLAN_FEATURES[user.plan] || [];

  return (
    <div className="account-page-content">
      <div className="account-header">
        <h1>My Account</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {error && <div className="auth-error">{error}</div>}
      {success && <div className="auth-success">{success}</div>}

      {/* Profile Section */}
      <div className="account-card">
        <h2>Profile Information</h2>
        {isEditing ? (
          <form onSubmit={handleUpdateProfile} className="edit-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={user.email}
                disabled
              />
              <small>Email cannot be changed</small>
            </div>
            <div className="form-actions">
              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  setIsEditing(false);
                  setFullName(user.full_name || '');
                }}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <div className="info-item">
              <label>Full Name</label>
              <p>{user.full_name || 'Not set'}</p>
            </div>
            <div className="info-item">
              <label>Email</label>
              <p>{user.email}</p>
            </div>
            <div className="info-item">
              <label>Member Since</label>
              <p>
                {new Date(user.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <button
              className="edit-button"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>

      {/* Plan Section */}
      <div className="account-card">
        <h2>Your Plan</h2>
        <div className="plan-display" style={{ borderColor: planColor }}>
          <div className="plan-badge" style={{ backgroundColor: planColor }}>
            {user.plan?.toUpperCase()}
          </div>
          <div className="plan-status">
            <p className="status-text">
              {user.subscription_status === 'active' ? '✓ Active' : 'Inactive'}
            </p>
          </div>
          <div className="plan-features">
            <h3>Included Features:</h3>
            <ul>
              {planFeatures.map((feature, idx) => (
                <li key={idx}>✓ {feature}</li>
              ))}
            </ul>
          </div>
          {user.plan === 'beta' && (
            <button className="upgrade-button">
              Subscribe When Beta Ends
            </button>
          )}
          {user.plan === 'inactive' && (
            <button className="upgrade-button">
              Subscribe Now
            </button>
          )}
        </div>
      </div>

      {/* Account Settings */}
      <div className="account-card">
        <h2>Account Settings</h2>
        <div className="settings-group">
          <button className="settings-button">
            Change Password
          </button>
          <button className="settings-button danger">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};
