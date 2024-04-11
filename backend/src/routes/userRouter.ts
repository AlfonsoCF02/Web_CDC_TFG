import express from 'express';
import { loginUser, createUser } from '../controllers/userController';

const router = express.Router();

router.post('/login', loginUser);
router.post('/create', createUser);

export default router;
