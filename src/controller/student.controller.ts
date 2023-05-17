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

export default router;
