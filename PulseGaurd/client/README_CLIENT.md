# PulseGuard Frontend (React) — README_CLIENT.md

This document explains the frontend web application of PulseGuard, built using React and Vite.  
It provides a real-time dashboard for monitoring gunshot alerts, devices, and camera feeds.

---

## 📁 Folder Structure

```
client/
│── public/              # Static assets (images, videos, icons)
│── src/
│   ├── assets/          # Images, logos, sample data
│   ├── components/      # Reusable React components (buttons, cards, modals)
│   ├── pages/           # Individual pages (Dashboard, Alerts, Devices, Login)
│   ├── services/        # API calls and Socket.io connections
│   ├── App.jsx          # Main React component
│   ├── main.jsx         # React entry point
│   └── styles/          # CSS or SCSS files
│── package.json          # Dependencies & scripts
│── README_CLIENT.md      # This file
```

---

## 🚀 Features

- Login system with admin/officer roles  
- Dashboard with live camera window, device connectivity, alerts, and map  
- Alerts history with filter options  
- Device management page  
- Settings/profile page  
- Real-time updates via Socket.io  
- Figma-based UI design  
- Placeholder data for incidents, devices, and camera footage

---

## 🛠️ Installation

```bash
cd client
npm install
npm run dev
```

Runs at: **http://localhost:5173**

---

## 🧩 API Connections

All frontend data is fetched from **backend server** at:

```
http://localhost:4000/api/
```

Endpoints used:

- `/alerts` → Fetch and update alerts  
- `/devices` → Fetch device status and control  
- `/login` → Authenticate user  

Real-time updates via Socket.io:

- `new-alert` → A new alert triggered  
- `update-alert` → Alert status changed  
- `device-update` → Device status updated

---

## 🔄 Navigation Flow

1. **Login Page** → authenticate user  
2. **Dashboard** → default landing page for all roles  
3. **Alert Details Page** → inspect or escalate alerts  
4. **Device Management Page** → view/edit device connectivity  
5. **History Page** → past alerts  
6. **Settings/Profile Page** → update preferences  
7. **Logout** → back to login page

**Taskbar** present on all pages for easy navigation.

---

## 📄 Notes

- All videos, camera feeds, and incidents are **demo placeholders**  
- Replace with real edge device data in production  
- UI design follows Figma template: [Figma Link](https://www.figma.com/design/QFA5zVWEoRkfmjkZ6i4FCN/PulseGuard--Copy-2-?node-id=0-1&t=c9hawT0fQVrbJ0T1-1)

---

## 📄 License

For **educational use only** — Capstone project for UOWD.  
Do not deploy without approval and compliance.
