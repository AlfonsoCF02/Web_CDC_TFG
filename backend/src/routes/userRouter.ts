import express from 'express';
import { verifyToken, isAdmin } from '../authMiddleware';
import { loginUser, createUser, getAllUsers } from '../controllers/userController';

const router = express.Router();

router.post('/login', loginUser);
router.post('/create', createUser);
router.get('/users', verifyToken, isAdmin, getAllUsers);

export default router;
