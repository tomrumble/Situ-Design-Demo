import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/AuthPages.css';
import '../App.css';
import BetaSection from '../components/BetaSection';
import TipSection from '../components/TipSection';

const PLAN_COLORS = {
  beta: '#059668',
  pro: '#8B5CF6',
  none: '#6B7280',
};

const PLAN_FEATURES = {
  beta: ['Unlimited projects', 'Real-time editing', 'Priority support', 'Beta features'],
  pro: ['Unlimited projects', 'Real-time editing', 'Priority support', 'Team collaboration', 'Advanced features'],
  none: ['No access - subscription required'],
};

// Helper function to format subscription status for display
const formatSubscriptionStatus = (status) => {
  if (!status || status === 'none') {
    return 'No Subscription';
  }
  
  const statusMap = {
    active: '✓ Active',
    canceled: 'Canceled',
    past_due: 'Past Due',
    unpaid: 'Unpaid',
    incomplete: 'Incomplete',
    incomplete_expired: 'Expired',
    trialing: 'Trial',
    paused: 'Paused',
  };
  
  return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
};

// Helper function to determine signup method
const getSignupMethod = (user) => {
  if (!user) return 'Email';
  
  // Check for explicit provider field
  if (user.provider) {
    return user.provider === 'google' ? 'Google' : user.provider;
  }
  if (user.auth_provider) {
    return user.auth_provider === 'google' ? 'Google' : user.auth_provider;
  }
  
  // Check if user has both Google ID and password (email user who linked Google)
  const hasGoogleId = user.google_id || user.google_sub || user.oauth_id;
  const hasPassword = user.has_password === true;
  
  if (hasGoogleId && hasPassword) {
    return 'Email (linked with Google account)';
  }
  
  // Check for Google OAuth identifier (Google-only user)
  if (hasGoogleId) {
    return 'Google';
  }
  
  // Check if password exists (email users have passwords, Google users typically don't)
  if (user.has_password === false) {
    return 'Google';
  }
  if (hasPassword) {
    return 'Email';
  }
  
  // Default to Email if we can't determine
  return 'Email';
};

