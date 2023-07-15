import { NextFunction, Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { partialReset, resetDatabase } from '../reset';
import { isSuperAdmin } from '../middlewares/isSuperAdmin.middleware';

const prisma = new PrismaClient();
const router = Router();

// Secure this endpoint by adding authentication middleware
router.post('/reset-database', isSuperAdmin, async (req, res) => {
  try {
    await resetDatabase(prisma);
    res.status(200).json({ message: 'Database reset successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset database', details: error });
  }
});
router.post('/partial-reset-database', isSuperAdmin, async (req, res) => {
  try {
    await partialReset(prisma);
    res.status(200).json({ message: 'Database reset successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset database', details: error });
  }
});

// Export the router
export default router;
