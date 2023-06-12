import { NextFunction, Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// post additional fee

router.post(
  "/additionalfees/post",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const additionalFee = await prisma.additionalFee.create({ data });
      res.status(201).json(additionalFee);
    } catch (error) {
      next(error);
    }
  }
);

// get all additional fees

router.get(
  "/additionalfees/all",

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const additionalFee = await prisma.additionalFee.findMany();
      res.status(200).json(additionalFee);
    } catch (error) {
      next(error);
    }
  }
);

// Endpoint for getting additional fees of a specific student
router.get(
  "/student/:studentId/additional-fees",
  async (req: Request, res: Response, next: NextFunction) => {
    const studentId = parseInt(req.params.studentId);

    if (isNaN(studentId)) {
      res.status(400).json({ error: "Invalid student id" });
      return;
    }

    try {
      const additionalFees = await prisma.additionalFeeStudent.findMany({
        where: {
          studentId: studentId,
        },
        include: {
          AdditionalFee: true,
        },
      });

      if (additionalFees.length === 0) {
        res
          .status(404)
          .json({
            message: "No additional fees found for the given student id",
          });
        return;
      }

      const feesObject: { [key: string]: boolean } = {};

      const feeData = [
        { id: 1, name: "Food Fee" },
        { id: 2, name: "Bus Fee" },
        { id: 3, name: "Boarding Fee" },
      ];

      feeData.forEach((fee) => {
        const feeKey = fee.name.toLowerCase().replace(" ", "_");
        feesObject[feeKey] = false;
      });

      additionalFees.forEach((additionalFee) => {
        const feeName = additionalFee.AdditionalFee.name;
        const feeKey = feeName.toLowerCase().replace(" ", "_");
        feesObject[feeKey] = true;
      });

      res.status(200).json(feesObject);
    } catch (error) {
      next(error);
    }
  }
);

// get one additional fee

router.get(
  "/additionalFee/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const additionalFee = await prisma.additionalFee.findUnique({
        where: {
          id: Number(id),
        },
      });
      if (!additionalFee) {
        return res.status(404).json({ message: "Additional fee not found" });
      }
      res.status(200).json(additionalFee);
    } catch (error) {
      next(error);
    }
  }
);

//   update additional fee

router.patch(
  "/additionalfee/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const additionalFee = await prisma.additionalFee.update({
        where: {
          id: Number(id),
        },
        data,
      });
      res.status(200).json(additionalFee);
    } catch (error) {
      next(error);
    }
  }
);

// delete additional fee

router.get(
  "/additionalfees",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const students = await prisma.additionalFee.findMany({
        orderBy: {
          createdAt: "desc",
        },

        skip: startIndex,
        take: limit,
      });

      const totalItems = await prisma.additionalFee.count();

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

router.delete(
  "/additionalfee/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await prisma.additionalFee.delete({
        where: {
          id: Number(id),
        },
      });
      res.status(200).json({ message: "Additional fee deleted successfully" });
    } catch (error) {
      next(error);
      return res.status(404).json({ message: "Additional fee not found" });
    }
  }
);

export default router;
