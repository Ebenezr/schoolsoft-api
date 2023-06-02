import { NextFunction, Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// post additional fee

router.post(
  "/additionalfees/post",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const additionalFee = await prisma.additionalFee.create({ data });
      res.status(201).json(additionalFee);
    } catch (error) {
      next(error);
    }
  }
);

// get all additional fees

router.get(
  "/additionalfees/all",

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const additionalFee = await prisma.additionalFee.findMany();
      res.status(200).json(additionalFee);
    } catch (error) {
      next(error);
    }
  }
);

// get one additional fee

router.get(
  "/additionalFee/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const additionalFee = await prisma.additionalFee.findUnique({
        where: {
          id: Number(id),
        },
      });
      if (!additionalFee) {
        return res.status(404).json({ message: "Additional fee not found" });
      }
      res.status(200).json(additionalFee);
    } catch (error) {
      next(error);
    }
  }
);

//   update additional fee

router.patch(
  "/additionalfee/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const additionalFee = await prisma.additionalFee.update({
        where: {
          id: Number(id),
        },
        data,
      });
      res.status(200).json(additionalFee);
    } catch (error) {
      next(error);
    }
  }
);

// delete additional fee

router.get(
  "/additionalfees",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const students = await prisma.additionalFee.findMany({
        orderBy: {
          createdAt: "desc",
        },

        skip: startIndex,
        take: limit,
      });

      const totalItems = await prisma.additionalFee.count();

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

router.delete(
  "/additionalfee/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await prisma.additionalFee.delete({
        where: {
          id: Number(id),
        },
      });
      res.status(200).json({ message: "Additional fee deleted successfully" });
    } catch (error) {
      next(error);
      return res.status(404).json({ message: "Additional fee not found" });
    }
  }
);

export default router;
