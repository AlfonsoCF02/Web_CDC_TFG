import express from 'express';
import { verifyToken, isAdmin } from '../authMiddleware';
import { getAllProducts, deleteProduct, createProduct, getProductById, updateProduct, getAllProductsCatalogue
        } from '../controllers/productController';

/******************************************************************************
 *
 * @author          Alfonso Cabezas Fernández
 * 
 * Con la ayuda de la herramienta de inteligencia artificial ChatGPT
 * 
 * @description    Página de gestión de rutas de productos del sistema
 * 
 ******************************************************************************/

const router = express.Router();

router.get('/products',  verifyToken, isAdmin, getAllProducts);
router.get('/catalogue', getAllProductsCatalogue);
router.delete('/delete', verifyToken, isAdmin, deleteProduct);
router.post('/create', verifyToken, isAdmin, createProduct);
router.get('/:id',  verifyToken, isAdmin, getProductById);
router.put('/update/:id', verifyToken, isAdmin, updateProduct);



export default router;
