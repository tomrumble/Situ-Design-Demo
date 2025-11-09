import React from 'react';
import { Link } from 'react-router-dom';

export const TermsPage = () => {
  return (
    <div className="content-section">
      <div className="content-header">
        <Link to="/" className="back-link">
          ← Back to Home
        </Link>
        <h1>Terms of Service</h1>
        <p style={{ color: '#707070', fontSize: '14px', marginTop: '-16px' }}>
          <strong>Last Updated:</strong> December 2025
        </p>
      </div>

      <div className="content-header">
        <h2>Agreement to Terms</h2>
        <p>
          By installing or using the Situ Design VS Code Extension ("Extension") or related services ("Services"), you agree to these Terms of Service ("Terms").
        </p>
        <p>
          If you do not agree, uninstall the Extension.
        </p>
      </div>

      <div className="content-header">
        <h2>Description of Service</h2>
        <p>Situ Design provides:</p>
        <ul style={{ color: '#a3a3a3', paddingLeft: '24px', lineHeight: '1.7' }}>
          <li>React component inspection and visualization</li>
          <li>Real-time style and layout editing</li>
          <li>Model Context Protocol (MCP) integration for AI agent edits</li>
          <li>Developer tools for design modification and visualization</li>
        </ul>
      </div>

      <div className="content-header">
        <h2>Eligibility</h2>
        <p>
          You must be 13 or older, capable of forming a binding contract, and not barred from using the Services under applicable law.
        </p>
      </div>

      <div className="content-header">
        <h2>Account and Authentication</h2>
        <ul style={{ color: '#a3a3a3', paddingLeft: '24px', lineHeight: '1.7' }}>
          <li>Authentication occurs via Google OAuth (subject to Google's Terms).</li>
          <li>You are responsible for safeguarding your credentials.</li>
          <li>Notify support@situ.design of unauthorized use.</li>
        </ul>
      </div>

      <div className="content-header">
        <h2>Subscription Plans and Payments</h2>
        <div style={{ marginTop: '16px', marginBottom: '16px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #1E1F21' }}>
            <thead>
              <tr style={{ background: '#1a1a1a' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #1E1F21', color: '#ffffff' }}>Plan</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #1E1F21', color: '#ffffff' }}>Access</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #1E1F21', color: '#ffffff' }}>Billing</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #1E1F21', color: '#a3a3a3' }}>Beta</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #1E1F21', color: '#a3a3a3' }}>Limited access during beta</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #1E1F21', color: '#a3a3a3' }}>Free / invitation-only</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #1E1F21', color: '#a3a3a3' }}>Pro</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #1E1F21', color: '#a3a3a3' }}>Full access</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #1E1F21', color: '#a3a3a3' }}>Recurring monthly or annual</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', color: '#a3a3a3' }}>None</td>
                <td style={{ padding: '12px', color: '#a3a3a3' }}>No subscription</td>
                <td style={{ padding: '12px', color: '#a3a3a3' }}>Limited access</td>
              </tr>
            </tbody>
          </table>
        </div>
        <ul style={{ color: '#a3a3a3', paddingLeft: '24px', lineHeight: '1.7' }}>
          <li>Fees auto-renew until cancelled.</li>
          <li>Cancel anytime; access remains through current billing period.</li>
          <li>Prices may change with 30 days' notice.</li>
          <li>Refunds only where required by law.</li>
        </ul>
      </div>

      <div className="content-header">
        <h2>Acceptable Use</h2>
        <p>You must not:</p>
        <ul style={{ color: '#a3a3a3', paddingLeft: '24px', lineHeight: '1.7' }}>
          <li>Violate laws or regulations</li>
          <li>Reverse-engineer or disassemble the Extension</li>
          <li>Attempt unauthorized system access</li>
          <li>Share credentials or circumvent subscriptions</li>
          <li>Interfere with our servers or users</li>
          <li>Introduce malicious code or infringing content</li>
        </ul>
      </div>

      <div className="content-header">
        <h2>Intellectual Property</h2>
        <ul style={{ color: '#a3a3a3', paddingLeft: '24px', lineHeight: '1.7' }}>
          <li>The Extension, documentation, and branding belong to Situ Design.</li>
          <li>You retain ownership of your own code and projects.</li>
          <li>You grant Situ Design a non-exclusive, royalty-free license to use aggregated and anonymized usage data for analytics.</li>
        </ul>
      </div>

      <div className="content-header">
        <h2>Open-Source Components</h2>
        <p>
          Third-party libraries included with the Extension remain subject to their respective licenses.
        </p>
      </div>

      <div className="content-header">
        <h2>Feedback and Suggestions</h2>
        <p>
          By submitting feedback, you grant Situ Design a perpetual, royalty-free license to use it for product improvement.
        </p>
      </div>

      <div className="content-header">
        <h2>Local Data and Privacy</h2>
        <ul style={{ color: '#a3a3a3', paddingLeft: '24px', lineHeight: '1.7' }}>
          <li>Your design edits and inspection data are stored locally on your device.</li>
          <li>You are responsible for backups.</li>
          <li>Privacy practices are governed by the <Link to="/privacy" style={{ color: '#3b82f6', textDecoration: 'none' }}>Privacy Policy</Link>.</li>
        </ul>
      </div>

      <div className="content-header">
        <h2>Service Availability and Modifications</h2>
        <ul style={{ color: '#a3a3a3', paddingLeft: '24px', lineHeight: '1.7' }}>
          <li>We strive for uptime but do not guarantee uninterrupted access.</li>
          <li>Features and plans may change or be discontinued with notice.</li>
          <li>Beta features are provided "as is."</li>
        </ul>
      </div>

      <div className="content-header">
        <h2>Disclaimer of Warranties</h2>
        <p style={{ fontStyle: 'italic', color: '#a3a3a3' }}>
          THE EXTENSION AND SERVICES ARE PROVIDED "AS IS" WITHOUT ANY WARRANTY, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
        </p>
        <p>
          We do not warrant that the Services will be error-free or secure.
        </p>
      </div>

      <div className="content-header">
        <h2>Limitation of Liability</h2>
        <p style={{ fontStyle: 'italic', color: '#a3a3a3' }}>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW:
        </p>
        <ul style={{ color: '#a3a3a3', paddingLeft: '24px', lineHeight: '1.7' }}>
          <li>Situ Design is not liable for indirect, incidental, or consequential damages.</li>
          <li>Total liability is limited to the amount paid in the 12 months preceding the claim.</li>
          <li>Nothing limits liability for fraud, death, or personal injury where prohibited by law.</li>
        </ul>
      </div>

      <div className="content-header">
        <h2>Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless Situ Design and its officers and employees from claims arising out of your use of the Extension or breach of these Terms.
        </p>
      </div>

      <div className="content-header">
        <h2>Termination</h2>
        <ul style={{ color: '#a3a3a3', paddingLeft: '24px', lineHeight: '1.7' }}>
          <li>We may suspend or terminate access for violations or legal reasons.</li>
          <li>You may terminate at any time by deleting your account or uninstalling the Extension.</li>
          <li>Post-termination, your data may be deleted in accordance with our Privacy Policy.</li>
        </ul>
      </div>

      <div className="content-header">
        <h2>Dispute Resolution</h2>
        <ul style={{ color: '#a3a3a3', paddingLeft: '24px', lineHeight: '1.7' }}>
          <li><strong>Governing Law:</strong> Laws of Victoria, Australia.</li>
          <li><strong>Venue:</strong> Courts of Victoria have exclusive jurisdiction.</li>
          <li>Parties will attempt informal resolution before litigation.</li>
        </ul>
      </div>

      <div className="content-header">
        <h2>General Provisions</h2>
        <ul style={{ color: '#a3a3a3', paddingLeft: '24px', lineHeight: '1.7' }}>
          <li><strong>Entire Agreement:</strong> These Terms + Privacy Policy constitute the whole agreement.</li>
          <li><strong>Severability:</strong> Invalid provisions do not affect the remainder.</li>
          <li><strong>Assignment:</strong> You may not assign without written consent.</li>
          <li><strong>Notices:</strong> May be sent via email or in-app notification.</li>
          <li><strong>Updates:</strong> Material changes will be posted on https://situ.design/terms.</li>
        </ul>
      </div>

      <div className="content-header">
        <h2>Contact</h2>
        <ul style={{ color: '#a3a3a3', paddingLeft: '24px', lineHeight: '1.7', listStyle: 'none' }}>
          <li><strong>Legal:</strong> hi@situ.design</li>
          <li><strong>Support:</strong> hi@situ.design</li>
          <li><strong>Website:</strong> https://situ.design</li>
        </ul>
      </div>

      <div className="content-header">
        <p style={{ color: '#707070', fontSize: '14px', marginTop: '32px' }}>
          <strong>Effective Date:</strong> December 2025
        </p>
      </div>
    </div>
  );
};

