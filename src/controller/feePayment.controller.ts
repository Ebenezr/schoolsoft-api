import { NextFunction, Response, Request, Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// post new fee payment

router.post(
  "/feepayments/post",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const feePayment = await prisma.feePayment.create({ data });
      res.status(201).json(feePayment);
    } catch (error) {
      next(error);
    }
  }
);

// get all fee payments
router.get(
  "/feepayments/all",
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
  "/feepayments",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const students = await prisma.feePayment.findMany({
        orderBy: {
          createdAt: "desc",
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
  "/feepayment/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const feePayment = await prisma.feePayment.findUnique({
        where: {
          id: Number(id),
        },
      });
      if (!feePayment) {
        return res.status(404).json({ message: "Fee payment not found" });
      }
      res.status(200).json(feePayment);
    } catch (error) {
      next(error);
    }
  }
);

//   update fee payment
router.patch(
  "/feepayment/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const feePayment = await prisma.feePayment.update({
        where: {
          id: Number(id),
        },
        data,
      });
      res.status(200).json(feePayment);
    } catch (error) {
      next(error);
    }
  }
);

// delete fee payment

router.delete(
  "/feepayment/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await prisma.feePayment.delete({
        where: {
          id: Number(id),
        },
      });
      res.status(200).json({ message: "Fee payment deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
