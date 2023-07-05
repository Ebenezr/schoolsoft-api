import { NextFunction, Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// post new class

router.post(
  '/classes/post',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const grade = await prisma.class.create({ data });
      res.status(201).json(grade);
    } catch (error) {
      next(error);
    }
  }
);

// get all classes
router.get(
  '/classes/all',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const grade = await prisma.class.findMany({
        include: {
          Student: true,
        },
      });
      res.status(200).json({ grade });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/classes',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const students = await prisma.class.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        // return teachers class name fullname `firstname + last_name
        include: {
          Teacher: true,
          Student: true,
        },
        skip: startIndex,
        take: limit,
      });

      const totalItems = await prisma.class.count();

      res.status(200).json({
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        itemsPerPage: limit,
        totalItems: totalItems,
        items: students.slice(0, endIndex),
      });
    } catch (error) {
      next(error);
    }
  }
);

// Endpoint for getting students of a specific class
router.get(
  '/class/:classId/students',
  async (req: Request, res: Response, next: NextFunction) => {
    const classId = parseInt(req.params.classId);
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    if (isNaN(classId)) {
      res.status(400).json({ error: 'Invalid class id' });
      return;
    }

    try {
      const students = await prisma.student.findMany({
        where: {
          classId: classId,
        },
        include: {
          Class: true,
          // remove this
          StudentTermFee: true,
          AdditionalFeeStudent: true,
        },
        skip: startIndex,
        take: limit,
      });

      const totalStudents = await prisma.student.count({
        where: {
          classId: classId,
        },
      });

      if (students.length === 0) {
        res
          .status(404)
          .json({ message: 'No students found for the given class id' });
        return;
      }

      const result = {
        totalItems: totalStudents,
        totalPages: Math.ceil(totalStudents / limit),
        currentPage: page,
        itemsPerPage: limit,
        items: students,
      };

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);
// get one class

router.get(
  '/class/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const grade = await prisma.class.findUnique({
        where: {
          id: Number(id),
        },
        // return students' class name
        include: {
          Student: true,
        },
      });
      if (!grade) {
        return res.status(404).json({ message: 'Class not found' });
      }
      res.status(200).json(grade);
    } catch (error) {
      next(error);
    }
  }
);

//   update class

router.patch(
  '/class/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const grade = await prisma.class.update({
        where: {
          id: Number(id),
        },
        data: req.body,
      });
      res.status(202).json(grade);
    } catch (error) {
      next(error);
      return res.status(404).json({ message: 'Class not found' });
    }
  }
);

// // delete class
// router.delete(
//   "/class/:id",
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { id } = req.params;

//       const classToDelete = await prisma.class.findUnique({
//         where: {
//           id: Number(id),
//         },
//         include: {
//           Teacher: true,
//         },
//       });

//       if (!classToDelete) {
//         return res.status(404).json({ message: "Class not found" });
//       }

//       const { Teacher } = classToDelete;

//       if (Teacher) {
//         return res
//           .status(400)
//           .json({ message: "Cannot delete a class that has a teacher" });
//       }

//       await prisma.class.delete({
//         where: {
//           id: Number(id),
//         },
//       });

//       res.status(204).end();
//     } catch (error) {
//       next(error);
//     }
//   }
// );

// delete class
router.delete(
  '/class/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const classToDelete = await prisma.class.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!classToDelete) {
        return res.status(404).json({ message: 'Class not found' });
      }

      await prisma.class.delete({
        where: {
          id: Number(id),
        },
      });

      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
);

// search class
router.get(
  '/classes/search/:name',
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.params;
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const classes = await prisma.class.findMany({
        where: {
          name: {
            contains: name?.toString().toLowerCase() || '',
            mode: 'insensitive',
          },
        },
        skip: startIndex,
        take: limit,
      });

      if (!classes) {
        return res.status(404).json({ error: 'class not found' });
      }

      const totalItems = await prisma.class.count({
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
        items: classes.slice(0, endIndex),
      });
    } catch (error: any) {
      next(error);
    }
  }
);

export default router;
