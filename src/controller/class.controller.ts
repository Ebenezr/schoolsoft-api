import { NextFunction, Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// post new class

router.post(
  "/classes/post",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const grade = await prisma.class.create({ data });
      res.status(201).json(grade);
    } catch (error) {
      next(error);
    }
  }
);

// get all classes
router.get(
  "/classes/all",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const grade = await prisma.class.findMany({
        include: {
          Student: true,
        },
      });
      res.status(200).json({ grade });
    } catch (error) {
      next(error);
    }
  }
);

// get one class

router.get(
  "/class/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const grade = await prisma.class.findUnique({
        where: {
          id: Number(id),
        },
        // return students' class name
        include: {
          Student: true,
        },
      });
      if (!grade) {
        return res.status(404).json({ message: "Class not found" });
      }
      res.status(200).json(grade);
    } catch (error) {
      next(error);
    }
  }
);

//   update class

router.patch(
  "/class/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const grade = await prisma.class.update({
        where: {
          id: Number(id),
        },
        data: req.body,
      });
      res.status(202).json(grade);
    } catch (error) {
      next(error);
      return res.status(404).json({ message: "Class not found" });
    }
  }
);

//   delete class

router.delete(
  "/class/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const grade = await prisma.class.delete({
        where: {
          id: Number(id),
        },
      });

      res.status(204).json(grade);
    } catch (error) {
      next(error);
      return res.status(404).json({ message: "Class not found" });
    }
  }
);

export default router;
