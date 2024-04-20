import express from 'express';
import { verifyToken, isAdmin } from '../authMiddleware';
import { checkAvailability, createReservation } from '../controllers/reservationController';

const router = express.Router();


router.get('/checkavailability/:date', checkAvailability);
router.post('/create', createReservation);


export default router;
