import express from 'express';
import { verifyToken, isAdmin } from '../authMiddleware';
import { createOrder } from '../controllers/orderController';

const router = express.Router();


router.post('/create', createOrder);



export default router;
