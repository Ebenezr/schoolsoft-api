import { NextFunction, Response, Request, Router } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// post new fee payment

router.post(
  '/fee-payments/post',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const feePayment = await prisma.feePayment.create({ data });

      const studentTermFee = await prisma.studentTermFee.findFirst({
        where: {
          studentId: feePayment.studentId,
          classId: feePayment.classId,
        },
      });

      const term = await prisma.term.findFirst({
        where: {
          id: feePayment.termId,
        },
      });

      if (studentTermFee && term) {
        // Define type for updateData
        type UpdateDataType = {
          term_one_paid?: {
            increment: Prisma.Decimal;
          };
          term_two_paid?: {
            increment: Prisma.Decimal;
          };
          term_three_paid?: {
            increment: Prisma.Decimal;
          };
          term_one_balance?: {
            decrement: Prisma.Decimal;
          };
          term_two_balance?: {
            decrement: Prisma.Decimal;
          };
          term_three_balance?: {
            decrement: Prisma.Decimal;
          };
        };

        let updateData: UpdateDataType = {};

        if (term.name === 'Term 1') {
          updateData.term_one_paid = { increment: feePayment.amount };
          updateData.term_one_balance = { decrement: feePayment.amount };
        } else if (term.name === 'Term 2') {
          updateData.term_two_paid = { increment: feePayment.amount };
          updateData.term_two_balance = { decrement: feePayment.amount };
        } else if (term.name === 'Term 3') {
          updateData.term_three_paid = { increment: feePayment.amount };
          updateData.term_three_balance = { decrement: feePayment.amount };
        }

        const updatedStudentTermFee = await prisma.studentTermFee.update({
          where: { id: studentTermFee.id },
          data: updateData,
        });

        res.status(201).json({ feePayment, updatedStudentTermFee });
      } else {
        res
          .status(400)
          .json({ message: 'No term fee found for this student and class.' });
      }
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
    const { id } = req.params;
    const data = req.body;

    try {
      // Get the original fee payment data
      const originalFeePayment = await prisma.feePayment.findUnique({
        where: {
          id: parseInt(id, 10),
        },
      });

      // If the original fee payment doesn't exist, throw an error
      if (!originalFeePayment) {
        return res.status(404).json({ message: 'Fee payment not found.' });
      }

      // Update the fee payment data
      const updatedFeePayment = await prisma.feePayment.update({
        where: {
          id: originalFeePayment.id,
        },
        data,
      });

      // Calculate the difference between the original and updated fee amounts
      const feeDifference =
        Number(updatedFeePayment.amount) - Number(originalFeePayment.amount);

      const studentTermFee = await prisma.studentTermFee.findFirst({
        where: {
          studentId: updatedFeePayment.studentId,
          classId: updatedFeePayment.classId,
        },
      });

      const term = await prisma.term.findFirst({
        where: {
          id: updatedFeePayment.termId,
        },
      });

      if (studentTermFee && term) {
        let updateData: Prisma.StudentTermFeeUpdateInput = {};

        if (term.name === 'Term 1') {
          updateData.term_one_paid = { increment: feeDifference };
          updateData.term_one_balance = { decrement: feeDifference };
        } else if (term.name === 'Term 2') {
          updateData.term_two_paid = { increment: feeDifference };
          updateData.term_two_balance = { decrement: feeDifference };
        } else if (term.name === 'Term 3') {
          updateData.term_three_paid = { increment: feeDifference };
          updateData.term_three_balance = { decrement: feeDifference };
        }

        const updatedStudentTermFee = await prisma.studentTermFee.update({
          where: { id: studentTermFee.id },
          data: updateData,
        });

        res.status(200).json({ updatedFeePayment, updatedStudentTermFee });
      } else {
        res
          .status(400)
          .json({ message: 'No term fee found for this student and class.' });
      }
    } catch (error) {
      next(error);
    }
  }
);

// delete fee payment

router.delete(
  '/fee-payments/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    const feePaymentId = parseInt(req.params.id, 10);

    try {
      // Find the fee payment record
      const feePayment = await prisma.feePayment.findUnique({
        where: {
          id: feePaymentId,
        },
      });

      if (!feePayment) {
        return res.status(404).json({ message: 'Fee payment not found' });
      }

      // Find the student term fee record
      const studentTermFee = await prisma.studentTermFee.findFirst({
        where: {
          studentId: feePayment.studentId,
          classId: feePayment.classId,
        },
      });

      if (!studentTermFee) {
        return res
          .status(404)
          .json({ message: 'No term fee found for this student and class.' });
      }

      // Determine which term balance to update
      let termBalanceField = '';
      if (feePayment.termId === 1) {
        termBalanceField = 'term_one_balance';
      } else if (feePayment.termId === 2) {
        termBalanceField = 'term_two_balance';
      } else if (feePayment.termId === 3) {
        termBalanceField = 'term_three_balance';
      }

      // Update the student term fee balance
      const updatedStudentTermFee = await prisma.studentTermFee.update({
        where: {
          id: studentTermFee.id,
        },
        data: {
          [termBalanceField]: {
            increment: Number(feePayment.amount), // Re-add the fee payment to the balance
          },
          amount_paid: {
            decrement: Number(feePayment.amount), // Subtract the fee payment from the amount paid
          },
          balance: {
            increment: Number(feePayment.amount), // Re-add the fee payment to the overall balance
          },
        },
      });

      // Delete the fee payment
      const deletedFeePayment = await prisma.feePayment.delete({
        where: {
          id: feePaymentId,
        },
      });

      res.status(200).json({ deletedFeePayment, updatedStudentTermFee });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
