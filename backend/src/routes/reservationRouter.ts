import express from 'express';
import { verifyToken, isAdmin } from '../authMiddleware';
import { checkAvailability, createReservation, getReservations, deleteReservation, getMyReservations } from '../controllers/reservationController';

/******************************************************************************
 *
 * @author          Alfonso Cabezas Fernández
 * 
 * Con la ayuda de la herramienta de inteligencia artificial ChatGPT
 * 
 * @description    Página de gestión de rutas de reservas del sistema
 * 
 ******************************************************************************/

const router = express.Router();

router.get('/checkavailability/:date', checkAvailability);
router.post('/create', createReservation);
router.get('/reservations', verifyToken, isAdmin, getReservations);
router.delete('/delete/:id', verifyToken, deleteReservation);
router.get('/myreservations/:id', verifyToken, getMyReservations);


export default router;
