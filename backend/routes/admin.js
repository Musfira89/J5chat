// routes/admin.js
import express from 'express';
import crypto from 'crypto';
import db from '../db.js';

const router = express.Router();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// ✅ Admin Login
router.post('/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) res.sendStatus(200);
  else res.sendStatus(401);
});

// ✅ Generate Token(s)
router.post('/generate', async (req, res) => {
  const { count = 1, mode = 'time', usageLimit } = req.body;
  const tokens = [];

  for (let i = 0; i < count; i++) {
    const token = 'J5-' + crypto.randomBytes(4).toString('hex').toUpperCase();

    const createdAt = new Date();
    const expiresAt = mode === 'time' ? new Date(Date.now() + 2 * 60 * 1000) : null;
    const usage_limit = mode === 'usage' ? usageLimit || 100 : null;

    await db.query(
      `INSERT INTO tokens 
       (token, created_at, mode, expires_at, usage_limit, usage_count, used_by_ip, used_at, full_name, email, used_emails, usage_logs)
       VALUES 
       ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        token,
        createdAt,
        mode,
        expiresAt,
        usage_limit,
        0,
        null,
        null,
        null,
        null,
        [],                    // $11 used_emails
        JSON.stringify([]),    // $12 usage_logs
      ]
    );
    
    

    tokens.push({ token, mode });
  }

  res.json({ tokens });
});

// ✅ Fetch All Tokens
router.get('/tokens', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM tokens ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching tokens:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch tokens' });
  }
});

// ✅ Use Token
router.post('/use-token', async (req, res) => {
  const { token, ip, fullName, email } = req.body;

  try {
    const result = await db.query('SELECT * FROM tokens WHERE token = $1', [token]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Token not found' });
    }

    const tokenData = result.rows[0];
    const now = new Date();

    if (tokenData.expires_at && new Date(tokenData.expires_at) < now) {
      return res.status(410).json({ success: false, message: 'Token expired' });
    }

    if (tokenData.usage_limit && tokenData.usage_count >= tokenData.usage_limit) {
      return res.status(410).json({ success: false, message: 'Usage limit reached' });
    }

    if (tokenData.mode === 'time') {
      if (tokenData.email && tokenData.email !== email) {
        return res.status(403).json({ success: false, message: 'Email mismatch' });
      }

      await db.query(
        `UPDATE tokens
         SET used_by_ip = $1, used_at = $2, email = $3, full_name = $4,
             expires_at = $5
         WHERE token = $6`,
        [ip, now, email, fullName, new Date(now.getTime() + 24 * 60 * 60 * 1000), token]
      );
    } else if (tokenData.mode === 'usage') {
      const usedEmails = tokenData.used_emails || [];
      if (usedEmails.includes(email)) {
        return res.status(403).json({ success: false, message: 'Email already used' });
      }

      usedEmails.push(email);
      const newUsageCount = (tokenData.usage_count || 0) + 1;

      const usageLogs = tokenData.usage_logs || [];
      usageLogs.push({ email, usedAt: now.toISOString(), usedByIP: ip });

      await db.query(
        `UPDATE tokens
         SET used_emails = $1, usage_count = $2, usage_logs = $3
         WHERE token = $4`,
        [usedEmails, newUsageCount, JSON.stringify(usageLogs), token]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Error using token:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// ✅ Delete Token
router.delete('/tokens/:token', async (req, res) => {
  try {
    await db.query('DELETE FROM tokens WHERE token = $1', [req.params.token]);
    res.sendStatus(200);
  } catch (err) {
    console.error('Error deleting token:', err);
    res.status(500).json({ success: false, message: 'Failed to delete token' });
  }
});

export default router;
