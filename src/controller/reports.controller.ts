import { NextFunction, Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// total no of students
router.get(
  "/students/count",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const totalStudents = await prisma.student.count();
      res.status(200).json({ totalStudents });
    } catch (error) {
      next(error);
    }
  }
);

// total fees collected
router.get(
  "/fees/total",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const fees = await prisma.feePayment.aggregate({
        _sum: {
          amount: true,
        },
      });
      res.status(200).json({ totalFees: fees._sum.amount });
    } catch (error) {
      next(error);
    }
  }
);

// number of students in each class
router.get(
  "/class/:id/students/count",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const totalStudents = await prisma.student.count({
        where: {
          classId: Number(id),
        },
      });
      res.status(200).json({ totalStudents });
    } catch (error) {
      next(error);
    }
  }
);

// number of classes
router.get(
  "/classes/count",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const totalClasses = await prisma.class.count();
      res.status(200).json({ totalClasses });
    } catch (error) {
      next(error);
    }
  }
);

// number of teachers
router.get(
  "/teachers/count",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const totalTeachers = await prisma.teacher.count();
      res.status(200).json({ totalTeachers });
    } catch (error) {
      next(error);
    }
  }
);

// number of guardians
router.get(
  "/guardians/count",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const totalGuardians = await prisma.guardian.count();
      res.status(200).json({ totalGuardians });
    } catch (error) {
      next(error);
    }
  }
);

// payment modes
router.get(
  "/fees/payment-mode",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paymentModes = await prisma.feePayment.groupBy({
        by: ["payment_mode"],
        _count: true,
      });
      res.status(200).json(paymentModes);
    } catch (error) {
      next(error);
    }
  }
);

// todays sales
//
router.get(
  "/payments/get/paymentmodes",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const today = new Date();
      // CHANGE THIS
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );

      const paymentModes = [
        "BANK",
        "MPESA",
        "CHEQUE",
        "CREDIT",
        "CASH",
        "CARD",
      ];

      const revenueByPaymentMode = await Promise.all(
        paymentModes.map(async (mode) => {
          const revenue = await prisma.feePayment.aggregate({
            where: {
              payment_mode: mode,
              createdAt: {
                gte: startOfDay,
                lt: endOfDay,
              },
            },
            _sum: {
              amount: true,
            },
          });

          return {
            name: mode,
            value: Number(revenue._sum?.amount) ?? 0,
          };
        })
      );

      res.json({
        todayRevenueByPaymentMode: revenueByPaymentMode,
      });
    } catch (error: any) {
      next(error);
    }
  }
);

export default router;
