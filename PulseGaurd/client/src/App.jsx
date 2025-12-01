import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Taskbar from './components/Taskbar';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import IncidentDetails from './components/IncidentDetails';
import History from './components/History';
import Devices from './components/Devices';
import Settings from './components/Settings';
import Profile from './components/Profile';
import Analytics from './components/Analytics';
import NotFound from './components/NotFound';
import { fetchAlerts } from './api';
import { socket } from './socket';

export default function App(){
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('pg:user')) || null);
  const [alerts, setAlerts] = useState([]);
  const [, setDevices] = useState([]);
  const [loginNotice, setLoginNotice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    console.log('[alerts] useEffect mounted');

    const loadAlerts = async () => {
      console.log('[alerts] fetching initial alerts...');
      try {
        const data = await fetchAlerts();
        if (!isMounted) {
          console.log('[alerts] fetch finished but component unmounted, skipping setState');
          return;
        }
        console.log(`[alerts] fetched ${data.length} alerts from API`);
        setAlerts(data);
      } catch (err) {
        console.error('[alerts] failed to fetch alerts:', err);
        if (isMounted) setAlerts([]);
      }
    };

    loadAlerts();

    const handleNewAlert = alert => {
      console.log('[socket] new-alert received:', alert);
      setAlerts(prev => [alert, ...prev]);
    };

    const handleUpdateAlert = payload => {
      console.log('[socket] update-alert received:', payload);
      setAlerts(prev =>
        prev.map(alert => (alert.id === payload.id ? { ...alert, ...payload } : alert))
      );
    };

    const handleDeviceUpdate = device => {
      console.log('[socket] device-update received:', device);
      setDevices(prev => {
        const idx = prev.findIndex(d => d.id === device.id);
        if (idx === -1) return [device, ...prev];
        return prev.map(d => (d.id === device.id ? { ...d, ...device } : d));
      });
    };

    console.log('[socket] subscribing to new-alert, update-alert, device-update');
    socket.on('new-alert', handleNewAlert);
    socket.on('update-alert', handleUpdateAlert);
    socket.on('device-update', handleDeviceUpdate);

    return () => {
      isMounted = false;
      console.log('[alerts] useEffect cleanup: unsubscribing socket listeners');
      socket.off('new-alert', handleNewAlert);
      socket.off('update-alert', handleUpdateAlert);
      socket.off('device-update', handleDeviceUpdate);
    };
  }, []);

  useEffect(() => {
    if (!loginNotice) return;
    const t = setTimeout(() => setLoginNotice(null), 4000);
    return () => clearTimeout(t);
  }, [loginNotice]);

  function handleLogin(u){
    setUser(u);
    localStorage.setItem('pg:user', JSON.stringify(u));
    setLoginNotice(`Account "${u.fullName || u.name || u.username}" logged in.`);
    navigate('/');
  }
  function handleLogout(){
    setUser(null);
    localStorage.removeItem('pg:user');
    navigate('/login');
  }

  return (
    <div style={{height:'100vh'}}>
      {loginNotice && (
        <div
          className="toast login-toast"
          style={{
            position: 'fixed',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#0b0f1a',
            color: '#e8f5e9',
            padding: '12px 20px',
            borderRadius: 28,
            boxShadow: '0 8px 22px rgba(0,0,0,0.35)',
            zIndex: 1000,
            fontWeight: 600,
            border: '2px solid #4ade80',
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            minWidth: 320,
            justifyContent: 'center'
          }}
        >
          <span style={{ fontWeight: 700 }}>Login</span>
          <span style={{ opacity: 0.9 }}>{loginNotice}</span>
        </div>
      )}
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/*" element={
          user ? (
            <div className="app">
              <div className="sidebar"><Taskbar user={user} onLogout={handleLogout}/></div>
              <div className="main">
                
                <div className="content">
                  <Routes>
                    <Route index element={<Dashboard alerts={alerts} user={user} />} />
                    <Route path="incident/:id" element={<IncidentDetails user={user} />} />
                    <Route path="history" element={<History alerts={alerts} />} />
                    <Route path="devices" element={<Devices />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="profile" element={<Profile user={user} />} />
                    <Route path="analytics" element={<Analytics alerts={alerts} />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </div>
            </div>
          ) : <LoginPage onLogin={handleLogin} />
        } />
      </Routes>
    </div>
  );
}
