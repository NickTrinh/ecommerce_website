import express from 'express';
import { getAllProducts } from '../controllers/product.controller.js';
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// protectRoute check accessToken is normal -> check if admin -> getAllProducts
router.get('/', protectRoute, adminRoute, getAllProducts);

export default router;
