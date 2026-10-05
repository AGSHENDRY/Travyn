const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const crypto = require('crypto');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = Number(process.env.PORT || 3000);
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'travyn';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET;

if (!MONGODB_URI) console.warn('WARNING: MONGODB_URI is not configured.');
if (!ADMIN_PASSWORD || !ADMIN_TOKEN_SECRET) console.warn('WARNING: ADMIN_PASSWORD or ADMIN_TOKEN_SECRET is not configured.');

let mongoClient;
let storeCollection;
let memoryStore = null;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
app.use(express.json({ limit: '2mb' }));
app.use(express.static(__dirname));

async function connectMongo() {
  if (!MONGODB_URI) return false;
  if (!mongoClient) {
    mongoClient = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
    await mongoClient.connect();
    storeCollection = mongoClient.db(MONGODB_DB).collection('store');
    await storeCollection.createIndex({ key: 1 }, { unique: true });
  }
  return true;
}

function sanitizeStore(data) {
  return {
    heroContent: data.heroContent || {},
    seoContent: data.seoContent || {},
    categories: Array.isArray(data.categories) ? data.categories : [],
    products: Array.isArray(data.products) ? data.products : [],
    orders: Array.isArray(data.orders) ? data.orders : [],
    reviews: Array.isArray(data.reviews) ? data.reviews : [],
    users: Array.isArray(data.users) ? data.users : [],
    notifications: Array.isArray(data.notifications) ? data.notifications : [],
    visitors: Number(data.visitors || 0)
  };
}

async function getStore() {
  try {
    if (await connectMongo()) {
      const doc = await storeCollection.findOne({ key: 'main' });
      if (doc) return { ...sanitizeStore(doc), updatedAt: doc.updatedAt };
    }
  } catch (err) {
    console.error('MongoDB read failed:', err.message);
  }
  return memoryStore || { heroContent: {}, seoContent: {}, categories: [], products: [], orders: [], reviews: [], users: [], notifications: [], visitors: 0, updatedAt: null };
}

async function saveStore(data) {
  const clean = sanitizeStore(data);
  const updatedAt = new Date().toISOString();
  const doc = { key: 'main', ...clean, updatedAt };
  memoryStore = doc;
  if (await connectMongo()) {
    await storeCollection.replaceOne({ key: 'main' }, doc, { upsert: true });
  }
  return doc;
}

function signToken(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', ADMIN_TOKEN_SECRET || 'missing-secret').update(body).digest('base64url');
  return `${body}.${sig}`;
}

function verifyToken(token) {
  try {
    if (!token || !ADMIN_TOKEN_SECRET) return false;
    const [body, sig] = token.split('.');
    if (!body || !sig) return false;
    const expected = crypto.createHmac('sha256', ADMIN_TOKEN_SECRET).update(body).digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    return payload.role === 'admin' && payload.exp > Date.now();
  } catch { return false; }
}

function requireAdmin(req, res, next) {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!verifyToken(token)) return res.status(401).json({ error: 'Admin authentication required.' });
  next();
}

app.get('/api/health', async (req, res) => {
  try {
    const connected = await connectMongo();
    res.json({ ok: true, mongodb: connected, database: MONGODB_DB, timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ ok: false, mongodb: false, error: err.message });
  }
});

app.post('/api/admin/login', async (req, res) => {
  const username = String(req.body?.username || '');
  const password = String(req.body?.password || '');
  if (!ADMIN_PASSWORD || !ADMIN_TOKEN_SECRET) return res.status(503).json({ error: 'Admin authentication is not configured on the VPS.' });
  const ok = crypto.timingSafeEqual(Buffer.from(username), Buffer.from(ADMIN_USER)) && crypto.timingSafeEqual(Buffer.from(password), Buffer.from(ADMIN_PASSWORD));
  if (!ok) return res.status(401).json({ error: 'Wrong username or password.' });
  const token = signToken({ role: 'admin', exp: Date.now() + 1000 * 60 * 60 * 12 });
  res.json({ token, expiresIn: 43200 });
});

app.get('/api/store', async (req, res) => {
  try { res.json(await getStore()); }
  catch (err) { res.status(500).json({ error: 'Could not load store data.' }); }
});

app.put('/api/admin/store', requireAdmin, async (req, res) => {
  try { res.json(await saveStore(req.body || {})); }
  catch (err) { console.error(err); res.status(500).json({ error: 'Could not save store data to MongoDB.', details: err.message }); }
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 6 * 1024 * 1024 } });
cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });
function uploadBuffer(buffer, folder = 'travyn') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder, resource_type: 'image' }, (err, result) => err ? reject(err) : resolve(result));
    stream.end(buffer);
  });
}

app.post('/api/upload', requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) return res.status(500).json({ error: 'Cloudinary is not configured.' });
    if (!req.file) return res.status(400).json({ error: 'No image selected' });
    const result = await uploadBuffer(req.file.buffer, 'travyn/uploads');
    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (error) { res.status(500).json({ error: 'Cloudinary upload failed.', details: error.message }); }
});

function cleanEmails(emails) { return [...new Set((emails || []).map(e => String(e || '').trim().toLowerCase()).filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)))]; }
function createTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) throw new Error('SMTP is not configured.');
  return nodemailer.createTransport({ host: SMTP_HOST, port: Number(SMTP_PORT || 587), secure: String(SMTP_PORT) === '465', auth: { user: SMTP_USER, pass: SMTP_PASS } });
}
app.post('/api/send-notification-email', requireAdmin, async (req, res) => {
  try {
    const emails = cleanEmails(req.body.emails); const subject = String(req.body.subject || 'TRAVYN Notification').trim(); const message = String(req.body.message || '').trim();
    if (!emails.length) return res.status(400).json({ success: false, error: 'No valid registered user emails found.' });
    if (!message) return res.status(400).json({ success: false, error: 'Message is empty.' });
    const transporter = createTransporter(); const from = process.env.MAIL_FROM || process.env.SMTP_USER;
    await transporter.sendMail({ from: `TRAVYN <${from}>`, to: from, bcc: emails, subject, text: message });
    res.json({ success: true, sent: emails.length });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

connectMongo().then(async () => {
  console.log(`TRAVYN starting on port ${PORT}`);
  app.listen(PORT, () => console.log(`TRAVYN running at http://localhost:${PORT}`));
}).catch(err => {
  console.error('MongoDB connection failed at startup:', err.message);
  app.listen(PORT, () => console.log(`TRAVYN running at http://localhost:${PORT} (MongoDB will retry on request)`));
});
