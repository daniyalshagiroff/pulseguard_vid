// server/index.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { Server } = require('socket.io');
const cors = require('cors');
const multer = require('multer'); // НУЖНО для загрузки файлов
const { openDb } = require('./database');

// --- 1. Настройка папки для фото (Snapshots) ------------------
const snapshotDir = path.join(__dirname, 'public/snapshots');
if (!fs.existsSync(snapshotDir)) {
  fs.mkdirSync(snapshotDir, { recursive: true });
}

// --- 2. Настройка Multer (Загрузчик файлов) -------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Сохраняем в public/snapshots, чтобы Nginx мог их раздавать
    cb(null, 'public/snapshots/'); 
  },
  filename: (req, file, cb) => {
    // Генерируем уникальное имя: snap-123456789.jpg
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, 'snap-' + Date.now() + ext);
  }
});
const upload = multer({ storage: storage });

// --- Telegram integration (Optional) --------------------------
let notifyEscalation = null;
try {
  ({ notifyEscalation } = require('./telegramBot'));
  console.log('[server] Telegram bot integration loaded');
} catch (e) {
  console.log('[server] Telegram bot not enabled');
}
// --------------------------------------------------------------

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// Раздаем статику (чтобы /snapshots/... работало и без Nginx локально)
app.use('/snapshots', express.static(path.join(__dirname, 'public/snapshots')));
app.use(express.static(path.join(__dirname, 'public')));

// ---------- HELPERS --------------

function toAlert(row) {
  if (!row) return null;
  const { location_lat, location_lng, camera_id, video_url, escalated_by, escalated_by_name, ...rest } = row;
  return {
    ...rest,
    officer: escalated_by_name || null,
    escalatedBy: escalated_by || null,
    cameraId: camera_id ?? null,
    // Фронтенд ждет поле 'snapshot', а в базе оно может называться 'video_url'
    snapshot: video_url ?? null, 
    location:
      typeof location_lat === 'number' && typeof location_lng === 'number'
        ? { lat: location_lat, lng: location_lng }
        : null
  };
}

function toDevice(row) {
  if (!row) return null;
  const { last_seen, ...rest } = row;
  return { ...rest, lastSeen: last_seen };
}

// Password helpers (scrypt)
const HASH_PREFIX = 'scrypt';
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${HASH_PREFIX}:${salt}:${derived}`;
}

function verifyPassword(password, stored) {
  if (!stored) return false;
  if (!stored.startsWith(`${HASH_PREFIX}:`)) {
    return stored === password;
  }
  const parts = stored.split(':');
  if (parts.length !== 3) return false;
  const [, salt, hash] = parts;
  const derived = crypto.scryptSync(password, salt, 64);
  try {
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), derived);
  } catch {
    return false;
  }
}

// ---------------- REST endpoints -------------------------------

// GET Alerts
app.get('/api/alerts', async (req, res) => {
  try {
    const db = await openDb();
    const rows = await db.all(
      'SELECT * FROM alerts ORDER BY datetime(timestamp) DESC'
    );
    res.json(rows.map(toAlert));
  } catch (err) {
    console.error('[server] failed to fetch alerts:', err);
    res.status(500).json({ status: 'error', message: 'Failed to load alerts' });
  }
});

// POST Alert (С поддержкой ФАЙЛА snapshotFile)
app.post('/api/alerts', upload.single('snapshotFile'), async (req, res) => {
  try {
    const db = await openDb();
    
    // 1. Формируем ссылку на файл (если он пришел)
    // Nginx настроен отдавать файлы из /snapshots/
    const snapshotUrl = req.file ? `/snapshots/${req.file.filename}` : null;

    const id = 'A-' + Math.floor(Math.random() * 90000 + 10000);
    // Берем timestamp из запроса или текущий
    const timestamp = req.body.timestamp || new Date().toISOString();
    
    // 2. Читаем данные (с защитой от null)
    const {
      type = 'unknown',
      weapon = 'unknown',
      confidence = 0,
      status = 'active',
      cameraId = 'unknown',
      notes = ''
    } = req.body;

    // 3. Умное чтение координат (принимаем и плоские lat/lng, и вложенные location)
    let lat = req.body.location_lat;
    let lng = req.body.location_lng;

    if (!lat && req.body.location) {
        if (typeof req.body.location === 'string') {
             try {
                 const parsed = JSON.parse(req.body.location);
                 lat = parsed.lat;
                 lng = parsed.lng;
             } catch(e) {}
        } else {
             lat = req.body.location.lat;
             lng = req.body.location.lng;
        }
    }

    // 4. Запись в БД
    await db.run(
      `INSERT INTO alerts (id, timestamp, type, weapon, confidence, status, location_lat, location_lng, camera_id, video_url, snapshot, notes, escalated_by, escalated_by_name)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id,
      timestamp,
      type,
      weapon,
      confidence,
      status,
      lat || 0,
      lng || 0,
      cameraId,
      snapshotUrl, // Сохраняем в video_url (как основную ссылку)
      snapshotUrl, // Дублируем в snapshot для надежности (если структура БД позволяет)
      notes,
      null,
      null
    );

    // 5. Формируем объект для отправки на фронт
    const newAlert = {
      id,
      timestamp,
      type,
      weapon,
      confidence,
      status,
      location: { lat: Number(lat), lng: Number(lng) },
      cameraId,
      snapshot: snapshotUrl, 
      notes,
      officer: null,
      escalatedBy: null
    };

    io.emit('new-alert', newAlert);

    res.status(201).json({
      status: 'success',
      message: 'Alert created',
      alert: newAlert
    });
  } catch (err) {
    console.error('[server] failed to create alert:', err);
    res.status(500).json({ status: 'error', message: 'Failed to create alert' });
  }
});

