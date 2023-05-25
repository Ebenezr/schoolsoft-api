import { NextFunction, Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// post new teacher

router.post(
  "/teachers/post",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const teacher = await prisma.teacher.create({ data });
      res.status(201).json(teacher);
    } catch (error) {
      next(error);
    }
  }
);

//  get all teachers

router.get(
  "/teachers/all",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teacher = await prisma.teacher.findMany();
      res.status(200).json({ teacher });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/teachers",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const students = await prisma.teacher.findMany({
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

      const totalItems = await prisma.teacher.count();

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

// get one teacher
router.get(
  "/teacher/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const teacher = await prisma.teacher.findUnique({
        where: {
          id: Number(id),
        },
      });
      if (!teacher) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.status(200).json(teacher);
    } catch (error) {
      next(error);
    }
  }
);

// update teacher
router.patch(
  "/teacher/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const teacher = await prisma.teacher.update({
        where: {
          id: Number(id),
        },
        data: req.body,
      });

      res.status(202).json(teacher);
    } catch (error) {
      next(error);
      return res.status(404).json({ message: "Teacher not found" });
    }
  }
);

//   delete student

router.delete(
  "/teacher/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const teacher = await prisma.teacher.delete({
        where: {
          id: Number(id),
        },
      });

      res.status(204).json(teacher);
    } catch (error) {
      next(error);
      return res.status(404).json({ message: "Teacher not found" });
    }
  }
);

router.get(
  "/teachers/search/:name",
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.params;
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const teachers = await prisma.teacher.findMany({
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

      if (!teachers) {
        return res.status(404).json({ error: "Teacher not found" });
      }

      const totalItems = await prisma.teacher.count({
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
        items: teachers.slice(0, endIndex),
      });
    } catch (error: any) {
      next(error);
    }
  }
);

export default router;
