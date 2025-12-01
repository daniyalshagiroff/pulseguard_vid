# PulseGuard Architecture Overview — ARCHITECTURE_OVERVIEW.md

This document provides a **high-level overview** of the PulseGuard Real-Time Gunshot Detection & Surveillance Response System architecture.  
It describes the system layers, their responsibilities, and how they interact.

---

## 1️⃣ System Layers

| Layer                     | Description |
|----------------------------|-------------|
| **Edge Device Layer**      | Microphones and cameras deployed in the field to capture audio and video streams. Sends data to backend for processing. |
| **Detection & AI Layer**   | Gunshot detection AI analyzes audio input, classifies weapon type, and generates alert events. |
| **Backend / Business Logic Layer** | Node.js + Express server handles API requests, alert management, device management, user authentication, and real-time events via Socket.io. |
| **Database Layer**         | Stores alerts, device status, and user information. Prototype uses JSON; production may use MongoDB/PostgreSQL. |
| **Frontend / Presentation Layer** | React web app providing dashboard, taskbar navigation, live camera window, map, alert management, device status, and history. |

---

## 2️⃣ Layer Interactions

1. **Edge devices** → send audio/video → **AI detection layer**  
2. **AI detection layer** → sends alert → **backend server**  
3. **Backend server** → stores alert in **database**  
4. **Backend server** → sends **Socket.io event** → **frontend dashboard**  
5. **Frontend** → displays alert, live camera, map, device status  
6. **User interactions** → updates backend → updates database → emits Socket.io events

---

## 3️⃣ Layer Diagram (Textual)

```
[Edge Device Layer]
      │
      ▼
[Detection & AI Layer]
      │
      ▼
[Backend / Business Logic Layer] ↔ [Database Layer]
      │
      ▼
[Frontend / Presentation Layer]
      │
      ▼
[User Interactions]
```

---

## 4️⃣ Notes

- System designed for **scalability** — new devices and cameras can be added easily  
- **Real-time events** ensure alerts are processed and displayed immediately  
- Database layer ensures **persistence of alerts and history**  
- Follows **modular design** for easier maintenance and future upgrades  

---

## 📄 License

For educational use only — Capstone project for UOWD.  
Do not deploy publicly without legal and ethical compliance.
