import express from 'express';
import { verifyToken, isAdmin } from '../authMiddleware';
import { getAllCategories, updateCategory, deleteCategory, createCategory } from '../controllers/categoryController';

/******************************************************************************
 *
 * @author          Alfonso Cabezas Fernández
 * 
 * Con la ayuda de la herramienta de inteligencia artificial ChatGPT
 * 
 * @description    Página de gestión de rutas de categorías del sistema
 * 
 ******************************************************************************/

const router = express.Router();

router.get('/categories', getAllCategories);
router.put('/update/:id', verifyToken, isAdmin, updateCategory);
router.delete('/delete/:id', verifyToken, isAdmin, deleteCategory);
router.post('/create', verifyToken, isAdmin, createCategory);

export default router;
