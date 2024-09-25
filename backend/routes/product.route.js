import express from 'express';
import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getFeaturedProducts,
	getProductsByCategory,
	getRecommendedProducts,
	toggleFeaturedProduct,
} from '../controllers/product.controller.js';
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protectRoute, adminRoute, getAllProducts); // protectRoute check accessToken is normal -> check if admin -> getAllProducts
router.get('/featured', getFeaturedProducts); // get featured products
router.get('/category/:category', getProductsByCategory); // get top products
router.get('/recommendations', getRecommendedProducts); // get recommended products
router.post('/', protectRoute, adminRoute, createProduct); // post product
router.patch('/:id', protectRoute, adminRoute, toggleFeaturedProduct); // toggle featured product
router.delete('/:id', protectRoute, adminRoute, deleteProduct); // delete product

export default router;
