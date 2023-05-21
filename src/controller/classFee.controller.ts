import { NextFunction, Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();



// post a new classFee

router.post(
    "/classFee/post", 
   async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const classFee = await prisma.classFee.create({ data });
            res.status(201).json(classFee);
        } catch (error) {
            next(error);
        }
    }
);

// get all classFee

router.get(
    "/classFee/all",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const classFee = await prisma.classFee.findMany();
            res.status(200).json(classFee);
        } catch (error) {
            next(error);
        }
    }
);

// get one classFee

router.get(
    "/classFee/:id",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const classFee = await prisma.classFee.findUnique({
                where: {
                    id: Number(id),
                },
            });
            if (!classFee) {
                return res.status(404).json({ message: "Grade not found" });
            }
            res.status(200).json(classFee);
        } catch (error) {
            next(error);
        }
    }
);

// update one classFee

router.patch(
    "/classFee/:id",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const classFee = await prisma.classFee.update({
                where: {
                    id: Number(id),
                },
                data: req.body,
            });

            res.status(202).json(classFee);
        } catch (error) {
            next(error);
            return res.status(404).json({ message: "Grade not found" });
        }
    }
);

// delete classFee

router.delete(
    "/classFee/:id",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const classFee = await prisma.classFee.delete({
                where: {
                    id: Number(id),
                },
            });

            res.status(204).json(classFee);
        } catch (error) {
            next(error);
            return res.status(404).json({ message: "Grade not found" });
        }
    }
);

export default router;