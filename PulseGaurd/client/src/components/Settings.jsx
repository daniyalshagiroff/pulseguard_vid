// client/src/components/Settings.jsx
import React, { useState } from 'react';

export default function Settings() {
  const [passwordActive, setPasswordActive] = useState(true);

  return (
    <div className="card settings-card">
      <h3 className="settings-heading">Settings</h3>

      {/* GENERAL */}
      <div className="settings-section-label">General</div>

      <div className="settings-row">
        <div className="settings-left">
          <div className="settings-pill-icon">
            <span className="settings-pill-dot" />
          </div>
          <div>
            <div className="settings-row-title">Detection threshold</div>
            <div className="settings-row-sub">
              This panel allows admits to change thresholds, API keys, and
              integrations (ONVIF, Map..)
            </div>
          </div>
        </div>
      </div>

      {/* PASSWORD */}
      <div className="settings-section-label" style={{ marginTop: 24 }}>
        Password
      </div>

      <div className="settings-row">
        <div className="settings-left">
          <div>
            <div className="settings-row-title">Change password</div>
            <div className="settings-row-sub">
              This setting allows you to change password
            </div>
          </div>
        </div>

        <button
          type="button"
          className={
            'settings-toggle-btn ' +
            (passwordActive ? 'settings-toggle-btn--active' : 'settings-toggle-btn--inactive')
          }
          onClick={() => setPasswordActive(prev => !prev)}
        >
          {passwordActive ? 'Active' : 'Inactive'}
        </button>
      </div>
    </div>
  );
}
