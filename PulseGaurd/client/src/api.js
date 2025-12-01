// Prefer env; fall back to local API in dev if env is missing.
const BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:4000' : '');

export async function login(username, password){
  const res = await fetch(`${BASE}/api/login`, {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if(!res.ok) throw new Error(data.message || 'Login failed');
  return data;
}
export async function fetchAlerts(){ const r = await fetch(`${BASE}/api/alerts`); return r.json(); }
export async function createAlert(payload){ const r= await fetch(`${BASE}/api/alerts`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) }); return r.json(); }
export async function updateAlert(id,payload){ const r = await fetch(`${BASE}/api/alerts/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) }); return r.json(); }
export async function fetchDevices(){ const r = await fetch(`${BASE}/api/devices`); return r.json(); }
export async function updateDevice(id,payload){ const r = await fetch(`${BASE}/api/devices/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) }); return r.json(); }
