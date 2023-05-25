import { NextFunction, Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// post new term

router.post(
  "/terms/post",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, startDate, endDate } = req.body;
      const newTerm = await prisma.term.create({
        data: {
          name,
          startDate,
          endDate,
        },
      });
      res.status(201).json(newTerm);
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
        // return student's class name
        include: {
          Class: true,
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

router.get(
  "/terms/search/:name",
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.params;
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const terms = await prisma.term.findMany({
        where: {
          OR: [
            {
              first_name: {
                contains: name?.toString().toLowerCase() || "",
                mode: "insensitive",
              },
            },
            {
              last_name: {
                contains: name?.toString().toLowerCase() || "",
                mode: "insensitive",
              },
            },
          ],
        },
        skip: startIndex,
        take: limit,
      });

      if (!terms) {
        return res.status(404).json({ error: "term not found" });
      }

      const totalItems = await prisma.term.count({
        where: {
          OR: [
            {
              first_name: {
                contains: name?.toString().toLowerCase() || "",
                mode: "insensitive",
              },
            },
            {
              last_name: {
                contains: name?.toString().toLowerCase() || "",
                mode: "insensitive",
              },
            },
          ],
        },
      });

      res.status(200).json({
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        itemsPerPage: limit,
        totalItems: totalItems,
        items: terms.slice(0, endIndex),
      });
    } catch (error: any) {
      next(error);
    }
  }
);

export default router;
