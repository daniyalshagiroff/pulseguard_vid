// client/src/components/Devices.jsx
import React, { useEffect, useState } from 'react';
import { fetchDevices, updateDevice } from '../api';

export default function Devices() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    fetchDevices().then(setDevices).catch(() => setDevices([]));
  }, []);

  async function toggle(id) {
    const dev = devices.find(d => d.id === id);
    const next = dev.status === 'online' ? 'offline' : 'online';
    // Optimistic status flip to avoid UI lag.
    setDevices(prev =>
      prev.map(p => (p.id === id ? { ...p, status: next } : p))
    );

    try {
      const res = await updateDevice(id, { status: next });
      const updated = res?.device || res || {};
      setDevices(prev =>
        prev.map(p =>
          p.id === id ? { ...p, ...updated, status: updated.status || next } : p
        )
      );
    } catch (err) {
      console.error('[devices] failed to toggle device', err);
      // Roll back on failure
      setDevices(prev =>
        prev.map(p => (p.id === id ? { ...p, status: dev.status } : p))
      );
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3>Devices</h3>
      </div>

      <div className="device-list">
        {devices.map(d => (
          <div key={d.id} className="device-row">
            <div className="device-text">
              <div className="device-name">
                {d.name} <span className="device-id">({d.id})</span>
              </div>
              <div className="device-meta">
                {d.type}, last seen {new Date(d.lastSeen).toLocaleString()}
              </div>
            </div>

            <div className="device-right">
              <span
                className={
                  d.status === 'online'
                    ? 'device-status device-status-active'
                    : 'device-status device-status-disabled'
                }
              >
                {d.status === 'online' ? 'active' : 'disabled'}
              </span>
              <button className="small-btn" onClick={() => toggle(d.id)}>
                Toggle
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
