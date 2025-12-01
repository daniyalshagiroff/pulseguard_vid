# PulseGuard Deployment Guide — DEPLOYMENT_GUIDE.md

This guide explains how to deploy the PulseGuard Real-Time Gunshot Detection & Surveillance Response System to different environments: **local machine**, **Docker**, and **cloud platforms** (Vercel + Render).

---

## 📦 Prerequisites

- Node.js v18+ (includes npm) → [https://nodejs.org/](https://nodejs.org/)  
- Git → [https://git-scm.com/](https://git-scm.com/)  
- Docker Desktop (optional) → [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)  
- Vercel account → [https://vercel.com/](https://vercel.com/)  
- Render account → [https://render.com/](https://render.com/)  

---

## 1️⃣ Local Deployment

### Step 1.1 — Clone repository

```bash
git clone <repository-url>
cd pulseguard
```

### Step 1.2 — Backend

```bash
cd server
npm install
npm start
```

- Runs at: http://localhost:4000

### Step 1.3 — Frontend

```bash
cd ../client
npm install
npm run dev
```

- Runs at: http://localhost:5173  

**Note:** Backend must run before frontend for real-time updates.

---

## 2️⃣ Docker Deployment (Optional)

### Step 2.1 — Create Dockerfile for backend

`server/Dockerfile`:

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
```

### Step 2.2 — Create Dockerfile for frontend

`client/Dockerfile`:

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]
```

### Step 2.3 — Build and run containers

```bash
# Backend
cd server
docker build -t pulseguard-backend .
docker run -p 4000:4000 pulseguard-backend

# Frontend
cd ../client
docker build -t pulseguard-frontend .
docker run -p 5173:5173 pulseguard-frontend
```

- Access frontend at: http://localhost:5173  
- Backend at: http://localhost:4000  

---

## 3️⃣ Cloud Deployment

### **Option A: Vercel (Frontend)**

1. Sign in to [Vercel](https://vercel.com/)  
2. Click “New Project” → Import GitHub repository  
3. Set **Build Command:** `npm run build`  
4. Set **Output Directory:** `dist`  
5. Deploy  

Frontend URL will be provided by Vercel.  
Make sure to update backend URL in `client/src/services/api.js`.

### **Option B: Render (Backend)**

1. Sign in to [Render](https://render.com/)  
2. Click “New Web Service” → Connect GitHub repository  
3. Set **Start Command:** `npm start`  
4. Set **Environment:** Node 18+  
5. Deploy  

Render URL will be used by frontend for API requests.

---

## 4️⃣ Environment Variables

- Backend: `PORT=4000` (default)  
- Frontend: `VITE_API_URL=http://localhost:4000` (or deployed backend URL)  

Ensure frontend points to the correct backend URL.

---

## 5️⃣ Testing After Deployment

- Access frontend URL  
- Log in as `admin/admin` or `officer/officer`  
- Trigger test alerts (Postman or curl)  
- Verify real-time updates, map, and live camera window  

---

## 6️⃣ Notes

- All camera streams and alerts are placeholders  
- Replace with real devices and streams in production  
- Secure backend with HTTPS and authentication before public deployment  

---

## 📄 License

For educational use only — Capstone project for UOWD.  
Do not deploy publicly without legal compliance and ethical approval.
