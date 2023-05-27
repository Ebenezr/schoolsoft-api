import { NextFunction, Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// post additional fee

router.post(
    "/additionalFee/post",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const additionalFee = await prisma.additionalFee.create({ data });
            res.status(201).json(additionalFee);
        } catch (error) {
            next(error);
        }
    }
);

// get all additional fees

router.get(
    "/additionalFee/all",

    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const additionalFee = await prisma.additionalFee.findMany();
            res.status(200).json(additionalFee);
        } catch (error) {
            next(error);
        }
    }
);

// get one additional fee

router.get(
    "/additionalFee/:id",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const additionalFee = await prisma.additionalFee.findUnique({
                where: {
                    id: Number(id),
                },
            });
            if (!additionalFee) {
                return res.status(404).json({ message: "Additional fee not found" });
            }
            res.status(200).json(additionalFee);
        } catch (error) {
            next(error);
        }
    }
);

//   update additional fee

router.patch(
    "/additionalFee/:id",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const additionalFee = await prisma.additionalFee.update({
                where: {
                    id: Number(id),
                },
                data,
            });
            res.status(200).json(additionalFee);
        } catch (error) {
            next(error);
        }
    }
);

// delete additional fee

router.delete(
    "/additionalFee/:id",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            await prisma.additionalFee.delete({
                where: {
                    id: Number(id),
                },
            });
            res.status(200).json({ message: "Additional fee deleted successfully" });
        } catch (error) {
            next(error);
            return res.status(404).json({ message: "Additional fee not found" });
        }
    }
);






export default router;