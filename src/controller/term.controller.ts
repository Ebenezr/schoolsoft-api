import { NextFunction, Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// post new term

router.post(
  "/terms/post",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const newterm = await prisma.term.create({ data });
      res.status(201).json(newterm);
    } catch (error) {
      next(error);
    }
  }
);

//  get all terms

router.get(
  "/terms/all",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const term = await prisma.term.findMany();
      res.status(200).json({ term });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/terms",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const students = await prisma.term.findMany({
        orderBy: {
          createdAt: "desc",
        },
        skip: startIndex,
        take: limit,
      });

      const totalItems = await prisma.term.count();

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

// get one term
router.get(
  "/term/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const term = await prisma.term.findUnique({
        where: {
          id: Number(id),
        },
      });
      if (!term) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.status(200).json(term);
    } catch (error) {
      next(error);
    }
  }
);

// update term
router.patch(
  "/term/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const term = await prisma.term.update({
        where: {
          id: Number(id),
        },
        data: req.body,
      });

      res.status(202).json(term);
    } catch (error) {
      next(error);
      return res.status(404).json({ message: "term not found" });
    }
  }
);

//   delete student

router.delete(
  "/term/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const term = await prisma.term.delete({
        where: {
          id: Number(id),
        },
      });

      res.status(204).json(term);
    } catch (error) {
      next(error);
      return res.status(404).json({ message: "term not found" });
    }
  }
);

export default router;
