import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const MAX_RESERVATIONS_PER_DAY = 5; // Define un máximo de reservas por día

export const checkAvailability = async (req: Request, res: Response): Promise<void> => {
  const { date } = req.params; // La fecha viene como parámetro en la URL
  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      res.status(400).json({ error: 'Invalid date format' });
      return;
    }

    // Contar todas las reservas para esa fecha específica
    const count = await prisma.reservas.aggregate({
      where: {
        dateArrival: parsedDate,
      },
      _sum: {
        participants: true,
      },
    });

    // Calcula cuántos espacios están disponibles aún
    const availableSlots = MAX_RESERVATIONS_PER_DAY - count._sum?.participants;
    res.json({
      available: availableSlots > 0,
      availableSlots: availableSlots > 0 ? availableSlots : 0,
    });
  } catch (error) {
    console.error('Failed to check availability:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const createReservation = async (req, res) => {
  const { userID, orderer, email, dateArrival, participants, price } = req.body;
  try {
      const newReservation = await prisma.reservas.create({
          data: {
              id: uuidv4(), // Generate a UUID for each reservation
              userID: userID || null,
              orderer: orderer,
              email: email,
              dateCreation: new Date(), // Set the creation date to now
              dateArrival: new Date(dateArrival), // Ensure dateArrival is a Date object
              participants: participants,
              price: price
          }
      });
      res.status(201).json(newReservation);
  } catch (error) {
      console.error('Failed to create reservation:', error);
      res.status(500).json({ error: 'Failed to create reservation' });
  }
};