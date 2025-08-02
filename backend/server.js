// server/server.js
import express from 'express';
import cors from 'cors';
import onboardRouter from './routes/onboard.js';
import adminRoutes from './routes/admin.js';

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

// For resolving __dirname in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/onboard', onboardRouter);
app.use('/api/admin', adminRoutes);


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
