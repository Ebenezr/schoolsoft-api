import { NextFunction, Request, Response, Router } from "express";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

type UserCreateInput = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
  createdAt?: Date; // optional because it has a default value
  updatedAt?: Date; // optional because it has a default value
};

function validateUserCreateInput(data: any): data is Prisma.UserCreateInput {
  return (
    typeof data.first_name === "string" &&
    typeof data.last_name === "string" &&
    typeof data.email === "string" &&
    typeof data.password === "string" &&
    typeof data.role === "string"
  );
}

// ROUTES
// create new user
router.post(
  "/users/post",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!validateUserCreateInput(req.body)) {
        return res.status(400).json({ error: "Invalid input" });
      }

      const result = await prisma.user.create({ data: req.body });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// get users

export default router;