// PUT/PATCH Update Alert
async function updateAlertHandler(req, res) {
  try {
    const db = await openDb();
    const id = req.params.id;
    const existing = await db.get('SELECT * FROM alerts WHERE id = ?', id);
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Not found' });
    }

    const { status, notes, snapshot, escalatedBy, escalatedByName } = req.body || {};
    const nextStatus = status || existing.status;
    const nextNotes = notes ?? existing.notes;
    const nextSnapshot = 'snapshot' in (req.body || {}) ? snapshot : existing.video_url; // берем video_url как snapshot
    const nextEscalatedBy = 'escalatedBy' in (req.body || {}) ? escalatedBy : existing.escalated_by;
    const nextEscalatedByName = 'escalatedByName' in (req.body || {}) ? escalatedByName : existing.escalated_by_name;

    await db.run(
      'UPDATE alerts SET status = ?, notes = ?, video_url = ?, escalated_by = ?, escalated_by_name = ? WHERE id = ?',
      nextStatus,
      nextNotes,
      nextSnapshot, // обновляем ссылку
      nextEscalatedBy,
      nextEscalatedByName,
      id
    );

    const row = await db.get('SELECT * FROM alerts WHERE id = ?', id);
    const updated = toAlert(row);

    io.emit('update-alert', updated);

    // Telegram notify
    if (notifyEscalation && status === 'escalated' && existing.status !== 'escalated') {
      notifyEscalation(updated).catch(err =>
        console.error('[server] notifyEscalation failed:', err.message)
      );
    }

    res.json({
      status: 'success',
      message: 'Alert updated',
      alert: updated
    });
  } catch (err) {
    console.error('[server] failed to update alert:', err);
    res.status(500).json({ status: 'error', message: 'Failed to update alert' });
  }
}

app.put('/api/alerts/:id', updateAlertHandler);
app.patch('/api/alerts/:id', updateAlertHandler);

// Devices Endpoints

app.get('/api/devices', async (req, res) => {
  try {
    const db = await openDb();
    const devices = await db.all('SELECT * FROM devices');
    res.json(devices.map(toDevice));
  } catch (err) {
    console.error('[server] failed to fetch devices:', err);
    res.status(500).json({ status: 'error', message: 'Failed to load devices' });
  }
});

app.put('/api/devices/:id', async (req, res) => {
  try {
    const db = await openDb();
    const id = req.params.id;
    const existing = await db.get('SELECT * FROM devices WHERE id = ?', id);
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Not found' });
    }

    const updated = { ...existing, ...req.body, last_seen: new Date().toISOString() };

    await db.run(
      'UPDATE devices SET type = ?, name = ?, status = ?, last_seen = ? WHERE id = ?',
      updated.type, updated.name, updated.status, updated.last_seen, id
    );

    const dbDevice = await db.get('SELECT * FROM devices WHERE id = ?', id);
    const shaped = toDevice(dbDevice);
    io.emit('device-update', shaped);

    res.json({ status: 'success', message: 'Device updated', device: shaped });
  } catch (err) {
    console.error('[server] failed to update device:', err);
    res.status(500).json({ status: 'error', message: 'Failed to update device' });
  }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const db = await openDb();
    const user = await db.get('SELECT * FROM users WHERE username = ?', username);
    if (user && password && verifyPassword(password, user.password_hash)) {
      if (!user.password_hash.startsWith(`${HASH_PREFIX}:`)) {
        const hashed = hashPassword(password);
        await db.run('UPDATE users SET password_hash = ? WHERE username = ?', hashed, username);
      }
      return res.json({
        status: 'success',
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          name: user.name || user.username,
          fullName: user.full_name || user.name || user.username,
          avatarUrl: user.avatar_url || null
        },
        token: 'fake-jwt-token'
      });
    }
    res.status(401).json({ status: 'error', message: 'Invalid credentials' });
  } catch (err) {
    console.error('[server] login failed:', err);
    res.status(500).json({ status: 'error', message: 'Login failed' });
  }
});

io.on('connection', (socket) => {
  console.log('Socket connected', socket.id);
  socket.on('ping', (msg) => socket.emit('pong', msg));
});

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () =>
  console.log(`PulseGuard Backend is running on internal port ${PORT}`)
);