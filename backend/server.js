import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Routes
import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';
import cartRoutes from './routes/cart.route.js';
import couponRoutes from './routes/coupon.route.js';
import paymentRoutes from './routes/payment.route.js';
import analyticsRoutes from './routes/analytics.route.js';

import { connectDB } from './lib/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: '10mb' })); // Allows parsing the body of the request
app.use(cookieParser()); // Allows parsing cookies

app.use(cors({
    origin: [
        'https://ecommerce-website-lpzn.onrender.com',
        'http://localhost:5173'
    ],
    credentials: true
}));

// Authentication
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);

// Debug middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Check if dist folder exists and has index.html
const distPath = path.resolve(__dirname, '../frontend/dist');
const indexPath = path.resolve(distPath, 'index.html');

if (fs.existsSync(distPath) && fs.existsSync(indexPath)) {
    console.log('Static files found at:', distPath);
    app.use(express.static(distPath));
} else {
    console.error('Warning: Static files not found!');
    console.error('Dist path:', distPath);
    console.error('Index path:', indexPath);
}

// Public test endpoint (no auth required)
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working' });
});

// Protected API routes
app.use('/api/products', productRoutes);

// Serve React app for all other routes
app.get('*', (req, res) => {
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('Frontend files not found');
    }
});

app.listen(PORT, '0.0.0.0', () => {
	console.log(`Server running on port ${PORT}`);
	connectDB();
});
