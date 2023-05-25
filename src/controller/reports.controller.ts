import { NextFunction, Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// total no of students
router.get(
  "/students/count",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const totalStudents = await prisma.student.count();
      res.status(200).json({ totalStudents });
    } catch (error) {
      next(error);
    }
  }
);

// total fees collected
router.get(
  "/fees/total",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const fees = await prisma.feePayment.aggregate({
        _sum: {
          amount: true,
        },
      });
      res.status(200).json({ totalFees: fees._sum.amount });
    } catch (error) {
      next(error);
    }
  }
);

// number of students in each class
router.get(
  "/class/:id/students/count",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const studentCount = await prisma.student.count({
        where: {
          classId: Number(id),
        },
      });
      res.status(200).json({ studentCount });
    } catch (error) {
      next(error);
    }
  }
);

// number of classes
router.get(
  "/classes/count",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const totalClasses = await prisma.class.count();
      res.status(200).json({ totalClasses });
    } catch (error) {
      next(error);
    }
  }
);

// number of teachers
router.get(
  "/teachers/count",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const totalTeachers = await prisma.teacher.count();
      res.status(200).json({ totalTeachers });
    } catch (error) {
      next(error);
    }
  }
);

// payment modes
router.get(
  "/fees/payment-mode",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paymentModes = await prisma.feePayment.groupBy({
        by: ["payment_mode"],
        _count: true,
      });
      res.status(200).json(paymentModes);
    } catch (error) {
      next(error);
    }
  }
);

// get total fee payment of current year's terms for a specific class
// router.get(
//   "/class-fees",
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { className } = req.query;

//       if (!className) {
//         return res.status(400).json({ message: "Class name is required" });
//       }

//       // Get the current year.
//       const currentYear = new Date().getFullYear();

//       // Fetch the fees payment of the current year's terms for the specific class.
//       const fees = await prisma.termFee.findMany({
//         where: {
//           // Fetch only the fees of the terms of the current year.
//           Term: {
//             startDate: { gte: new Date(currentYear, 0, 1) },
//             endDate: { lte: new Date(currentYear, 11, 31) },
//           },
//           // Fetch only the fees of the specified class.

//           Class: {
//             name: String(className),
//           },
//         },
//         select: {
//           Term: {
//             select: {
//               name: true,
//             },
//           },
//           amount: true,
//         },
//       });

//       // Calculate the total fees for each term.
//       let result: { [key: string]: number } = {};
//       fees.forEach((fee) => {
//         if (result[fee.Term.name]) {
//           result[fee.Term.name] += Number(fee.amount);
//         } else {
//           result[fee.Term.name] = Number(fee.amount);
//         }
//       });

//       res.status(200).json(result);
//     } catch (error) {
//       next(error);
//     }
//   }
// );

export default router;
