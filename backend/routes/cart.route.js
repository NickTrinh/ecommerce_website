import express from 'express';
import {
	addToCart,
	getCartProducts,
	removeAllFromCart,
	updateQuantity,
} from '../controllers/cart.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protectRoute, getCartProducts);
router.post('/', protectRoute, addToCart); // add 1 item to cart
router.delete('/', protectRoute, removeAllFromCart); // remove all items from cart
router.put('/:id', protectRoute, updateQuantity); // increase or decrease item quantity by 1
export default router;
