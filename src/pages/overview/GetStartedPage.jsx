import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import TipSection from '../../components/TipSection';
import BetaSection from '../../components/BetaSection';
import WarningSection from '../../components/WarningSection';
import JsonCard from '../../components/JsonCard';
import '../../styles/AuthPages.css';
import vsCodeIcon from '../../assets/vs-code.svg';
import cursorLogo from '../../assets/cursor-logo.svg';

const mcpConfig = {
  mcpServers: {
    Situ: {
      url: "http://127.0.0.1:7124/mcp"
    }
  }
};

export const GetStartedPage = () => {
  const navigate = useNavigate();
  const { register, loginWithGoogle, error: authError } = useAuth();
  const [useEmail, setUseEmail] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check for error in URL params (from OAuth callback)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get('error');
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, []);

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      await register(email, password, fullName);
      navigate('/account');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-section">
      

      <BetaSection title="Open Beta">
      Situ is currently in open beta, you can sign up for free and start using Situ. We're actively working on improvements and stability and would love to hear your feedback. We don't recommend using the beta for any mission-critical projects. 
      </BetaSection>

      <div className="content-header">
        <h1>Get Started</h1>
        <p>Situ brings design editing and inspection directly into your development workflow. Edit styles, layout, spacing and more with instant visual feedback that persists through reloads—all without leaving Cursor/VS Code.</p>
      </div>

      <div 
            className="fills-header-image"
            style={{
              backgroundImage: 'url(/inspector/assets/images/sidebar.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              height: '220px' ,
              width: '100%',
              borderRadius: '12px',
              backgroundColor: '#181818',
              border: '1px solid #1E1F21',
            }}
          />

      <WarningSection title="Requirements">
      Situ is currently compatible with React 18+ projects using Vite 5.0+. It will NOT work as intended with any other frameworks/languages. We intend to support more frameworks in the future.
      </WarningSection>

      {/* Step 1: Install Extension */}
      <div className="content-header">
        <h3>1. Install the Extension</h3>
        <p>Install the Situ Design extension from the VS Code marketplace:</p>
        <div className="flex-list">
          <div className="flex-list-item">Open Cursor/VS Code</div>
          <div className="flex-list-item">Press <kbd>Cmd+Shift+X</kbd> (Mac) or <kbd>Ctrl+Shift+X</kbd> (Windows/Linux) to open Extensions</div>
          <div className="flex-list-item">Search for "Situ" or "Situ Design Inspector"</div>
          <div className="flex-list-item">Click Install</div>
        </div>
      </div>

      {!useEmail && (
        <div className="auth-card" style={{ marginTop: '0px', maxWidth: '420px' }}>

          <>
            <button
              type="button"
              className="google-auth-button"
              onClick={() => window.open('https://open-vsx.org/extension/SituDesign/situ-design', '_blank', 'noopener,noreferrer')}
              disabled={loading}
            >
              <img src={cursorLogo} alt="Cursor" className="google-icon" width="20" height="20" />
              Cursor Marketplace (Open VSX)
            </button>
            <button
              type="button"
              className="google-auth-button"
              onClick={() => window.open('https://marketplace.visualstudio.com/items?itemName=SituDesign.situ-design', '_blank', 'noopener,noreferrer')}
              disabled={loading}
            >
              <img src={vsCodeIcon} alt="VS Code" className="google-icon" width="18" height="18" />
              VS Code Marketplace
            </button>
          </>
        </div>
      )}

      {/* Step 2: Sign Up or Login */}
      <div className="content-header">
        <h3>2. Activate the Extension</h3>
        <p>Activate the extension by logging in to your free Situ account via Cursor:</p>
        <div className="flex-list">
          <div className="flex-list-item">After install, you'll receive login notification in the bottom left of Cursor</div>
          <div className="flex-list-item">You can also use <kbd>Cmd+Shift+P</kbd> (Mac) or <kbd>Ctrl+Shift+P</kbd> (Windows/Linux) to open the command palette and run <kbd>Situ Design: Login</kbd></div>
          <div className="flex-list-item">If you don't have an account, you can create one here.</div>
          <div className="flex-list-item">Enter your email and password to complete login</div>
        </div>
      </div>

      <div className="auth-card" style={{ marginTop: '0px', maxWidth: '420px' }}>


        {(error || authError) && (
          <div className="auth-error">
            {error || authError}
          </div>
        )}

        {!useEmail ? (
          <>
            <button
              type="button"
              className="google-auth-button"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <button
              type="button"
              className="email-auth-button"
              onClick={() => setUseEmail(true)}
              disabled={loading}
            >
              Use email & password
            </button>
          </>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                <small>At least 8 characters</small>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="google-auth-button"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <button
              type="button"
              className="google-auth-button"
              onClick={() => setUseEmail(false)}
              disabled={loading}
            >
              Use Google instead
            </button>
          </>
        )}

        {useEmail && (
          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login">Login</Link>
            </p>
          </div>
        )}
      </div>


      {/* Step 3: Run Setup */}
      <div className="content-header">
        <h3>3. Run Setup Command</h3>
        <p>Run the setup command to auto-configure your project to work with Situ:</p>
        <div className="flex-list">
          <div className="flex-list-item">Press <kbd>Cmd+Shift+P</kbd> (Mac) or <kbd>Ctrl+Shift+P</kbd> (Windows/Linux) to open the command palette</div>
          <div className="flex-list-item">Type and run <kbd>Situ Design: Setup</kbd></div>
          <div className="flex-list-item">The setup command will configure your Vite config, Babel, and MCP scripts</div>
          <div className="flex-list-item">Follow any prompts that appear during the setup process</div>
        </div>
      </div>

      <TipSection title="Design to MCP">
      Every edit you make is automatically staged to Situ's local MCP server (running privately on your machine). This makes it easy to review, discard or apply your edits using your agent of choice. We've tuned for Cursor Auto and Claude Code, but any IDE-aware agent should work just fine.
      </TipSection>

      {/* Step 4: MCP Setup */}
      <div className="content-header">
        <h3>4. Configure MCP (Cursor)</h3>
        <p>Add Situ to your Cursor MCP config to pass edits to agents locally:</p>
        <div className="flex-list">
          <div className="flex-list-item">Open your MCP configuration file at <code style={{ background: '#141414', padding: '2px 6px', borderRadius: '4px' }}>~/.cursor/mcp.json</code></div>
          <div className="flex-list-item">Add the Situ MCP local server configuration</div>
          <JsonCard 
          title="mcp.json" 
          data={mcpConfig}
          copyText={JSON.stringify(mcpConfig, null, 2)}
        />
          <div className="flex-list-item">Save the file and restart Cursor</div>
          <div className="flex-list-item">The MCP connection will be available in your next session</div>
          <div 
            className="fills-header-image"
            style={{
              backgroundImage: 'url(/inspector/assets/images/mcp-install.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              height: '280px',
              width: '100%',
              borderRadius: '12px',
              border: '0px solid #FFFFFF12',
              backgroundColor: '#181818',
              marginTop: '12px',
            }}
          />
        </div>
      </div>


      {/* Step 5: Start Editing */}
      <div className="content-header">
        <h3>5. That's it!</h3>
        <p>You're all set! Dive in an try inspecting/editing some elements:</p>
        <div className="flex-list">
          <div className="flex-list-item">Start your app via <kbd>npm run dev</kbd></div>
          <div className="flex-list-item">Hold <kbd>Alt</kbd> and <kbd>Click</kbd> any element to select it</div>
          <div className="flex-list-item">Edit properties in the Situ Design sidebar</div>
          <div className="flex-list-item">Changes persist through page reloads</div>
          <div className="flex-list-item">View and manage your edits in the "Edits" tab</div>
          <div className="flex-list-item">Use <kbd>Cmd+Z</kbd> (Mac) or <kbd>Ctrl+Z</kbd> (Windows/Linux) to undo your last change</div>
        </div>
      </div>

      <TipSection title="strictly dev env only">
      Situ is built from the ground up to <b>only</b> exist in your dev environment. No trace of it can exist in your production environment — all core Situ code is self-contained in the extension and stripped from any builds.
      </TipSection>

      <div className="content-header">
        <h2>Need Help?</h2>
        <p>Check out our demo pages and resources in the left navigation for more information. If you're stuck, please reach out to us on Discord.</p>
      </div>
    </div>
  );
};
