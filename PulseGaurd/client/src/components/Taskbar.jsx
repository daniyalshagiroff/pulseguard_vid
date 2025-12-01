// client/src/components/Taskbar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const ICONS = {
  logo: '/img/pulseguard.png',
  dashboard: '/img/dash.svg',
  history: '/img/inc_his.svg',
  devices: '/img/dev_man.svg',
  analytics: '/img/analyt.svg',
  settings: '/img/settings.svg',
  profile: '/img/profile.svg',
};

export default function Taskbar({ user, onLogout }) {
  const nav = useNavigate();
  const displayName = user?.fullName || user?.name || 'admin';
  // Always use bundled avatar from public/img
  const avatar = '/img/avatar.jpg';
  const role = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Admin';

  const handleLogout = () => {
    onLogout && onLogout();
    nav('/login');
  };

  return (
    <aside className="taskbar">
      <div className="taskbar-header">
        <div className="taskbar-logo">
          <img src={ICONS.logo} alt="logo" className="taskbar-logo-img" />
        </div>
        <span className="taskbar-title">PulseGuard</span>
      </div>

      <nav className="taskbar-nav">
        <NavLink
          to="/"
          className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
        >
          <span className="nav-icon">
            <img src={ICONS.dashboard} alt="" />
          </span>
          <span className="nav-label">Dashboard</span>
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
        >
          <span className="nav-icon">
            <img src={ICONS.history} alt="" />
          </span>
          <span className="nav-label">Incident History</span>
        </NavLink>

        <NavLink
          to="/devices"
          className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
        >
          <span className="nav-icon">
            <img src={ICONS.devices} alt="" />
          </span>
          <span className="nav-label">Device Management</span>
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
        >
          <span className="nav-icon">
            <img src={ICONS.analytics} alt="" />
          </span>
          <span className="nav-label">Analytics</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
        >
          <span className="nav-icon">
            <img src={ICONS.settings} alt="" />
          </span>
          <span className="nav-label">Settings</span>
        </NavLink>
      </nav>

      <div className="taskbar-footer">
        <div className="user-pill">
          <button
            type="button"
            className="user-main"
            onClick={() => nav('/profile')}
          >
            <div className="user-avatar">
              <img
                src={avatar}
                alt={displayName}
                className="user-avatar-img"
                style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
              />
            </div>
            <div className="user-info">
              <div className="user-name">{displayName}</div>
              <div className="user-role">{role}</div>
            </div>
          </button>

          <div className="user-actions">
            <button
              className="icon-btn"
              type="button"
              title="Profile"
              onClick={() => nav('/profile')}
            >
              <img src="/img/settings.svg" alt="Profile settings" className="icon-btn-img" />
            </button>

            <button
              className="icon-btn"
              type="button"
              title="Logout"
              onClick={handleLogout}
            >
              <img src="/img/logout.svg" alt="Logout" className="icon-btn-img" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
