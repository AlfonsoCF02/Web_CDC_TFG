import express from 'express';
import { verifyToken, isAdmin } from '../authMiddleware';
import { getAllCategories } from '../controllers/categoryController';

const router = express.Router();

router.get('/categories', getAllCategories);


export default router;
