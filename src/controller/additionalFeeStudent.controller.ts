import { NextFunction, Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const router = Router();

// post new additionalFeeStudent

router.post(
    '/additionalFeeStudent/post',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const additionalFeeStudent = await prisma.additionalFeeStudent.create({
                data,
            });
            res.status(201).json(additionalFeeStudent);
        } catch (error) {
            next(error);
        }
    }
);

// get all additionalFeeStudents
router.get(
    '/additionalFeeStudent/all',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const additionalFeeStudent = await prisma.additionalFeeStudent.findMany();
            res.status(200).json(additionalFeeStudent);
        } catch (error) {
            next(error);
        }
    }
);

// get one additionalFeeStudent

router.get(
    '/additionalFeeStudent/:id',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const additionalFeeStudent = await prisma.additionalFeeStudent.findUnique(
                {
                    where: {
                        id: Number(id),
                    },
                }
            );
            if (!additionalFeeStudent) {
                return res.status(404).json({ message: 'Additional Fee Student not found' });
            }
            res.status(200).json(additionalFeeStudent);
        } catch (error) {
            next(error);
        }
    }
);

//   update additionalFeeStudent
router.patch(
    "additionalFeeStudent/:id",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const additionalFeeStudent = await prisma.additionalFeeStudent.update({
                where: { id: Number(id) },
                data,
            });

            if (!additionalFeeStudent) {
                return res.status(404).json({ message: "Additional Fee Student not found" });
            }
            res.status(200).json(additionalFeeStudent);
        } catch (error) {
            next(error);
        }
    }
);


// delete additionalFeeStudent
router.delete(
    "/additionalFeeStudent/:id",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            await prisma.additionalFeeStudent.delete({
                where: { id: Number(id) },
            });
            res.status(200).json({ message: "Additional Fee Student deleted successfully" });
        } catch (error) {
            next(error);
            return res.status(404).json({ message: "Additional Fee Student not found" });
        }
    }
);

export default router;