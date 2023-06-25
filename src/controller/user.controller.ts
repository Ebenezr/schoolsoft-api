import { NextFunction, Request, Response, Router } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();
const bcrypt = require('bcryptjs');

// ROUTES
// create new user
router.post(
  '/users/post',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // CHECK IF USER EXISTS
      const user = await prisma.user.findUnique({
        where: { email: req.body.email },
      });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
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
  '/users',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const users = await prisma.user.findMany({
        orderBy: {
          createdAt: 'desc',
        },

        skip: startIndex,
        take: limit,
      });
      const totalItems = await prisma.user.count();
      res.status(200).json({
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        itemsPerPage: limit,
        totalItems: totalItems,
        items: users.slice(0, endIndex),
      });
    } catch (error) {
      next(error);
    }
  }
);

// get one user
router.get(
  '/user/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: {
          id: Number(id),
        },
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
);

// update user
router.patch(
  '/user/:id',
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
      return res.status(404).json({ message: 'User not found' });
    }
  }
);

// delete a user
router.delete(
  `/user/delete/:id`,
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const user = await prisma.user.delete({
        where: { id: Number(id) },
      });
      if (user && user.superuser) {
        return res.status(403).json({ error: 'Superuser cannot be deleted' });
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

// fetch users by name
router.get(
  '/users/search/:name',
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.params;
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const users = await prisma.user.findMany({
        where: {
          name: {
            contains: name?.toString().toLowerCase() || '',
            mode: 'insensitive',
          },
        },
        skip: startIndex,
        take: limit,
      });

      if (!users) {
        return res.status(404).json({ error: 'user not found' });
      }

      const totalItems = await prisma.user.count({
        where: {
          name: {
            contains: name?.toString().toLowerCase() || '',
            mode: 'insensitive',
          },
        },
      });

      res.status(200).json({
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        itemsPerPage: limit,
        totalItems: totalItems,
        items: users.slice(0, endIndex),
      });
    } catch (error: any) {
      next(error);
    }
  }
);

export default router;
