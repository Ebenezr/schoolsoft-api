import { NextFunction, Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// post new guardian
router.post(
  "/guardian/post",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const guardian = await prisma.guardian.create({ data });
      res.status(201).json(guardian);
    } catch (error) {
      next(error);
    }
  }
);

// get all guardians
router.get(
  "/guardian/all",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const guardian = await prisma.guardian.findMany();
      res.status(200).json(guardian);
    } catch (error) {
      next(error);
    }
  }
);

// get one guardian

router.get(
  "/guardian/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const guardian = await prisma.guardian.findUnique({
        where: {
          id: Number(id),
        },
      });
      if (!guardian) {
        return res.status(404).json({ message: "Guardian not found" });
      }
      res.status(200).json(guardian);
    } catch (error) {
      next(error);
    }
  }
);

// update guardian

router.patch(
  "/guardian/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const guardian = await prisma.guardian.update({
        where: {
          id: Number(id),
        },
        data: req.body,
      });

      res.status(202).json(guardian);
    } catch (error) {
      next(error);
      return res.status(404).json({ message: "Guardian not found" });
    }
  }
);

// delete guardian

router.delete(
  "/guardian/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const guardian = await prisma.guardian.delete({
        where: {
          id: Number(id),
        },
      });

      res.status(204).json(guardian);
    } catch (error) {
      next(error);
      return res.status(404).json({ message: "Guardian not found" });
    }
  }
);

// search students by name
router.get(
  "/guardians/search/:name",
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.params;
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const students = await prisma.guardian.findMany({
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

      if (!students) {
        return res.status(404).json({ error: "Guardian not found" });
      }

      const totalItems = await prisma.guardian.count({
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
        items: students.slice(0, endIndex),
      });
    } catch (error: any) {
      next(error);
    }
  }
);

export default router;
