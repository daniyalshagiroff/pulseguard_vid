# PulseGuard Data Flow Diagram — DATA_FLOW_DIAGRAM.md

This document describes the **data flow** and **interactions** between components in the PulseGuard Real-Time Gunshot Detection & Surveillance Response System.  

It covers all steps from **gunshot detection** to **dashboard visualization** and **real-time alerts**.

---

## 1️⃣ System Components

| Component             | Description |
|----------------------|-------------|
| Edge Devices          | Microphones and cameras deployed in the field to detect gunshots and record video |
| Gunshot Detection AI  | Processes audio signals from microphones to detect gunshots and classify weapon type |
| Backend Server        | Node.js + Express server that receives events, stores alerts/devices in JSON or DB, and manages Socket.io real-time events |
| Frontend Dashboard    | React app displaying live camera, alerts, devices, map, and history |
| Real-Time Channel     | Socket.io channel that pushes updates from backend to frontend instantly |
| Database Layer        | JSON file (prototype) or real database (MongoDB/PostgreSQL) storing alerts, devices, and event history |

---

## 2️⃣ Data Flow Steps

1. **Gunshot Detection**
   - Microphone captures sound → sent to AI for detection & classification  
   - Output: {type: gunshot, weapon: handgun/rifle, confidence: 0-1}

2. **Event Transmission**
   - AI sends detection event to backend via REST API or WebSocket  
   - Backend stores alert in JSON database and assigns unique ID

3. **Backend Processing**
   - Update alert status (active, escalated, declined)  
   - Push `new-alert` event to frontend via Socket.io  
   - Log timestamp, location, camera ID

4. **Camera Activation**
   - Backend triggers CCTV to point to incident location  
   - Provides live camera feed URL to frontend

5. **Frontend Dashboard**
   - Receives real-time events via Socket.io  
   - Displays:
     - Live camera window  
     - Live map with incident location  
     - Alert status and confidence  
     - Device connectivity status  
     - History of past alerts

6. **User Interaction**
   - Officer/Admin can:
     - Escalate or decline alerts  
     - Inspect alert details  
     - Track devices  
   - Updates sent back to backend via REST or Socket.io (`update-alert` event)

7. **Data Storage**
   - All alerts, devices, and user interactions stored in backend database

---

## 3️⃣ Textual Flow Diagram

```
[Microphone / Camera Edge Device]
          │
          ▼
   [Gunshot Detection AI]
          │
          ▼
     [Backend Server]
      │       │
      │       ▼
      │   [Database / JSON]
      │
      ▼
[Socket.io Real-Time Events]
          │
          ▼
 [Frontend Dashboard React App]
          │
          ▼
     [User Actions]
          │
          ▼
     [Backend Updates]
```

---

## 4️⃣ Notes

- All interactions are **real-time** using Socket.io  
- Database layer ensures **persistent alert history**  
- Frontend provides **taskbar navigation** for easy access to dashboard, history, devices, and settings  
- Camera control and live feed placeholders simulate real edge device operation  

---

## 📄 License

For educational use only — Capstone project for UOWD.  
Do not deploy without legal and ethical compliance.
