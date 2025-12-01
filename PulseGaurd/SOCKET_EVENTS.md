# PulseGuard Socket.io Events — SOCKET_EVENTS.md

This document provides a detailed reference of all **real-time events** transmitted via Socket.io between the **backend server** and **frontend dashboard** in PulseGuard.  

---

## 1️⃣ Event List

| Event Name       | Direction       | Description |
|-----------------|----------------|-------------|
| `new-alert`      | Backend → Frontend | Fired when a new gunshot alert is created. Includes alert ID, type, weapon, location, confidence, camera ID, and timestamp. |
| `update-alert`   | Backend → Frontend | Fired when an alert’s status is updated (e.g., active → escalated). Includes alert ID and new status. |
| `device-update`  | Backend → Frontend | Fired when a device status changes (e.g., online/offline). Includes device ID, type, status, and location. |
| `ack-alert`      | Frontend → Backend | Frontend acknowledges receipt of an alert. Includes alert ID and user ID. |
| `control-camera` | Frontend → Backend | Request to adjust PTZ camera or view camera feed. Includes camera ID and action. |
| `login-event`    | Frontend → Backend | Sent when a user logs in. Includes username and role. |
| `logout-event`   | Frontend → Backend | Sent when a user logs out. Includes username and timestamp. |

---

## 2️⃣ Event Details

### **`new-alert`**
**Payload Example:**
```json
{
  "id": 101,
  "type": "gunshot",
  "weapon": "rifle",
  "confidence": 0.95,
  "status": "active",
  "location": { "lat": 25.2048, "lng": 55.2708 },
  "cameraId": "CAM-01",
  "timestamp": "2025-11-16T12:05:00Z"
}
```

**Frontend Action:**  
- Display alert on dashboard, map, and live camera window  
- Add to active alerts list

---

### **`update-alert`**
**Payload Example:**
```json
{
  "id": 101,
  "status": "escalated"
}
```

**Frontend Action:**  
- Update alert status in dashboard UI  
- Notify officer/admin if needed

---

### **`device-update`**
**Payload Example:**
```json
{
  "id": "CAM-01",
  "type": "camera",
  "status": "online",
  "location": { "lat": 25.2048, "lng": 55.2708 }
}
```

**Frontend Action:**  
- Update device connectivity indicators  
- Highlight offline devices

---

### **`ack-alert`**
**Payload Example:**
```json
{
  "alertId": 101,
  "userId": "officer1"
}
```

**Backend Action:**  
- Mark alert as acknowledged in database  
- Optional: log which officer acknowledged

---

### **`control-camera`**
**Payload Example:**
```json
{
  "cameraId": "CAM-01",
  "action": "pan-left"
}
```

**Backend Action:**  
- Send PTZ command to camera (simulated in prototype)  
- Return confirmation to frontend

---

### **`login-event` & `logout-event`**
**Payload Example:**
```json
{
  "username": "admin",
  "role": "admin"
}
```

**Backend Action:**  
- Authenticate user  
- Track user sessions

---

## 3️⃣ Notes

- All events are **JSON-formatted**  
- Socket.io ensures **real-time bidirectional communication**  
- Events can be extended for future edge device features (e.g., gunshot audio recording, AI weapon classification)  
- Frontend must handle **disconnect/reconnect** scenarios to maintain live updates

---

## 📄 License

For educational use only — Capstone project for UOWD.  
Do not deploy publicly without legal and ethical compliance.
