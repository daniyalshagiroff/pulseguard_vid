// client/src/components/Profile.jsx
import React from 'react';

export default function Profile({ user = {} }) {
  const name = user.fullName || user.name || 'Sylvester Stallone';
  const role = user.role || 'Executive officer';
  // Always use bundled avatar from public/img
  const avatar = '/img/avatar.jpg'; // fixed avatar path

  return (
    <div className="card profile-card">
      <h3 className="profile-title">Profile</h3>

      <div className="profile-main">
        <div className="profile-avatar-wrap">
          <img src={avatar} alt={name} className="profile-avatar-img" />
        </div>

        <div className="profile-info">
          <div className="profile-name">{name}</div>
          <div className="profile-role">{role}</div>
        </div>
      </div>

      <div className="profile-section-title">Personal analytics</div>

      <div className="profile-analytics-pill">
        <div>Length of service: 1y 11m 2d</div>
        <div>Incidents sorted: 11</div>
      </div>
    </div>
  );
}
