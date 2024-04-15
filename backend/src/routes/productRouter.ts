import express from 'express';
import { verifyToken, isAdmin } from '../authMiddleware';
import { getAllProducts, deleteProduct, createProduct, getProductById, updateProduct
        } from '../controllers/productController';

const router = express.Router();


router.get('/products',  verifyToken, isAdmin, getAllProducts);
router.delete('/delete', verifyToken, isAdmin, deleteProduct);
router.post('/create', verifyToken, isAdmin, createProduct);
router.get('/:id',  verifyToken, isAdmin, getProductById);
router.put('/update/:id', verifyToken, isAdmin, updateProduct);


export default router;
