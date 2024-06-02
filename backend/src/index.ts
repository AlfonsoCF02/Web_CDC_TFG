import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRouter';
import categoryRouter from './routes/categoryRouter';
import productRouter from './routes/productRouter';
import orderRouter from './routes/orderRouter';
import reservationRouter from './routes/reservationRouter';

/******************************************************************************
 *
 * @author          Alfonso Cabezas Fernández
 * 
 * Con la ayuda de la herramienta de inteligencia artificial ChatGPT
 * 
 * @description    Página de inicio del backend la aplicación
 * 
 ******************************************************************************/

const app = express();

app.use(cors());
app.use(express.json());

// Rutas de usuario
app.use('/api/user', userRouter);
app.use('/api/category', categoryRouter);
app.use('/api/product', productRouter);
app.use('/api/order', orderRouter);
app.use('/api/reservation', reservationRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
