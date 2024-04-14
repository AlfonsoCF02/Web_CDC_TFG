import express from 'express';
import { verifyToken, isAdmin } from '../authMiddleware';
import { getAllCategories, updateCategory, deleteCategory } from '../controllers/categoryController';

const router = express.Router();

router.get('/categories', verifyToken, isAdmin, getAllCategories);
router.put('/update/:id', verifyToken, isAdmin, updateCategory);
router.delete('/delete/:id', verifyToken, isAdmin, deleteCategory);

export default router;
