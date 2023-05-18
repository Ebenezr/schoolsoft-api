import { NextFunction, Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// post new student
router.post(
  "/students/post",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const student = await prisma.student.create({ data });
      res.status(201).json(student);
    } catch (error) {
      next(error);
    }
  }
);

// get all students
router.get(
  "/students",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const students = await prisma.student.findMany();
      res.status(200).json(students);
    } catch (error) {
      next(error);
    }
  }
);

// get one student
router.get(
  "/student/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const student = await prisma.student.findUnique({
        where: {
          id: Number(id),
        },
      });
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.status(200).json(student);
    } catch (error) {
      next(error);
    }
  }
);

// update student
router.patch(
  "/student/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const student = await prisma.student.update({
        where: {
          id: Number(id),
        },
        data: req.body,
      });

      res.status(202).json(student);
    } catch (error) {
      next(error);
      return res.status(404).json({ message: "Student not found" });
    }
  }
);

// delete student
router.delete(
  "/student/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const student = await prisma.student.delete({
        where: {
          id: Number(id),
        },
      });

      res.status(204).json(student);
    } catch (error) {
      next(error);
      return res.status(404).json({ message: "Student not found" });
    }
  }
);

export default router;
