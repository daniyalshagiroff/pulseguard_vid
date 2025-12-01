# PulseGuard Setup Guide — SETUP_GUIDE.md

This guide explains how to set up the **full PulseGuard system** (frontend + backend) on a local machine.  
It is intended for team members, examiners, or the sponsoring company to run the prototype for testing and demonstration.

---

## 📦 Prerequisites

Before starting, make sure your system has:

- **Node.js v18+** (includes npm) → [https://nodejs.org/](https://nodejs.org/)  
- **Git** → [https://git-scm.com/](https://git-scm.com/)  
- **Modern browser** (Chrome/Firefox/Edge)  
- **VS Code** or any code editor

Optional:

- Postman for API testing  
- Curl for command line API testing

---

## 🗂️ Project Structure

```
pulseguard/
│── server/       # Node.js backend
│── client/       # React frontend
│── README.md     # Root documentation
│── SETUP_GUIDE.md # This file
```

---

## 1️⃣ Clone the Project

Open terminal:

```bash
git clone <repository-url>
cd pulseguard
```

---

## 2️⃣ Backend Setup

### Step 2.1 — Navigate to backend folder

```bash
cd server
```

### Step 2.2 — Install dependencies

```bash
npm install
```

### Step 2.3 — Start server

```bash
npm start
```

The backend will run at:

```
http://localhost:4000
```

Check if `data.json` is created automatically (this is the mock database).

---

## 3️⃣ Frontend Setup

### Step 3.1 — Open a new terminal and navigate to frontend

```bash
cd client
```

### Step 3.2 — Install dependencies

```bash
npm install
```

### Step 3.3 — Start React app

```bash
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

## 4️⃣ Test Login Accounts

| Username | Password | Role    |
|----------|----------|---------|
| admin    | admin    | admin   |
| officer  | officer  | officer |

---

## 5️⃣ Simulate Alerts

You can simulate alerts using **Postman** or **curl**:

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

After sending, open the frontend dashboard to see the alert appear in real time.

---

## 6️⃣ Optional: Test Devices

The server also allows simulating device connectivity updates:

- Modify `data.json` manually for device status  
- Or send a PUT request to `/api/devices/:id`  
- Observe real-time updates on dashboard

---

## 7️⃣ Navigation Flow in Frontend

1. Login page → authenticate  
2. Dashboard → view alerts, devices, map, and live camera  
3. Alert Details → escalate, decline, or inspect  
4. History → past alerts  
5. Device Management → check connectivity  
6. Settings/Profile → adjust preferences  
7. Logout → returns to login page

Taskbar exists on all pages for smooth navigation.

---

## 8️⃣ Notes

- All alerts, camera streams, and devices are **demo placeholders**  
- Replace with real devices and sensors in production  
- Ensure backend is running before accessing frontend

---

## 9️⃣ Troubleshooting

| Problem | Solution |
|---------|---------|
| React frontend not showing | Check server running at port 4000 |
| API errors | Verify endpoints: `/api/alerts`, `/api/devices`, `/api/login` |
| Node.js not recognized | Install latest Node.js and restart terminal |

---

## 📄 License

For **educational use only** — Capstone project for UOWD.  
Do not deploy without legal approval.
