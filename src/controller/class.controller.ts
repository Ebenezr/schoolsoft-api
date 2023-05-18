import { NextFunction, Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// post new class

router.post("/class/post",
async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const grade = await prisma.class.create({ data });
        res.status(201).json(grade);
    } catch (error) {
        next(error);
    }
});