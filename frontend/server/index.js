'use strict';

/**
 * API server  -  run from the frontend directory: npm run dev:api
 * Loads `frontend/.env` only (via dotenv). Next.js may still use `.env.local` for the app.
 * Serves static files from frontend/public.
 */

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

const frontendRoot = path.join(__dirname, '..');
dotenv.config({ path: path.join(frontendRoot, '.env') });

const { collectionNameForSlug } = require('./lib/categoryCollections');

function safeEqualString(a, b) {
  const x = Buffer.from(String(a), 'utf8');
  const y = Buffer.from(String(b), 'utf8');
  if (x.length !== y.length) return false;
  return crypto.timingSafeEqual(x, y);
}

function displayNameFromEmailNorm(emailNorm) {
  const localPart = String(emailNorm).split('@')[0] || 'admin';
  return localPart.length > 0
    ? localPart.charAt(0).toUpperCase() + localPart.slice(1)
    : 'Admin';
}

/** Comma- or semicolon-separated admin emails from env (trimmed, lowercased). */
function getAdminEmailsFromEnv() {
  return String(process.env.ADMIN_EMAIL || '')
    .split(/[,;]/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function envPasswordPlain() {
  const p = process.env.ADMIN_PASSWORD;
  if (p == null || p === '') return '';
  return String(p).trim().replace(/\r/g, '');
}

/** Only this email gets role `admin`; everyone else who logs in gets `faculty`. */
function getAdminRoleEmail() {
  return String(process.env.ADMIN_ROLE_EMAIL || 'karthika@ssn.edu.in')
    .trim()
    .toLowerCase();
}

function resolveMongoUri() {
  if (process.env.MONGO_URI) return process.env.MONGO_URI;
  const base = process.env.MONGODB_URI;
  const user = process.env.MONGODB_USERNAME;
  const pass = process.env.MONGODB_PASSWORD;
  if (!base || !user || !pass) return null;
  const m = String(base).match(/^mongodb\+srv:\/\/([^/?]+)\/?(.*)$/i);
  if (!m) return null;
  const host = m[1];
  const pathAndQuery = m[2] || '';
  const u = encodeURIComponent(user);
  const p = encodeURIComponent(pass);
  return `mongodb+srv://${u}:${p}@${host}/${pathAndQuery}`;
}

const app = express();
const PORT = process.env.PORT || 3001;

const mongoUri = resolveMongoUri();
const dbName =
  process.env.DB_NAME || process.env.MONGODB_DB_NAME || 'mdb';
const adminEmailsList = getAdminEmailsFromEnv();
const ADMIN_EMAIL_SET = new Set(adminEmailsList);
/** First email in ADMIN_EMAIL used for one-time DB seed when no user exists. */
const primaryAdminEmail = adminEmailsList[0] || '';
const adminRoleEmail = getAdminRoleEmail();

function roleForEmail(emailNorm) {
  const e = String(emailNorm || '')
    .trim()
    .toLowerCase();
  return e === adminRoleEmail ? 'admin' : 'faculty';
}

const appsScriptUrl =
  process.env.APPS_SCRIPT_URL ||
  process.env.GOOGLE_APPS_SCRIPT_URL ||
  process.env.APP_SCRIPT_URL;

if (!mongoUri) {
  console.error(
    'Missing MongoDB config: set MONGO_URI, or MONGODB_URI + MONGODB_USERNAME + MONGODB_PASSWORD'
  );
  process.exit(1);
}

const client = new MongoClient(mongoUri);
let db;

async function connectDb() {
  if (!db) {
    await client.connect();
    db = client.db(dbName);
  }
  return db;
}

/** User-facing message; full error logged server-side. */
function errorMessageForActivitySave(err) {
  const m = String(err?.message || err || '');
  if (/MongoNetworkError|ECONNREFUSED|ENOTFOUND|connection.*closed|Server selection timed out/i.test(m)) {
    return 'Could not connect to the database. Try again in a moment.';
  }
  if (/BSON|larger than maximum|maximum allowed BSON|document too large|17419/i.test(m)) {
    return 'One or more attachments are too large. Use smaller files or remove large attachments.';
  }
  if (/E11000|duplicate key/i.test(m)) {
    return 'This entry already exists.';
  }
  if (process.env.NODE_ENV !== 'production' && m) return m;
  return 'Could not save your entry. Try again.';
}

const ACTIVITIES_JSON_LIMIT = '100mb';
const jsonSmall = bodyParser.json({ limit: '100kb' });

app.use(cors({ origin: true }));

app.post(
  '/api/activities',
  bodyParser.json({ limit: ACTIVITIES_JSON_LIMIT }),
  async (req, res) => {
    try {
      const body = req.body || {};
      const slug = body.slug;
      if (!slug || typeof slug !== 'string') {
        return res.status(400).json({ error: 'Invalid form. Refresh the page and try again.' });
      }
      const collectionName = collectionNameForSlug(slug);
      const database = await connectDb();
      const col = database.collection(collectionName);
      const doc = {
        ...body,
        receivedAt: new Date().toISOString(),
      };
      const result = await col.insertOne(doc);

      let forwarded = false;
      if (appsScriptUrl) {
        try {
          const r = await fetch(appsScriptUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(doc),
          });
          forwarded = r.ok;
        } catch (e) {
          console.error('Apps Script forward failed:', e.message);
        }
      }

      res.status(201).json({
        ok: true,
        insertedId: result.insertedId,
        collection: collectionName,
        forwardedToSheet: forwarded,
        googleAppsScript: { ok: forwarded },
      });
    } catch (err) {
      console.error('POST /api/activities:', err);
      res.status(500).json({ error: errorMessageForActivitySave(err) });
    }
  }
);

console.log(
  `[API] Activities upload limit ${ACTIVITIES_JSON_LIMIT}; small JSON routes 100kb.`
);

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/sign_up', jsonSmall, async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    const emailNorm = String(email || '')
      .trim()
      .toLowerCase();
    if (!name || !emailNorm || !password) {
      return res.status(400).json({ error: 'name, email, password required' });
    }
    const database = await connectDb();
    const users = database.collection('users');
    const existing = await users.findOne({ email: emailNorm });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const passwordHash = await bcrypt.hash(String(password), 10);
    await users.insertOne({
      name: String(name).trim(),
      email: emailNorm,
      passwordHash,
      createdAt: new Date(),
    });
    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.post('/login', jsonSmall, async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const emailNorm = String(email || '')
      .trim()
      .toLowerCase();
    if (!emailNorm || !password) {
      return res.status(400).json({ error: 'email and password required' });
    }
    const adminPasswordEnv = envPasswordPlain();

    if (
      ADMIN_EMAIL_SET.size > 0 &&
      adminPasswordEnv &&
      ADMIN_EMAIL_SET.has(emailNorm) &&
      safeEqualString(String(password).trim(), adminPasswordEnv)
    ) {
      const database = await connectDb();
      const users = database.collection('users');
      const hash = await bcrypt.hash(String(password), 10);
      const displayName = displayNameFromEmailNorm(emailNorm);
      await users.updateOne(
        { email: emailNorm },
        {
          $set: {
            name: displayName,
            email: emailNorm,
            passwordHash: hash,
          },
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true }
      );
      const role = roleForEmail(emailNorm);
      return res.json({
        ok: true,
        role,
        user: { name: displayName, email: emailNorm },
      });
    }

    const database = await connectDb();
    const users = database.collection('users');
    const user = await users.findOne({ email: emailNorm });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const match = await bcrypt.compare(String(password), user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const role = roleForEmail(emailNorm);
    return res.json({
      ok: true,
      role,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.get('/collections', async (req, res) => {
  try {
    const database = await connectDb();
    const names = await database.listCollections().toArray();
    const collectionNames = names.map((c) => c.name).sort();
    const collections = [];
    for (const name of collectionNames) {
      const col = database.collection(name);
      const count = await col.countDocuments();
      collections.push({ name, count });
    }
    res.json({ collections });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list collections' });
  }
});

app.get('/fetchall', async (req, res) => {
  try {
    const database = await connectDb();
    const names = await database.listCollections().toArray();
    const out = {};
    for (const { name } of names) {
      if (name === 'users') continue;
      const col = database.collection(name);
      const docs = await col.find({}).sort({ _id: -1 }).limit(500).toArray();
      out[name] = docs;
    }
    res.json(out);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
});

app.get('/fetch-data', async (req, res) => {
  try {
    const collectionName = req.query.collection;
    if (!collectionName || typeof collectionName !== 'string') {
      return res.status(400).json({ error: 'collection query param required' });
    }
    const safeName = collectionName.replace(/[^a-zA-Z0-9_-]/g, '');
    if (safeName !== collectionName) {
      return res.status(400).json({ error: 'Invalid collection name' });
    }
    const database = await connectDb();
    const col = database.collection(safeName);
    const docs = await col.find({}).sort({ _id: -1 }).limit(1000).toArray();
    res.json({ collection: safeName, count: docs.length, data: docs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

const publicFrontend = path.join(frontendRoot, 'public');
if (fs.existsSync(publicFrontend)) {
  app.use(express.static(publicFrontend));
}

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  if (
    err &&
    (err.type === 'entity.too.large' ||
      err.status === 413 ||
      err.statusCode === 413 ||
      err.name === 'PayloadTooLargeError')
  ) {
    return res.status(413).json({
      error:
        'This submission is too large. Try smaller files, fewer attachments, or split into two submissions.',
    });
  }
  next(err);
});

async function resolveAdminPasswordHash() {
  if (process.env.ADMIN_PASSWORD_HASH) {
    return String(process.env.ADMIN_PASSWORD_HASH).trim();
  }
  const plain = envPasswordPlain();
  if (plain) {
    return bcrypt.hash(plain, 10);
  }
  return null;
}

async function start() {
  await connectDb();
  const hash = await resolveAdminPasswordHash();
  const seedEmail = adminRoleEmail || primaryAdminEmail;
  if (seedEmail && hash) {
    const database = await connectDb();
    const users = database.collection('users');
    const existing = await users.findOne({ email: seedEmail });
    if (!existing) {
      await users.insertOne({
        name: displayNameFromEmailNorm(seedEmail),
        email: seedEmail,
        passwordHash: hash,
        createdAt: new Date(),
      });
      console.log('Seeded admin user from env:', seedEmail);
    }
  }
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
