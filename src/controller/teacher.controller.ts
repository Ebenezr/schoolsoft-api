import { NextFunction, Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// post new teacher

router.post(
    "/teacher/post",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const teacher = await prisma.teacher.create({ data });
            res.status(201).json (teacher);
        } catch (error) {
            next(error);
        }
    }
    
    );

    //  get all teachers

    router.get(
        "/teachers",
        async (req: Request, res: Response, next: NextFunction) => {
            try {
              const teachers = await prisma.teacher.findMany();
              res.status(200).json(teachers);
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
          


export default router;