import React from 'react';
import TipSection from '../../components/TipSection';
import BetaSection from '../../components/BetaSection';
import WarningSection from '../../components/WarningSection';
import JsonCard from '../../components/JsonCard';

const mcpConfig = {
  mcpServers: {
    Situ: {
      url: "http://127.0.0.1:7124/mcp"
    }
  }
};

export const GetStartedPage = () => {
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
              backgroundSize: '105%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              height: '300px',
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

      <TipSection title="strictly dev env only">
      Situ is built from the ground up to <b>only</b> exist in your dev environment. No trace of it can exist in your production environment — all core Situ code is self-contained in the extension and stripped from any builds.
      </TipSection>

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
