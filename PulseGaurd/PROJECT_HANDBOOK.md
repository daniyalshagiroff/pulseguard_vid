# PulseGuard Project Handbook — PROJECT_HANDBOOK.md

This handbook provides a **complete guide** for developers, testers, examiners, and the sponsoring company for the PulseGuard Real-Time Gunshot Detection & Surveillance Response System.  

It consolidates all documentation files into one reference manual.

---

## 📂 Included Documentation

1. **README_CLIENT.md** – Frontend setup and usage  
2. **SETUP_GUIDE.md** – Step-by-step installation and local setup  
3. **DEPLOYMENT_GUIDE.md** – Local, Docker, and cloud deployment instructions  
4. **API_DOCUMENTATION.md** – Detailed backend API reference  
5. **DATA_FLOW_DIAGRAM.md** – System-wide data flow and interactions  
6. **SOCKET_EVENTS.md** – Real-time event reference for Socket.io  
7. **DEVELOPER_GUIDE.md** – Development standards, coding conventions, and extension guide  
8. **ARCHITECTURE_OVERVIEW.md** – High-level system architecture  
9. **PROJECT_HANDBOOK.md** – This consolidated manual

---

## 1️⃣ Quick Start Guide

### Step 1: Clone Project

```bash
git clone <repository-url>
cd pulseguard
```

### Step 2: Backend Setup

```bash
cd server
npm install
npm start
```

Backend runs at `http://localhost:4000`.

### Step 3: Frontend Setup

```bash
cd ../client
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

---

## 2️⃣ Project Overview

PulseGuard is a **real-time gunshot detection and surveillance response system**.  
Features include:

- AI-based gunshot detection and weapon classification  
- Real-time alert system with location and camera feed  
- Live camera window and PTZ camera control  
- Device status monitoring  
- Alert history and escalation options  
- Taskbar navigation for all pages

All incidents, devices, and footage in the prototype are **placeholders** for demonstration purposes.

---

## 3️⃣ Key System Components

| Component           | Role |
|--------------------|------|
| Edge Devices        | Capture audio and video in the field |
| AI Detection        | Gunshot detection and weapon classification |
| Backend Server      | Manage alerts, devices, user sessions, and real-time events |
| Database            | Store alerts, devices, and history |
| Frontend Dashboard  | Visualize alerts, devices, map, live cameras, and allow user interaction |
| Socket.io           | Real-time communication between backend and frontend |

---

## 4️⃣ User Flows

1. Login → Authenticate user  
2. Dashboard → View live camera, alerts, map, device status  
3. Alert Details → Escalate, decline, or inspect alerts  
4. Device Management → View and control devices  
5. History → Browse past alerts  
6. Settings/Profile → Manage preferences  
7. Logout → Return to login page

Taskbar navigation is present on all pages for consistent access.

---

## 5️⃣ Developer Notes

- Follow **DEVELOPER_GUIDE.md** for coding conventions  
- Use **mock data** for testing devices and alerts  
- Always start backend before frontend  
- Extend functionality following modular design principles

---

## 6️⃣ Deployment Notes

- Use **DEPLOYMENT_GUIDE.md** for local, Docker, Vercel, and Render deployment  
- Ensure environment variables are correctly set (`VITE_API_URL`, `PORT`)  
- Test Socket.io real-time events after deployment

---

## 7️⃣ References

- Node.js Official: [https://nodejs.org/](https://nodejs.org/)  
- React Documentation: [https://reactjs.org/docs/getting-started.html](https://reactjs.org/docs/getting-started.html)  
- Socket.io Guide: [https://socket.io/docs/](https://socket.io/docs/)  
- Docker Docs: [https://docs.docker.com/](https://docs.docker.com/)

---

## 8️⃣ License

For **educational use only** — Capstone project for UOWD.  
Do not deploy publicly without legal and ethical compliance.

---

This handbook consolidates all project information into one **easy-to-reference document**, providing developers, testers, and the sponsoring company with all the instructions, guidelines, and references needed to run, maintain, and extend the PulseGuard system.
