// client/src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import MapView from './MapView';
import AlertList from './AlertList';
import { fetchDevices } from '../api';
import { socket } from '../socket';
import { useNavigate } from 'react-router-dom';

export default function Dashboard({ alerts, user }) {
  const [devices, setDevices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDevices().then(setDevices).catch(() => setDevices([]));
    socket.on('device-update', d =>
      setDevices(prev => {
        const idx = prev.findIndex(x => x.id === d.id);
        if (idx === -1) return [d, ...prev];
        const copy = [...prev];
        copy[idx] = d;
        return copy;
      })
    );
    return () => socket.off('device-update');
  }, []);

  const active = alerts.filter(
    a => a.status === 'active' || a.status === 'escalated'
  );

  return (
    <div className="dashboard">
      <div className="row dashboard-row">
        <div className="col">
          <div className="card card--map-full">
            <MapView alerts={active} />
          </div>
        </div>

        <div style={{ width: 440, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-header">
              <h3>Active Alerts</h3>
              <span className="badge-count">{active.length}</span>
            </div>
            <AlertList
              alerts={active}
              user={user}
              onInspect={id => navigate(`/incident/${id}`)}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
