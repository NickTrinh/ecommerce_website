import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';

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

const __dirname = path.resolve();

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

if(process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '/frontend/build')));

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
	});
}

app.listen(PORT, () => {
	console.log('Server running on https://localhost:' + PORT);
	connectDB();
});
