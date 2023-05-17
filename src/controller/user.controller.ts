import { NextFunction, Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// ROUTES
// create new user
router.post(
  "/users/post",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await prisma.user.create({ data: req.body });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// get users

export default router;
