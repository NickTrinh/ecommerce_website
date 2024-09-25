import express from 'express';
import { createProduct, deleteProduct, getAllProducts, getFeaturedProducts } from '../controllers/product.controller.js';
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protectRoute, adminRoute, getAllProducts); // protectRoute check accessToken is normal -> check if admin -> getAllProducts
router.get("/featured", getFeaturedProducts);              // get featured products
router.post("/", protectRoute, adminRoute, createProduct); // post product
router.delete("/:id", protectRoute, adminRoute, deleteProduct); // delete product

export default router;
