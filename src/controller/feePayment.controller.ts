import { NextFunction, Response, Request, Router } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// post new fee payment

router.post(
  '/fee-payments/post',
  async (req: Request, res: Response, next: NextFunction) => {
    const prismaTransaction = prisma.$transaction;
    try {
      const { studentId, amount } = req.body;

      // Retrieve the student
      const student = await prisma.student.findUnique({
        where: { id: studentId },
      });
      // Ensure the student exists
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      // Update the student's feePaid and feeBalance
      const updatedStudent = prisma.student.update({
        where: { id: studentId },
        data: {
          feePaid: {
            increment: amount,
          },
          feeBalance: {
            decrement: amount,
          },
        },
      });

      // Create the new fee payment
      const feePayment = prisma.feePayment.create({ data: req.body });

      // Execute the transaction
      const [_, newFeePayment] = await prismaTransaction([
        updatedStudent,
        feePayment,
      ]);

      // Respond with the new fee payment
      res.status(201).json(newFeePayment);
    } catch (error) {
      next(error);
    }
  }
);

// get all fee payments
router.get(
  '/feepayments/all',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const feePayment = await prisma.feePayment.findMany();
      res.status(200).json(feePayment);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/feepayments',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const students = await prisma.feePayment.findMany({
        orderBy: {
          createdAt: 'desc',
        },

        skip: startIndex,
        take: limit,
      });

      const totalItems = await prisma.feePayment.count();

      res.status(200).json({
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        itemsPerPage: limit,
        totalItems: totalItems,
        items: students.slice(0, endIndex),
      });
    } catch (error) {
      next(error);
    }
  }
);

// get one fee payment
router.get(
  '/feepayment/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const feePayment = await prisma.feePayment.findUnique({
        where: {
          id: Number(id),
        },
      });
      if (!feePayment) {
        return res.status(404).json({ message: 'Fee payment not found' });
      }
      res.status(200).json(feePayment);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/fee-payments/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    const prismaTransaction = prisma.$transaction;
    try {
      const { id } = req.params;
      const { studentId, amount } = req.body;

      // Retrieve the original fee payment
      const originalFeePayment = await prisma.feePayment.findUnique({
        where: { id: Number(id) },
      });

      if (!originalFeePayment) {
        return res.status(404).json({ message: 'Fee payment not found.' });
      }

      // Calculate the difference between the new amount and the original one
      const amountDifference =
        Number(amount) - Number(originalFeePayment.amount);

      // Update the student's feePaid and feeBalance
      const updatedStudent = prisma.student.update({
        where: { id: studentId },
        data: {
          feePaid: {
            increment: amountDifference,
          },
          feeBalance: {
            decrement: amountDifference,
          },
        },
      });

      // Update the fee payment
      const updatedFeePayment = prisma.feePayment.update({
        where: { id: Number(id) },
        data: req.body,
      });

      // Execute the transaction
      const [_, newFeePayment] = await prismaTransaction([
        updatedStudent,
        updatedFeePayment,
      ]);

      // Respond with the updated fee payment
      res.status(202).json(newFeePayment);
    } catch (error) {
      next(error);
    }
  }
);

// delete fee payment

router.delete(
  '/fee-payments/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    const prismaTransaction = prisma.$transaction;
    try {
      const { id } = req.params;

      // Retrieve the fee payment
      const feePayment = await prisma.feePayment.findUnique({
        where: { id: Number(id) },
      });

      if (!feePayment) {
        return res.status(404).json({ message: 'Fee payment not found' });
      }

      // Update the student's feePaid and feeBalance
      const updatedStudent = prisma.student.update({
        where: { id: feePayment.studentId },
        data: {
          feePaid: {
            decrement: feePayment.amount,
          },
          feeBalance: {
            increment: feePayment.amount,
          },
        },
      });

      // Delete the fee payment
      const deletedFeePayment = prisma.feePayment.delete({
        where: { id: Number(id) },
      });

      // Execute the transaction
      const [_, feePaymentDeleted] = await prismaTransaction([
        updatedStudent,
        deletedFeePayment,
      ]);

      // Respond with the deleted fee payment
      res.status(200).json(feePaymentDeleted);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
