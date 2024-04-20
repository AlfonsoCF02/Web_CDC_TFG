import express from 'express';
import { verifyToken, isAdmin } from '../authMiddleware';
import { checkAvailability, createReservation, getReservations, deleteReservation, getMyReservations } from '../controllers/reservationController';

const router = express.Router();


router.get('/checkavailability/:date', checkAvailability);
router.post('/create', createReservation);
router.get('/reservations', verifyToken, isAdmin, getReservations);
router.delete('/delete/:id', verifyToken, deleteReservation);
router.get('/myreservations/:id', verifyToken, getMyReservations);


export default router;
