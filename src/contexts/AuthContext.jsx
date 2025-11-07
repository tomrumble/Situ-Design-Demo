import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetchedUserRef = useRef(false);

  // Load tokens from localStorage on mount
  useEffect(() => {
    const storedTokens = localStorage.getItem('auth_tokens');
    if (storedTokens) {
      try {
        setTokens(JSON.parse(storedTokens));
      } catch (e) {
        localStorage.removeItem('auth_tokens');
      }
    }
    // Rehydrate user from localStorage (helps avoid flicker/redirect on refresh)
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('auth_user');
      }
    }
    // Keep loading=true until we fetch user (or determine there are no tokens)
  }, []);

  // Fetch user data when tokens are available (on page refresh/load)
  useEffect(() => {
    // Reset ref when tokens change (so we can refetch if tokens are updated)
    const currentToken = tokens?.accessToken;
    const tokenChanged = currentToken !== hasFetchedUserRef.current?.lastToken;
    
    if (tokenChanged || !hasFetchedUserRef.current) {
      hasFetchedUserRef.current = { fetched: false, lastToken: currentToken };
    }

    const fetchUser = async () => {
      // Avoid refetching if we already fetched for this token
      if (tokens?.accessToken && hasFetchedUserRef.current?.fetched && hasFetchedUserRef.current?.lastToken === tokens.accessToken) {
        return;
      }

      // Check localStorage first - if we have a user stored, use it immediately while fetching fresh data
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser && !user) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch {}
      }

      // Only make API call if we have tokens OR if we have a stored user (to refresh)
      if (!tokens?.accessToken && !storedUser) {
        // No tokens and no stored user - not authenticated
        setUser(null);
        hasFetchedUserRef.current = { fetched: true, lastToken: null };
        setLoading(false);
        return;
      }

      // If we have stored user but no tokens, just use stored user (skip API call to avoid 401s)
      if (storedUser && !tokens?.accessToken) {
        // User is authenticated via cookie session, stored user is sufficient
        hasFetchedUserRef.current = { fetched: true, lastToken: null };
        setLoading(false);
        return;
      }

      try {
        setError(null);
        let response;
        let usedBearerToken = false;

        // Strategy: Try bearer token first if available, then cookie-only
        if (tokens?.accessToken) {
          try {
            response = await fetch(`${API_BASE_URL}/api/auth/me`, {
              credentials: 'include',
              headers: {
                'Authorization': `Bearer ${tokens.accessToken}`,
              },
            });
            usedBearerToken = true;
            
            // If bearer token works, we're done
            if (response.ok) {
              const userData = await response.json();
              // Preserve locally overridden plan if it was recently changed (within last 5 minutes)
              let storedPlan;
              let planOverrideTimestamp;
              try { 
                const stored = JSON.parse(localStorage.getItem('auth_user'));
                storedPlan = stored?.plan;
                planOverrideTimestamp = parseInt(localStorage.getItem('plan_override_timestamp') || '0');
              } catch {}
              
              const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
              const shouldUseStoredPlan = storedPlan && planOverrideTimestamp > fiveMinutesAgo;
              
              const finalUser = shouldUseStoredPlan ? { ...userData, plan: storedPlan } : userData;
              console.log('[fetchUser] Using plan:', finalUser.plan, shouldUseStoredPlan ? '(from localStorage)' : '(from server)');
              setUser(finalUser);
              try { localStorage.setItem('auth_user', JSON.stringify(finalUser)); } catch {}
              hasFetchedUserRef.current = { fetched: true, lastToken: tokens.accessToken };
              setLoading(false);
              return;
            }

            // 401 with bearer token - try refresh if available
            if (response.status === 401 && tokens.refreshToken) {
              try {
                const refreshResponse = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ refresh_token: tokens.refreshToken }),
                });

                if (refreshResponse.ok) {
                  const refreshData = await refreshResponse.json();
                  const newTokens = {
                    ...tokens,
                    accessToken: refreshData.access_token,
                    expiresIn: refreshData.expires_in,
                  };
                  setTokens(newTokens);
                  localStorage.setItem('auth_tokens', JSON.stringify(newTokens));

                  // Retry with new token
                  response = await fetch(`${API_BASE_URL}/api/auth/me`, {
                    credentials: 'include',
                    headers: {
                      'Authorization': `Bearer ${refreshData.access_token}`,
                    },
                  });
                  
                  if (response.ok) {
                    const userData = await response.json();
                    // Preserve locally overridden plan if it was recently changed (within last 5 minutes)
                    let storedPlan;
                    let planOverrideTimestamp;
                    try { 
                      const stored = JSON.parse(localStorage.getItem('auth_user'));
                      storedPlan = stored?.plan;
                      planOverrideTimestamp = parseInt(localStorage.getItem('plan_override_timestamp') || '0');
                    } catch {}
                    
                    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
                    const shouldUseStoredPlan = storedPlan && planOverrideTimestamp > fiveMinutesAgo;
                    
                    const finalUser = shouldUseStoredPlan ? { ...userData, plan: storedPlan } : userData;
                    console.log('[fetchUser] Using plan:', finalUser.plan, shouldUseStoredPlan ? '(from localStorage)' : '(from server)');
                    setUser(finalUser);
                    try { localStorage.setItem('auth_user', JSON.stringify(finalUser)); } catch {}
                    hasFetchedUserRef.current = { fetched: true, lastToken: refreshData.access_token };
                    setLoading(false);
                    return;
                  }
                }
              } catch (refreshErr) {
                // Refresh failed, continue to fallback
              }
            }
          } catch (bearerErr) {
            // Bearer token request failed, try cookie-only
          }
        }

        // Fallback: Try cookie-only (for Google sessions) - if no tokens or bearer token failed
        if (!tokens?.accessToken || (!response || !response.ok)) {
          // Only try cookie if we haven't already tried it or if bearer failed
          if (!tokens?.accessToken || (usedBearerToken && (!response || !response.ok))) {
            try {
              const cookieResponse = await fetch(`${API_BASE_URL}/api/auth/me`, {
                credentials: 'include',
              });

              if (cookieResponse.ok) {
                const userData = await cookieResponse.json();
                // Preserve locally overridden plan if it was recently changed (within last 5 minutes)
                let storedPlan;
                let planOverrideTimestamp;
                try { 
                  const stored = JSON.parse(localStorage.getItem('auth_user'));
                  storedPlan = stored?.plan;
                  planOverrideTimestamp = parseInt(localStorage.getItem('plan_override_timestamp') || '0');
                } catch {}
                
                const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
                const shouldUseStoredPlan = storedPlan && planOverrideTimestamp > fiveMinutesAgo;
                
                const finalUser = shouldUseStoredPlan ? { ...userData, plan: storedPlan } : userData;
                console.log('[fetchUser] Using plan:', finalUser.plan, shouldUseStoredPlan ? '(from localStorage)' : '(from server)');
                setUser(finalUser);
                try { localStorage.setItem('auth_user', JSON.stringify(finalUser)); } catch {}
                hasFetchedUserRef.current = { fetched: true, lastToken: tokens?.accessToken || null };
                setLoading(false);
                return;
              }
            } catch (cookieErr) {
              // Cookie request also failed - silently continue
            }
          }
        }

        // All attempts failed - check if we have stored user
        if (storedUser) {
          // Keep stored user to maintain session
          hasFetchedUserRef.current = { fetched: true, lastToken: tokens?.accessToken || null };
          setLoading(false);
          return;
        }

        // No stored user and all requests failed - clear auth
        setUser(null);
        setTokens(null);
        localStorage.removeItem('auth_tokens');
        localStorage.removeItem('auth_user');
        hasFetchedUserRef.current = { fetched: true, lastToken: null };
        setLoading(false);

      } catch (err) {
        // Network or other errors - preserve stored user if available
        const existingUser = localStorage.getItem('auth_user');
        if (existingUser) {
          hasFetchedUserRef.current = { fetched: true, lastToken: tokens?.accessToken || null };
        } else {
          setUser(null);
          hasFetchedUserRef.current = { fetched: true, lastToken: tokens?.accessToken || null };
        }
        setLoading(false);
      }
    };

    // Always try to fetch once (supports cookie-only sessions)
    if (!hasFetchedUserRef.current?.fetched) {
      fetchUser();
    }
  }, [tokens]);

  const register = useCallback(async (email, password, fullName) => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Registration failed');
      }

      const data = await response.json();
      setTokens({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
      });
      setUser(data.user);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      localStorage.setItem('auth_tokens', JSON.stringify({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
      }));
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Login failed');
      }

      const data = await response.json();
      setTokens({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
      });
      setUser(data.user);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      localStorage.setItem('auth_tokens', JSON.stringify({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
      }));
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    if (tokens?.accessToken) {
      try {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${tokens.accessToken}`,
          },
        });
      } catch (err) {
        console.error('Logout error:', err);
      }
    } else {
      // Try cookie-based logout as well
      try {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          credentials: 'include',
        });
      } catch (err) {
        // ignore
      }
    }
    setUser(null);
    setTokens(null);
    localStorage.removeItem('auth_tokens');
    localStorage.removeItem('auth_user');
  }, [tokens]);

  const refreshAccessToken = useCallback(async () => {
    if (!tokens?.refreshToken) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: tokens.refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      const newTokens = {
        ...tokens,
        accessToken: data.access_token,
        expiresIn: data.expires_in,
      };
      setTokens(newTokens);
      localStorage.setItem('auth_tokens', JSON.stringify(newTokens));
      return newTokens.accessToken;
    } catch (err) {
      setError(err.message);
      logout();
      return null;
    }
  }, [tokens, logout]);

  const loginWithGoogle = useCallback(async () => {
    try {
      setError(null);
      // Pass current origin so backend knows where to redirect
      const origin = window.location.origin;
      // Redirect to backend Google OAuth endpoint with web flag and origin
      window.location.href = `${API_BASE_URL}/api/auth/google/authorize?web=true&origin=${encodeURIComponent(origin)}`;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const handleGoogleCallback = useCallback(async (hashParams) => {
    try {
      setError(null);
      
      // Extract tokens from URL hash
      const params = new URLSearchParams(hashParams.substring(1));
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');
      const expires_in = parseInt(params.get('expires_in') || '86400');
      const user_id = params.get('user_id');
      const email = params.get('email');

      if (!access_token || !user_id || !email) {
        throw new Error('Invalid authentication response');
      }

      // Get full user info from backend
      const userResponse = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to get user info');
      }

      const userData = await userResponse.json();

      setTokens({
        accessToken: access_token,
        refreshToken: refresh_token || undefined,
        expiresIn: expires_in,
      });
      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      localStorage.setItem('auth_tokens', JSON.stringify({
        accessToken: access_token,
        refreshToken: refresh_token || undefined,
        expiresIn: expires_in,
      }));

      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateProfile = useCallback(async (fullName) => {
    if (!tokens?.accessToken) throw new Error('Not authenticated');
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(tokens?.accessToken ? { 'Authorization': `Bearer ${tokens.accessToken}` } : {}),
        },
        body: JSON.stringify({ full_name: fullName }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Update failed');
      }

      const data = await response.json();
      setUser(data);
      localStorage.setItem('auth_user', JSON.stringify(data));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [tokens]);

  const updatePlan = useCallback(async (plan) => {
    console.log('[updatePlan] Setting plan to:', plan);
    
    // Update locally immediately for testing (optimistic update)
    setUser((currentUser) => {
      if (currentUser) {
        const next = { ...currentUser, plan };
        localStorage.setItem('auth_user', JSON.stringify(next));
        // Store timestamp for plan change
        localStorage.setItem('plan_override_timestamp', Date.now().toString());
        console.log('[updatePlan] Optimistic update - plan set to:', next.plan);
        return next;
      }
      return currentUser;
    });
    
    try {
      setError(null);
      const requestBody = { plan };
      console.log('[updatePlan] Sending PUT request to update plan:', plan);
      console.log('[updatePlan] Request body:', JSON.stringify(requestBody));
      console.log('[updatePlan] Request URL:', `${API_BASE_URL}/api/auth/me`);
      console.log('[updatePlan] Has access token:', !!tokens?.accessToken);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(tokens?.accessToken ? { 'Authorization': `Bearer ${tokens.accessToken}` } : {}),
        },
        body: JSON.stringify(requestBody),
      });

      console.log('[updatePlan] Response status:', response.status, response.ok);
      console.log('[updatePlan] Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const data = await response.json();
        console.warn('[updatePlan] API failed but keeping optimistic update:', data);
        // Keep the optimistic update if API fails - don't throw, just return
        // The local state is already updated
        setUser((currentUser) => {
          if (currentUser && currentUser.plan !== plan) {
            const next = { ...currentUser, plan };
            localStorage.setItem('auth_user', JSON.stringify(next));
            localStorage.setItem('plan_override_timestamp', Date.now().toString());
            return next;
          }
          return currentUser;
        });
        return null; // Success locally even if API failed
      }

      const data = await response.json();
      console.log('[updatePlan] API response data:', data);
      // Force local plan (testing) even if API does not persist/echo it
      const finalUser = { ...data, plan };
      setUser(finalUser);
      localStorage.setItem('auth_user', JSON.stringify(finalUser));
      localStorage.setItem('plan_override_timestamp', Date.now().toString());
      console.log('[updatePlan] Final user plan:', finalUser.plan);
      return finalUser;
    } catch (err) {
      console.error('[updatePlan] Error:', err);
      // If API fails, ensure local update is preserved
      setUser((currentUser) => {
        if (currentUser && currentUser.plan !== plan) {
          const next = { ...currentUser, plan };
          localStorage.setItem('auth_user', JSON.stringify(next));
          localStorage.setItem('plan_override_timestamp', Date.now().toString());
          return next;
        }
        return currentUser;
      });
      // Don't throw error - we updated locally for testing
      return null;
    }
  }, [tokens]);

  const value = {
    user,
    tokens,
    loading,
    error,
    register,
    login,
    loginWithGoogle,
    handleGoogleCallback,
    logout,
    refreshAccessToken,
    updateProfile,
    updatePlan,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
