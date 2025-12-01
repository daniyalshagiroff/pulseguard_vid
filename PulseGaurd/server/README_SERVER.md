# PulseGuard Server (Backend)

This is the backend service for the PulseGuard Real-Time Gunshot Detection & Surveillance Response System.  
It provides REST APIs, Socket.io real-time events, and stores alerts/devices in a lightweight JSON database (`data.json`).  
In production, this should be replaced with a real database (PostgreSQL / MongoDB).

---

## 🚀 Features
- REST API for alerts and devices
- Real-time event push using Socket.io
- Automatic storage of alerts and device updates
- Mock login system (admin/officer)
- Easily replaceable with real AI edge device integrations

---

## 📁 Folder Structure

```
server/
│── index.js            # Main server file
│── data.json           # Auto-created database file
│── package.json        # Dependencies + scripts
│── README_SERVER.md    # This file
```

---

## 🛠️ Installation

Open terminal:

```bash
cd pulseguard/server
npm install
```

---

## ▶️ Running the Server

```bash
npm start
```

The server will start at:

```
http://localhost:4000
```

---

## 🧪 Test Login Accounts

| Username | Password | Role     |
|---------|----------|----------|
| admin   | admin    | admin    |
| officer | officer  | officer  |

---

## 🔌 API Endpoints

### **Auth**
```
POST /api/login  
```

### **Alerts**
```
GET    /api/alerts
POST   /api/alerts
PUT    /api/alerts/:id
```

### **Devices**
```
GET    /api/devices
PUT    /api/devices/:id
```

---

## 🔁 Socket.io Events
- `new-alert` → Fired when a new alert is created
- `update-alert` → Fired when status changes
- `device-update` → Fired when a device’s status updates

---

## 📡 Simulating an Alert

Use curl or Postman:

```bash
curl -X POST http://localhost:4000/api/alerts \
-H "Content-Type: application/json" \
-d '{
  "type": "gunshot",
  "weapon": "rifle",
  "confidence": 0.91,
  "status": "active",
  "location": { "lat": 25.2048, "lng": 55.2708 },
  "cameraId": "CAM-01",
  "snapshot": null
}'
```

---

## 📦 Recommended Production Upgrades
- Replace `data.json` → MongoDB or PostgreSQL
- Add JWT authentication
- Enable HTTPS
- Connect edge devices for real gunshot events
- Add ONVIF camera PTZ integration

---

## 📄 License
Educational use only — not for deployment without legal and ethical compliance.
