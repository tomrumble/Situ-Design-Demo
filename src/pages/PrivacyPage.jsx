import React from 'react';
import { Link } from 'react-router-dom';

export const PrivacyPage = () => {
  return (
    <div className="content-section">
      <div className="content-header">
        <Link to="/" className="back-link">
          ← Back to Home
        </Link>
        <h1>Privacy Policy</h1>
        <p style={{ color: '#707070', fontSize: '14px', marginTop: '-16px' }}>
          <strong>Last Updated:</strong> November 2025
        </p>
      </div>

      <div className="content-header">
        <h2>Introduction</h2>
        <p>
          Situ Design Pty Ltd ("Situ Design," "we," "our," or "us") is committed to protecting your privacy.
        </p>
        <p>
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use the Situ Design VS Code Extension ("Extension") and related services.
        </p>
      </div>

      <div className="content-header">
        <h2>Information We Collect</h2>
        
        <h3>Account Information</h3>
        <ul style={{ color: '#a3a3a3', paddingLeft: '24px', lineHeight: '1.7' }}>
          <li><strong>Email Address</strong> – collected via Google OAuth</li>
          <li><strong>User ID</strong> – unique identifier assigned to your account</li>
          <li><strong>Name</strong> – if provided during authentication</li>
          <li><strong>Subscription Plan & Status</strong> – beta, pro, or none</li>
        </ul>

        <h3 style={{ marginTop: '32px' }}>Authentication Data</h3>
        <ul style={{ color: '#a3a3a3', paddingLeft: '24px', lineHeight: '1.7' }}>
          <li><strong>Access & Refresh Tokens</strong> – stored securely in VS Code Secret Storage API (encrypted)</li>
          <li><strong>Session Information</strong> – data about active sessions</li>
        </ul>

        <h3 style={{ marginTop: '32px' }}>Local Data</h3>
        <ul style={{ color: '#a3a3a3', paddingLeft: '24px', lineHeight: '1.7' }}>
          <li><strong>Design Edits & Inspection Data</strong> – stored locally in your VS Code extension storage or workspace settings</li>
          <li><strong>Extension Settings</strong> – preferences and configuration saved locally</li>
        </ul>

        <h3 style={{ marginTop: '32px' }}>Usage Data</h3>
        <ul style={{ color: '#a3a3a3', paddingLeft: '24px', lineHeight: '1.7' }}>
          <li><strong>Feature Usage Metrics</strong> – anonymous data on how the Extension is used</li>
          <li><strong>Error Logs</strong> – technical information about failures (never includes personal code content)</li>
        </ul>
      </div>

      <div className="content-header">
        <h2>How We Use Information</h2>
        <p>
          We process information under the following lawful bases (GDPR Art. 6):
        </p>
        <ul style={{ color: '#a3a3a3', paddingLeft: '24px', lineHeight: '1.7' }}>
          <li><strong>Performance of a contract</strong> – to provide core services and features</li>
          <li><strong>Legitimate interest</strong> – to maintain and improve functionality</li>
          <li><strong>Consent</strong> – when you opt in to communications or beta testing</li>
        </ul>
        <p style={{ marginTop: '16px' }}>We use collected information to:</p>
        <ul style={{ color: '#a3a3a3', paddingLeft: '24px', lineHeight: '1.7' }}>
          <li>Provide and improve the Extension's inspection and editing features</li>
          <li>Authenticate your account via Google OAuth</li>
          <li>Manage subscriptions and billing</li>
          <li>Offer technical support and respond to inquiries</li>
          <li>Ensure security and prevent fraud</li>
        </ul>
      </div>

      <div className="content-header">
        <h2>Data Storage and Security</h2>
        
        <h3>Local Storage</h3>
        <ul style={{ color: '#a3a3a3', paddingLeft: '24px', lineHeight: '1.7' }}>
          <li>Your edits and inspection data remain entirely on your device unless you export or share them.</li>
          <li>You may clear them any time by removing the Extension's local data or uninstalling it.</li>
        </ul>

        <h3 style={{ marginTop: '32px' }}>Secure Storage</h3>
        <ul style={{ color: '#a3a3a3', paddingLeft: '24px', lineHeight: '1.7' }}>
          <li>Authentication tokens are encrypted using VS Code's Secret Storage API.</li>
          <li>We employ industry-standard security measures and restrict access to authorized personnel only.</li>
        </ul>

        <h3 style={{ marginTop: '32px' }}>Server Storage</h3>
        <ul style={{ color: '#a3a3a3', paddingLeft: '24px', lineHeight: '1.7' }}>
          <li>Account metadata (email, ID, subscription status) is held on secure servers protected by encryption and access controls.</li>
        </ul>
      </div>

      <div className="content-header">
        <h2>Data Sharing and Disclosure</h2>
        <p>
          We do not sell or rent personal data. We share data only when:
        </p>
        <ul style={{ color: '#a3a3a3', paddingLeft: '24px', lineHeight: '1.7' }}>
          <li><strong>Service Providers</strong> assist in authentication, billing, or analytics</li>
          <li><strong>Legal Requirements</strong> mandate disclosure</li>
          <li><strong>Business Transfers</strong> occur (with prior notice)</li>
          <li><strong>Your Consent</strong> is explicitly provided</li>
        </ul>
      </div>

      <div className="content-header">
        <h2>Third-Party Services</h2>
        
        <h3>Google OAuth</h3>
        <ul style={{ color: '#a3a3a3', paddingLeft: '24px', lineHeight: '1.7' }}>
          <li>Used solely for authentication.</li>
          <li>Subject to <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}>Google Privacy Policy</a>.</li>
          <li>Situ Design complies with the Google API Services User Data Policy, including Limited Use requirements.</li>
        </ul>

        <h3 style={{ marginTop: '32px' }}>Payment Processing</h3>
        <ul style={{ color: '#a3a3a3', paddingLeft: '24px', lineHeight: '1.7' }}>
          <li>Handled by third-party processors; full payment card details are never stored by Situ Design.</li>
        </ul>
      </div>

      <div className="content-header">
        <h2>Your Rights and Choices</h2>
        <p>You may:</p>
        <ul style={{ color: '#a3a3a3', paddingLeft: '24px', lineHeight: '1.7' }}>
          <li>Access or export your data</li>
          <li>Correct inaccurate information</li>
          <li>Delete your account (permanent within 30 days)</li>
          <li>Withdraw consent or uninstall the Extension</li>
        </ul>
        <p style={{ marginTop: '16px' }}>
          <strong>Requests:</strong> <a href="mailto:hi@situ.design" style={{ color: '#3b82f6', textDecoration: 'none' }}>hi@situ.design</a>
        </p>
      </div>

      <div className="content-header">
        <h2>Data Retention</h2>
        <div style={{ marginTop: '16px', marginBottom: '16px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #1E1F21' }}>
            <thead>
              <tr style={{ background: '#1a1a1a' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #1E1F21', color: '#ffffff' }}>Data Type</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #1E1F21', color: '#ffffff' }}>Retention Period</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #1E1F21', color: '#a3a3a3' }}>Account Data</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #1E1F21', color: '#a3a3a3' }}>While account active + 30 days after closure</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #1E1F21', color: '#a3a3a3' }}>Logs</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #1E1F21', color: '#a3a3a3' }}>Up to 90 days for troubleshooting</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', color: '#a3a3a3' }}>Local Data</td>
                <td style={{ padding: '12px', color: '#a3a3a3' }}>Until cleared or extension uninstalled</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="content-header">
        <h2>International Transfers</h2>
        <p>
          Data may be processed outside your country, including Australia and the U.S.
        </p>
        <p>
          Transfers follow Standard Contractual Clauses or equivalent safeguards.
        </p>
      </div>

      <div className="content-header">
        <h2>Children's Privacy</h2>
        <p>
          The Extension is not intended for users under 13.
        </p>
        <p>
          If we learn that a child's data has been collected, it will be deleted promptly.
        </p>
      </div>

      <div className="content-header">
        <h2>Changes to This Policy</h2>
        <p>
          We may update this Policy periodically.
        </p>
        <p>
          Material changes will be announced via:
        </p>
        <ul style={{ color: '#a3a3a3', paddingLeft: '24px', lineHeight: '1.7' }}>
          <li>notice on https://situ.design</li>
          <li>in-app or email notification (if applicable)</li>
        </ul>
      </div>

      <div className="content-header">
        <h2>Contact Us</h2>
        <p><strong>Data Controller:</strong> Situ Design Pty Ltd</p>
        <ul style={{ color: '#a3a3a3', paddingLeft: '24px', lineHeight: '1.7', listStyle: 'none' }}>
          <li><strong>Email:</strong> <a href="mailto:hi@situ.design" style={{ color: '#3b82f6', textDecoration: 'none' }}>hi@situ.design</a></li>
          <li><strong>Support:</strong> <a href="mailto:support@situ.design" style={{ color: '#3b82f6', textDecoration: 'none' }}>support@situ.design</a></li>
          <li><strong>Website:</strong> <a href="https://situ.design" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}>https://situ.design</a></li>
        </ul>
      </div>

      <div className="content-header">
        <h2>Compliance</h2>
        <p>
          Designed to comply with:
        </p>
        <ul style={{ color: '#a3a3a3', paddingLeft: '24px', lineHeight: '1.7' }}>
          <li>GDPR (EU / UK)</li>
          <li>CCPA/CPRA (California)</li>
          <li>Australian Privacy Act 1988</li>
        </ul>
      </div>

      <div className="content-header">
        <p style={{ color: '#707070', fontSize: '14px', marginTop: '0px' }}>
          <strong>Effective Date:</strong> November 2025
        </p>
      </div>
    </div>
  );
};

