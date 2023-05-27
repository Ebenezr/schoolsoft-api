import { NextFunction, Response, Router, Request } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// post new student term fee
router.post(
    "/studentTermFee/post",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const studentTermFee = await prisma.studentTermFee.create({ data });
            res.status(201).json(studentTermFee);
        } catch (error) {
            next(error);
        }
    }
);

// get all student term fees
router.get(
    "/studentTermFee/all",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const studentTermFee = await prisma.studentTermFee.findMany();
            res.status(200).json(studentTermFee);
        } catch (error) {
            next(error);
        }
    }
);

// get one student term fee
router.get(
    "/studentTermFee/:id",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            const studentTermFee = await prisma.studentTermFee.findUnique({
                where: {
                    id: Number(id),
                },
            });
            if (!studentTermFee) {
                return res.status(404).json({ message: "Student term fee not found" });
            }
            res.status(200).json(studentTermFee);
        } catch (error) {
            next(error);
        }
    }
);

//   update student term fee
router.patch(
    "/studentTermFee/:id",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const data = req.body;

            const studentTermFee = await prisma.studentTermFee.update({
                where: {
                    id: Number(id),
                },
                data,
            });
            res.status(200).json(studentTermFee);
        } catch (error) {
            next(error);
        }
    }

);

// delete student term fee
router.delete(
    "/studentTermFee/:id",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            await prisma.studentTermFee.delete({

                where: {
                    id: Number(id),
                },
            });
            res.status(200).json({ message: "Student term fee deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
);



export default router;