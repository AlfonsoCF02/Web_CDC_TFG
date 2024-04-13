import express from 'express';
import { verifyToken, isAdmin } from '../authMiddleware';
import { loginUser, createUser, getAllUsers, deleteUser,
            getUserById, updateUser 
        } from '../controllers/userController';

const router = express.Router();

router.post('/login', loginUser);
router.post('/create', createUser);
router.get('/users', verifyToken, isAdmin, getAllUsers);
router.delete('/delete/:id', verifyToken, isAdmin, deleteUser);
router.get('/:id', verifyToken, getUserById);
router.put('/update/:id',  verifyToken, updateUser);

export default router;
