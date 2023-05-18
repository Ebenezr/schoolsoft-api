import { NextFunction, Request, Response, Router } from "express";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();
const bcrypt = require("bcryptjs");

// ROUTES
// create new user
router.post(
  "/users/post",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // CHECK IF USER EXISTS
      const user = await prisma.user.findUnique({
        where: { email: req.body.email },
      });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }
      const password = req.body.password;
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await prisma.user.create({
        data: { ...req.body, password: hashedPassword },
      });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// get users

export default router;
