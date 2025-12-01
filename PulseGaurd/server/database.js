const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

async function openDb() {
  return open({
    filename: path.join(__dirname, 'pulseguard.db'),
    driver: sqlite3.Database
  });
}

const HASH_PREFIX = 'scrypt';
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${HASH_PREFIX}:${salt}:${derived}`;
}

function isHashed(value) {
  return typeof value === 'string' && value.startsWith(`${HASH_PREFIX}:`);
}

async function initDb() {
  const db = await openDb();

  // Users
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE,
      password_hash TEXT,
      role TEXT,
      name TEXT,
      full_name TEXT,
      created_at TEXT
    )
  `);

  // Alerts
  await db.exec(`
    CREATE TABLE IF NOT EXISTS alerts (
      id TEXT PRIMARY KEY,
      timestamp TEXT,
      type TEXT,
      weapon TEXT,
      confidence REAL,
      status TEXT,
      location_lat REAL,
      location_lng REAL,
      camera_id TEXT,
      video_url TEXT,
      snapshot TEXT,
      notes TEXT,
      escalated_by TEXT,
      escalated_by_name TEXT
    )
  `);

  // Devices
  await db.exec(`
    CREATE TABLE IF NOT EXISTS devices (
      id TEXT PRIMARY KEY,
      type TEXT,
      name TEXT,
      status TEXT,
      last_seen TEXT
    )
  `);

  // Seed devices from legacy data.json if table is empty
  const deviceCount = await db.get('SELECT COUNT(*) AS c FROM devices');
  if (deviceCount && deviceCount.c === 0) {
    try {
      const legacyPath = path.join(__dirname, 'data.json');
      const legacyRaw = fs.readFileSync(legacyPath, 'utf8');
      const legacy = JSON.parse(legacyRaw);
      const devices = Array.isArray(legacy?.devices) ? legacy.devices : [];

      for (const d of devices) {
        await db.run(
          'INSERT INTO devices (id, type, name, status, last_seen) VALUES (?, ?, ?, ?, ?)',
          d.id,
          d.type || null,
          d.name || null,
          d.status || null,
          d.lastSeen || new Date().toISOString()
        );
      }
      if (devices.length) {
        console.log(`[db] Seeded ${devices.length} devices from data.json`);
      }
    } catch (err) {
      console.error('[db] Failed to seed devices from data.json:', err.message);
    }
  }

  // Migration: alerts columns
  const alertCols = await db.all("PRAGMA table_info('alerts')");
  if (!alertCols.some(c => c.name === 'snapshot')) {
    try {
      await db.exec('ALTER TABLE alerts ADD COLUMN snapshot TEXT');
      console.log('[db] Added snapshot column to alerts');
    } catch (err) {
      console.error('[db] Failed to add snapshot column to alerts:', err.message);
    }
  }
  if (!alertCols.some(c => c.name === 'escalated_by')) {
    try {
      await db.exec('ALTER TABLE alerts ADD COLUMN escalated_by TEXT');
      console.log('[db] Added escalated_by column to alerts');
    } catch (err) {
      console.error('[db] Failed to add escalated_by column to alerts:', err.message);
    }
  }
  if (!alertCols.some(c => c.name === 'escalated_by_name')) {
    try {
      await db.exec('ALTER TABLE alerts ADD COLUMN escalated_by_name TEXT');
      console.log('[db] Added escalated_by_name column to alerts');
    } catch (err) {
      console.error('[db] Failed to add escalated_by_name column to alerts:', err.message);
    }
  }

  // Migration: users columns (drop avatar_url, ensure name/full_name)
  const userCols = await db.all("PRAGMA table_info('users')");
  if (!userCols.some(c => c.name === 'name')) {
    try {
      await db.exec('ALTER TABLE users ADD COLUMN name TEXT');
      console.log('[db] Added name column to users');
    } catch (err) {
      console.error('[db] Failed to add name column to users:', err.message);
    }
  }
  if (!userCols.some(c => c.name === 'full_name')) {
    try {
      await db.exec('ALTER TABLE users ADD COLUMN full_name TEXT');
      console.log('[db] Added full_name column to users');
    } catch (err) {
      console.error('[db] Failed to add full_name column to users:', err.message);
    }
  }
  if (userCols.some(c => c.name === 'avatar_url')) {
    try {
      await db.exec('ALTER TABLE users DROP COLUMN avatar_url');
      console.log('[db] Dropped avatar_url column from users');
    } catch (err) {
      console.error('[db] Failed to drop avatar_url column from users:', err.message);
    }
  }

  // Seed admin and officers (with fixed avatar handled on frontend)
  const admin = await db.get('SELECT * FROM users WHERE username = ?', 'admin');
  if (!admin) {
    const hashed = hashPassword('admin');
    await db.run(
      'INSERT INTO users (id, username, password_hash, role, name, full_name, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      'u-1',
      'admin',
      hashed,
      'admin',
      'Daniyal Shagirov',
      'Daniyal Shagirov',
      new Date().toISOString()
    );
    console.log('User "admin" created.');
  } else if (!isHashed(admin.password_hash)) {
    const hashed = hashPassword(admin.password_hash || 'admin');
    await db.run('UPDATE users SET password_hash = ? WHERE username = ?', hashed, 'admin');
    console.log('User "admin" password migrated to hashed.');
  }
  await db.run(
    'UPDATE users SET full_name = COALESCE(full_name, name, username), name = COALESCE(name, full_name, username) WHERE username = ?',
    'admin'
  );
  await db.run(
    'UPDATE users SET name = ?, full_name = ? WHERE username = ?',
    'Daniyal Shagirov',
    'Daniyal Shagirov',
    'admin'
  );

  const officer1 = await db.get('SELECT * FROM users WHERE username = ?', 'admin1');
  if (!officer1) {
    const hashed = hashPassword('admin1');
    await db.run(
      'INSERT INTO users (id, username, password_hash, role, name, full_name, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      'u-2',
      'admin1',
      hashed,
      'officer',
      'Mikhail Migalenko',
      'Mikhail Migalenko',
      new Date().toISOString()
    );
    console.log('User "admin1" created.');
  }
  await db.run(
    'UPDATE users SET full_name = COALESCE(full_name, name, username), name = COALESCE(name, full_name, username) WHERE username = ?',
    'admin1'
  );
  await db.run(
    'UPDATE users SET name = ?, full_name = ? WHERE username = ?',
    'Mikhail Migalenko',
    'Mikhail Migalenko',
    'admin1'
  );

  const officer2 = await db.get('SELECT * FROM users WHERE username = ?', 'admin2');
  if (!officer2) {
    const hashed = hashPassword('admin2');
    await db.run(
      'INSERT INTO users (id, username, password_hash, role, name, full_name, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      'u-3',
      'admin2',
      hashed,
      'officer',
      'Yasmina Kurakova',
      'Yasmina Kurakova',
      new Date().toISOString()
    );
    console.log('User "admin2" created.');
  }
  await db.run(
    'UPDATE users SET full_name = COALESCE(full_name, name, username), name = COALESCE(name, full_name, username) WHERE username = ?',
    'admin2'
  );
  await db.run(
    'UPDATE users SET name = ?, full_name = ? WHERE username = ?',
    'Yasmina Kurakova',
    'Yasmina Kurakova',
    'admin2'
  );
}

initDb().then(() => console.log('DB initialized (SQLite)'));

module.exports = { openDb, hashPassword, isHashed };
