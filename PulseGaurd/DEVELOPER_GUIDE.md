# PulseGuard Developer Guide — DEVELOPER_GUIDE.md

This document provides guidance for developers working on the **PulseGuard Real-Time Gunshot Detection & Surveillance Response System**.  
It covers **folder structure, coding conventions, adding new pages, frontend-backend integration, and extending functionality**.

---

## 1️⃣ Folder Structure

```
pulseguard/
│── client/            # React frontend
│   ├── assets/        # Images, icons, videos
│   ├── components/    # Reusable components
│   ├── pages/         # All web pages (Dashboard, Alerts, Devices, Login)
│   ├── services/      # API calls and Socket.io events
│   ├── styles/        # CSS/SCSS files
│   ├── App.jsx        # Main React component
│   └── main.jsx       # React entry point
│── server/            # Node.js backend
│   ├── controllers/   # API route logic
│   ├── models/        # Database schemas (if using DB)
│   ├── routes/        # API route definitions
│   ├── data.json      # Prototype database
│   └── index.js       # Server entry point
│── README.md          # Root documentation
│── README_CLIENT.md   # Frontend instructions
│── README_SERVER.md   # Backend instructions
```

---

## 2️⃣ Coding Conventions

- **Frontend (React + JSX)**
  - Component names: `PascalCase` (e.g., `AlertCard.jsx`)  
  - Hooks: `camelCase` (e.g., `useDeviceStatus`)  
  - CSS classes: `kebab-case` (e.g., `.alert-card`)  
  - Function components preferred over class components

- **Backend (Node.js + Express)**
  - File names: `camelCase.js`  
  - Route handlers in `/routes`  
  - Business logic in `/controllers`  
  - Database access in `/models`  
  - Use `async/await` for async calls

- **General**
  - 2-space indentation  
  - Descriptive variable names  
  - Comments for all complex logic

---

## 3️⃣ Adding New Pages (Frontend)

1. Create a new file in `client/src/pages/` (e.g., `DeviceSettings.jsx`)  
2. Import reusable components if needed  
3. Add route in `App.jsx`:

```jsx
<Route path="/device-settings" element={<DeviceSettings />} />
```

4. Add link in the taskbar/navigation menu for accessibility

---

## 4️⃣ Connecting Frontend to Backend

- All API calls are in `client/src/services/api.js`  
- Example: Fetch alerts

```javascript
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getAlerts = async () => {
  const response = await axios.get(`${API_URL}/alerts`);
  return response.data;
};
```

- Socket.io connection:

```javascript
import { io } from "socket.io-client";
const socket = io(API_URL);
export default socket;
```

---

## 5️⃣ Extending Functionality

- **Add new device types:** Update `/server/data.json` and backend models  
- **Add new alert actions:** Extend `PUT /alerts/:id` in backend  
- **Add additional frontend pages:** Follow **Adding New Pages** procedure  
- **Integrate new AI modules:** Modify backend route to receive new events and push via Socket.io  

---

## 6️⃣ Best Practices

- Always run **backend first**, then frontend  
- Use **mock data** during development to simulate devices  
- Commit changes frequently with descriptive messages  
- Test Socket.io events after every backend change  
- Keep UI consistent with Figma design

---

## 7️⃣ Notes

- Placeholder images and videos can be replaced with real edge device feeds  
- Alert escalation workflow should match backend `status` updates  
- Taskbar must be consistent across all pages for navigation

---

## 📄 License

For educational use only — Capstone project for UOWD.  
Do not deploy publicly without legal and ethical compliance.
