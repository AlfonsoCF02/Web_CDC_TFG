import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRouter';

const app = express();

app.use(cors());
app.use(express.json());

// Rutas de usuario
app.use('/api/user', userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});