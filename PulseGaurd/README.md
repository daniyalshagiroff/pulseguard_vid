# PulseGuard — Real-Time Gunshot Detection & Surveillance Response System  
### Full-Stack Prototype (React + Node + Socket.io)

PulseGuard is a web-based monitoring dashboard designed to support law enforcement by providing real-time detection, visualization, and response tools for gunshot incidents.  
This repository includes both the **frontend (React)** and **backend (Node.js)** systems necessary to demonstrate the workflow.

---

## 📦 Project Structure

```
pulseguard/
│── server/       # Backend API + Socket.io
│── client/       # React Frontend Web App
│── README.md     # Project documentation
```

---

## 🖥️ Frontend Features (React + Vite)

- Login system  
- Dashboard with:
  - Live camera window (sample stream)
  - Live alerts list with “Escalate / Decline / Inspect”
  - Live map placeholder
  - Device connectivity list
- Incident details page
- Alert history
- Device management page
- Settings, profile, analytics
- Real-time updates via Socket.io
- Styled based on Figma PulseGuard UI

---

## 🔧 Backend Features (Node.js + Express)

- REST API for:
  - Alerts
  - Devices
  - Login (mock)
- Real-time updates using Socket.io
- Auto-created JSON storage database
- Simple local simulation for events

---

## 🛠️ Installation & Setup

### 1. Clone the Project
```bash
git clone <repository-url>
cd pulseguard
```

---

## ▶️ Start Backend

```
cd server
npm install
npm start
```

Runs at:  
**http://localhost:4000**

---

## ▶️ Start Frontend

```
cd client
npm install
npm run dev
```

Runs at:  
**http://localhost:5173**

---

## 🔐 Test Login Accounts

| Username | Password | Role    |
|---------|----------|---------|
| admin   | admin    | admin   |
| officer | officer  | officer |

---

## 📡 Trigger a Test Alert

```bash
curl -X POST http://localhost:4000/api/alerts \
-H "Content-Type: application/json" \
-d '{
  "type": "gunshot",
  "weapon": "handgun",
  "confidence": 0.88,
  "status": "active",
  "location": { "lat": 25.20, "lng": 55.27 },
  "cameraId": "CAM-01"
}'
```

---

## 🎯 Purpose of This Prototype

This prototype:
- Shows the full interaction flow for PulseGuard
- Provides all UI pages required in the Figma design
- Demonstrates a real working architecture with alerts, devices, and live updates
- Gives a foundation for real device integration later

All incident data, video streams, and devices are **demo placeholders**, intended to be replaced by actual edge device outputs.

---

## 📄 License
For educational use in the Capstone Project at UOWD.  
Do not use in production without approval and compliance checks.