// Delete Account Dialog Component
const DeleteAccountDialog = ({ open, onClose, onDelete }) => {
  const [deleting, setDeleting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setIsClosing(false);
    }
  }, [open]);

  const handleClose = () => {
    if (isClosing) return; // Prevent multiple close calls
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200); // Match animation duration
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete();
      // Don't close dialog here - onDelete should handle navigation/logout
    } catch (err) {
      // Error handling is done in parent
      setDeleting(false);
    }
  };

  if (!open && !isClosing) return null;

  return (
    <div 
      className={`dialog-overlay ${isClosing ? 'dialog-closing' : ''}`}
      onClick={isClosing ? undefined : handleClose}
    >
      <div 
        className={`dialog-content ${isClosing ? 'dialog-closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="dialog-title">Delete Account</h2>
        <div className="dialog-form">
          <p style={{ marginBottom: '24px', color: '#a3a3a3', lineHeight: '1.5' }}>
            Situ is free in open beta, and we're sad to see you go. If you delete your account, 
            all your data will be permanently removed and cannot be recovered.
          </p>
          <div className="dialog-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={handleClose}
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="settings-button danger"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Dialog Component
const EmailDialog = ({ open, onClose, onSave }) => {
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setEmail('');
      setIsClosing(false);
    }
  }, [open]);

  const handleClose = () => {
    if (isClosing) return; // Prevent multiple close calls
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200); // Match animation duration
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(email);
      setEmail('');
      handleClose();
    } catch (err) {
      // Error handling is done in parent
    } finally {
      setSaving(false);
    }
  };

  if (!open && !isClosing) return null;

  return (
    <div 
      className={`dialog-overlay ${isClosing ? 'dialog-closing' : ''}`}
      onClick={isClosing ? undefined : handleClose}
    >
      <div 
        className={`dialog-content ${isClosing ? 'dialog-closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="dialog-title">Update Email</h2>
        <form onSubmit={handleSubmit} className="dialog-form">
          <div className="form-group">
            <label htmlFor="email">New Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter new email"
              required
              disabled={saving}
              autoFocus
            />
          </div>
          <div className="dialog-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={handleClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cancel-button"
              disabled={saving || !email}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const AccountPage = () => {
  const navigate = useNavigate();
  const { user, loading, logout, updateProfile, updatePlan, loginWithGoogle, tokens } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [planLoading, setPlanLoading] = useState(false);
  const [linkingGoogle, setLinkingGoogle] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Redirect to login if user is not authenticated (wait for loading to finish)
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Sync fullName when user changes
  useEffect(() => {
    if (user?.full_name) {
      setFullName(user.full_name);
    }
  }, [user?.full_name]);

  // Debug: Log when user plan changes
  useEffect(() => {
    console.log('User plan changed:', user?.plan);
  }, [user?.plan]);

  // Don't render anything if user is not authenticated
  if (!user) {
    return null;
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await updateProfile(fullName);
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handlePlanChange = async (e) => {
    const newPlan = e.target.value;
    const currentPlan = user?.plan || 'none';
    if (newPlan === currentPlan) return;
    
    setError('');
    setSuccess('');
    setPlanLoading(true);

    try {
      await updatePlan(newPlan);
      // Plan is updated optimistically in the context
      // The user object should update automatically via context
      setSuccess(`Plan changed to ${newPlan.toUpperCase()} successfully`);
    } catch (err) {
      // Even if there's an error, the plan was updated locally
      setSuccess(`Plan changed to ${newPlan.toUpperCase()} successfully (local update)`);
      console.warn('Plan update error (using local update):', err);
    } finally {
      setPlanLoading(false);
    }
  };

  const handleLinkGoogle = async () => {
    setError('');
    setSuccess('');
    setLinkingGoogle(true);

    try {
      // Use the same Google OAuth flow - backend should handle account linking
      // if user is already authenticated
      await loginWithGoogle();
    } catch (err) {
      setError(err.message || 'Failed to link Google account');
      setLinkingGoogle(false);
    }
  };

  const handleUpdateEmail = async (newEmail) => {
    if (!tokens?.accessToken) throw new Error('Not authenticated');
    
    setError('');
    setSuccess('');

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(tokens?.accessToken ? { 'Authorization': `Bearer ${tokens.accessToken}` } : {}),
        },
        body: JSON.stringify({ email: newEmail }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to update email');
      }

      const data = await response.json();
      // Update user in localStorage - context should pick it up on next render
      if (data.email || data.id) {
        localStorage.setItem('auth_user', JSON.stringify(data));
        // Trigger a page reload to refresh user context
        window.location.reload();
      }
      setSuccess('Email updated successfully');
    } catch (err) {
      setError(err.message || 'Failed to update email');
      throw err;
    }
  };

  const handleDeleteAccount = async () => {
    setError('');
    setSuccess('');

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_BASE_URL}/api/users/account`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          ...(tokens?.accessToken ? { 'Authorization': `Bearer ${tokens.accessToken}` } : {}),
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to delete account');
      }

      // Account deleted successfully - logout and redirect
      await logout();
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Failed to delete account');
      throw err;
    }
  };

  const signupMethod = getSignupMethod(user);
  const isEmailSignup = signupMethod === 'Email' || signupMethod.startsWith('Email');
  const hasGoogleLinked = !!(user.google_id || user.google_sub || user.oauth_id);

  const planColor = PLAN_COLORS[user.plan] || '#059668';
  const planFeatures = PLAN_FEATURES[user.plan] || [];

  return (
    <div className="account-page-content">
      <div className="account-header">
        <h1>Hey, {user.full_name.split(' ')[0] || 'Not set'}</h1>
        <button className="edit-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {error && <div className="auth-error">{error}</div>}
      {success && <div className="auth-success">{success}</div>}

      <TipSection title="Welcome to the open beta">
      Thanks for joining the open beta! We're actively working on improvements and stability and would love to hear your feedback. We don't recommend using the beta for any mission-critical projects for now. If you haven't already, please install the extension and start using Situ.
      </TipSection>

      <div className="beta-section">
      <div className="beta-section-content">
        <h4>No plan required - {user.plan?.toUpperCase()}</h4>
      </div>
      </div>

      {/* Plan Switcher Section - For Testing */}
      {/* <div className="account-card">
        <h2>Plan Switcher (Testing)</h2>
        <div className="plan-switcher">
          <label htmlFor="plan-select">Current Plan: {user?.plan?.toUpperCase() || 'NONE'}</label>
          <select
            id="plan-select"
            key={user?.plan || 'none'}
            value={user?.plan || 'none'}
            onChange={handlePlanChange}
            disabled={planLoading}
            className="plan-select"
          >
            <option value="none">None</option>
            <option value="beta">Beta</option>
            <option value="pro">Pro</option>
          </select>
          {planLoading && <span className="plan-loading">Updating...</span>}
        </div>
      </div> */}

      {/* Profile Section */}
      <div className="account-card">
        <div className="profile-info">
          <div className="profile-info">
            <div className="info-item">
              <label>Name</label>
              <p>{user.full_name || 'Not set'}</p>
            </div>
            <div className="info-item">
              <label>Signed up with</label>
              <p>{signupMethod}</p>
            </div>
            <div className="info-item">
              <label>Email</label>
              <p>{user.email}</p>
            </div>
            <div className="info-item">
              <label>Joined open beta</label>
              <p>
                {new Date(user.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button
                className="edit-button"
                onClick={() => setEmailDialogOpen(true)}
                disabled={hasGoogleLinked}
                title={hasGoogleLinked ? "Email update not available for Google-linked accounts" : ""}
              >
                Update Email
              </button>
              {isEmailSignup && (
                <button
                  className="link-google-button"
                  onClick={handleLinkGoogle}
                  disabled={linkingGoogle || hasGoogleLinked}
                >
                  {hasGoogleLinked ? 'Google Account Linked' : (linkingGoogle ? 'Linking...' : 'Link Google Account')}
                </button>
              )}
              <button 
                className="settings-button"
                disabled={hasGoogleLinked}
                title={hasGoogleLinked ? "Password change not available for Google-linked accounts" : ""}
              >
            Change Password
          </button>
          <button 
            className="settings-button danger"
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete Account
          </button>
            </div>
          </div>
        </div>
      </div>

      <EmailDialog
        open={emailDialogOpen}
        onClose={() => setEmailDialogOpen(false)}
        onSave={handleUpdateEmail}
      />

      <DeleteAccountDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={handleDeleteAccount}
      />
    </div>
  );
};
