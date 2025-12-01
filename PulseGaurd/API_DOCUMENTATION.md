# PulseGuard API Documentation — API_DOCUMENTATION.md

This document provides detailed information about all backend **API endpoints** for the PulseGuard Real-Time Gunshot Detection & Surveillance Response System.  
It includes request methods, parameters, responses, and examples.

---

## 🌐 Base URL

```
http://localhost:4000/api
```

---

## 1️⃣ Authentication API

### **POST /login**

Authenticate users (admin or officer).

**Request:**

```json
{
  "username": "admin",
  "password": "admin"
}
```

**Response (Success):**

```json
{
  "status": "success",
  "user": {
    "username": "admin",
    "role": "admin"
  },
  "token": "<jwt-token>"
}
```

**Response (Failure):**

```json
{
  "status": "error",
  "message": "Invalid credentials"
}
```

**Notes:**  
- JWT token can be used for session handling (future upgrade)  
- Roles: `admin` | `officer`

---

## 2️⃣ Alerts API

### **GET /alerts**

Retrieve all alerts.

**Response:**

```json
[
  {
    "id": 1,
    "type": "gunshot",
    "weapon": "handgun",
    "confidence": 0.92,
    "status": "active",
    "location": { "lat": 25.20, "lng": 55.27 },
    "cameraId": "CAM-01",
    "timestamp": "2025-11-16T12:00:00Z"
  }
]
```

---

### **POST /alerts**

Create a new alert.

**Request:**

```json
{
  "type": "gunshot",
  "weapon": "rifle",
  "confidence": 0.91,
  "status": "active",
  "location": { "lat": 25.2048, "lng": 55.2708 },
  "cameraId": "CAM-01",
  "snapshot": null
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Alert created",
  "alert": {
    "id": 2,
    "type": "gunshot",
    "weapon": "rifle",
    "status": "active",
    "location": { "lat": 25.2048, "lng": 55.2708 },
    "cameraId": "CAM-01",
    "timestamp": "2025-11-16T12:05:00Z"
  }
}
```

---

### **PUT /alerts/:id**

Update an alert (e.g., escalate, decline, or change status).

**Request:**

```json
{
  "status": "escalated"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Alert updated",
  "alert": {
    "id": 2,
    "type": "gunshot",
    "weapon": "rifle",
    "status": "escalated"
  }
}
```

---

## 3️⃣ Devices API

### **GET /devices**

Retrieve all devices with their connectivity status.

**Response:**

```json
[
  {
    "id": "CAM-01",
    "type": "camera",
    "status": "online",
    "location": { "lat": 25.2048, "lng": 55.2708 }
  },
  {
    "id": "MIC-01",
    "type": "microphone",
    "status": "offline",
    "location": { "lat": 25.2049, "lng": 55.2710 }
  }
]
```

---

### **PUT /devices/:id**

Update a device (e.g., online/offline or rename).

**Request:**

```json
{
  "status": "online"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Device updated",
  "device": {
    "id": "MIC-01",
    "status": "online"
  }
}
```

---

## 4️⃣ Notes on API Usage

- All POST/PUT requests must include **Content-Type: application/json**  
- IDs are auto-generated for alerts  
- Device IDs are predefined (CAM-01, MIC-01, etc.)  
- All responses include a `status` and `message` field for clarity

---

## 5️⃣ Real-Time Integration

- **Socket.io Events:**
  - `new-alert` → Sent when an alert is created  
  - `update-alert` → Sent when alert status changes  
  - `device-update` → Sent when a device status changes

**Frontend can listen to these events to update dashboard in real time.**

---

## 📄 License

For educational use only — Capstone project for UOWD.  
Do not deploy publicly without legal and ethical approval.
