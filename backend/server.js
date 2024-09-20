import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Routes
import authRoutes from './routes/auth.route.js';

import { connectDB } from './lib/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // Allows parsing the body of the request
app.use(cookieParser()); // Allows parsing cookies

// Authentication
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
	console.log('Server running on https://localhost:' + PORT);
	connectDB();
});
