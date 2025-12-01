// client/src/components/Analytics.jsx
import React from 'react';

export default function Analytics({ alerts = [] }) {
  const total = alerts.length;
  const active = alerts.filter(
    a => a.status === 'active' || a.status === 'escalated'
  ).length;
  const escalated = alerts.filter(a => a.status === 'escalated').length;
  const handled = alerts.filter(
    a => a.status !== 'active' && a.status !== 'escalated'
  ).length; // used for "Incidents sorted"

  return (
    <div className="card analytics-card">
      <h3 className="analytics-title">Analytics</h3>

      {/* Global analytics */}
      <div className="analytics-section-title">Global analytics</div>

      <img
        src="/img/stats.png"        // your reference chart
        alt="Global analytics chart"
        className="analytics-chart"
      />

      <div className="analytics-row">
        <div className="analytics-pill">
          incidents sorted: {total}
        </div>
        <div className="analytics-pill">
          Active: {active}
        </div>
        <div className="analytics-pill">
          Escalated: {escalated}
        </div>
      </div>

      {/* Personal analytics */}
      <div className="analytics-section-title" style={{ marginTop: 24 }}>
        Personal analytics
      </div>

      <div className="analytics-row">
        <div className="analytics-pill">
          Length of service: 1y 11m 2d
        </div>
        <div className="analytics-pill">
          Incidents sorted: {handled}
        </div>
      </div>
    </div>
  );
}
