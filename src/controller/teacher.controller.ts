import { NextFunction, Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();


// post new Teacher

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

// get all teachers with pagination

router.get(
    "/teachers",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = parseInt(req.query.page as string, 10) || 1;
            const limit = parseInt(req.query.limit as string, 10) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;

            const teachers = await prisma.teacher.findMany({
                orderBy: {
                    createdAt: "desc",
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
                items: teachers.slice(0, endIndex),
            });
        } catch (error) {
            next(error);
        }
    }
);

// get all teachers

router.get(
    "/teachers/all",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const teachers = await prisma.teacher.findMany();
            res.status(200).json(teachers);
        } catch (error) {
            next(error);
        }
    }
);

// get teacher by id

router.get(
    "/teachers/:id",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id);
            const teacher = await prisma.teacher.findUnique({
                where: {
                    id: Number (id),
                },
            });

            if (!teacher) {
                return res.status(404).json({ message: "Not Found" });
            }
            res.status(200).json(teacher);
        } catch (error) {
            next(error);
        }
    }
);

// update teacher by id

