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

// get all users
router.get(
  "/users",
  async(req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await prisma.user.findMany();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }
);

// get one user
router.get(
  "/user/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: {
          id: Number(id),
        },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
);

// update user
router.patch(
  "/user/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await prisma.user.update({
        where: {
          id: Number(id),
        },
        data: req.body,
      });

      res.status(202).json(user);
    } catch (error) {
      next(error);
      return res.status(404).json({ message: "User not found" });
    }
  }

);

// delete user
router.delete(
  "/user/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await prisma.user.delete({
        where: {
          id: Number(id),
        },
      });
      res.status(204).json({ message: "User deleted" });
    } catch (error) {
      next(error);
    }
  }
);



export default router;
