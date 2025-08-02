// backend/routes/onboard.js
import express from 'express';
import db from '../db.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, fullName, ip, deviceInfo } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO users (email, full_name, ip, device_info) VALUES ($1, $2, $3, $4) RETURNING id',
      [email, fullName, ip, deviceInfo || null]
    );

    res.json({ success: true, userId: result.rows[0].id });
  } catch (err) {
    console.error('Error saving user:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

export default router;
