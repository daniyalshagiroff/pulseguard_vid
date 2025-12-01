// client/src/components/LoginPage.jsx
import React, { useState } from 'react';
import { login } from '../api';

const ICONS = {
  logo: '/img/pulseguard.png',
  dashboard: '/img/dash.svg',
  history: '/img/inc_his.svg',
  devices: '/img/dev_man.svg',
  analytics: '/img/analyt.svg',
  settings: '/img/settings.svg',
  profile: '/img/profile.svg',
};

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setErr(null);
    try {
      const res = await login(username, password);
      onLogin({ name: res.user.name, role: res.role, token: res.token });
    } catch (error) {
      setErr(error.message || 'Login failed');
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Header inside the card */}
        <div className="login-header">
          <div className="login-logo-row">
            <div className="taskbar-logo">
              <img
                src={ICONS.logo}
                alt="PulseGuard logo"
                className="taskbar-logo-img"
              />
            </div>
            <span className="taskbar-title">PulseGuard</span>
          </div>
          {/* login subtitle removed */}
        </div>

        {/* Form */}
        <form onSubmit={submit} className="login-form">
          <label htmlFor="username" className="login-label">
            Username
          </label>
          <input
            id="username"
            type="text"
            className="login-input"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="admin"
          />

          <label htmlFor="password" className="login-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="login-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          {err && <div className="login-error">{err}</div>}

          <div className="login-footer">
            <button className="button login-btn" type="submit">
              Sign In
            </button>
            <div className="login-demo">
              Demo: <strong>admin/admin</strong> or{' '}
              <strong>officer/officer</strong>
            </div>
          </div>
        </form>

        {/* bottom help link */}
        <div className="login-help-row">
          <button
            type="button"
            className="login-help-link"
            // hook this up later to your support page / mailto
            onClick={() => console.log('Need help clicked')}
          >
            Need help?
          </button>
        </div>
      </div>
    </div>
  );
}
