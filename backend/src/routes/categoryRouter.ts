import express from 'express';
import { verifyToken, isAdmin } from '../authMiddleware';
import { getAllCategories, updateCategory, deleteCategory, createCategory } from '../controllers/categoryController';

const router = express.Router();

router.get('/categories', getAllCategories);
router.put('/update/:id', verifyToken, isAdmin, updateCategory);
router.delete('/delete/:id', verifyToken, isAdmin, deleteCategory);
router.post('/create', verifyToken, isAdmin, createCategory);

export default router;
