import { NextFunction, Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();


// post school info
router.post(
    "/school/post",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const school = await prisma.school.create({ data });
            res.status(201).json(school);
        } catch (error) {
          next(error);
        }
    }
);


// update school info

router.patch(
    "/school/update/:id",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const school = await prisma.school.update({
                where: {
                    id: Number(id),
                },
                data: req.body,
            });

            res.status(202).json(school);
        } catch (error) {
            next(error);
            return res.status(404).json({ message: "School not found" });
        }
    }
);

// get school info
router.get(
    "/school/:id",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const school = await prisma.school.findUnique({
                where: {
                    id: Number(id),
                },
            });
            if (!school) {
                return res.status(404).json({ message: "School not found" });
            }
            res.status(200).json(school);
        } catch (error) {

            next(error);
        }
    }
);

// delete school info
router.delete(
    "/school/delete/:id",

    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const school = await prisma.school.delete({
                where: {
                    id: Number(id),
                },
            });
            res.status(200).json(school);
        } catch (error) {
            next(error);
            return res.status(404).json({ message: "School not found" });
        }
    }
);




export default router;