import { NextFunction, Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// post new student
router.post(
  "/students/post",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const additionalPayments = req.body.additionalPayments;

      // Create the student record
      const student = await prisma.student.create({
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
          dob: data.dob,
          gender: data.gender,
          classId: data.classId,
        },
      });

      // Get the class information
      const classInfo = await prisma.class.findUnique({
        where: {
          id: data.classId,
        },
      });

      if (!classInfo) {
        throw new Error("Class not found");
      }

      // Find additional fees from the database based on regex patterns
      const fees = await prisma.additionalFee.findMany({
        where: {
          OR: [
            { name: { contains: "bus", mode: "insensitive" } },
            { name: { contains: "food", mode: "insensitive" } },
            { name: { contains: "boarding", mode: "insensitive" } },
          ],
        },
      });

      // Create additional fee student records based on matched fees
      const additionalFeeStudents = fees.map((fee) => {
        return prisma.additionalFeeStudent.create({
          data: {
            studentId: student.id,
            additionalFeeId: fee.id,
          },
        });
      });

      // Wait for all additional fee student records to be created
      await Promise.all(additionalFeeStudents);

      // Calculate the fee amounts
      let busFee = 0;
      let foodFee = 0;
      let boardingFee = 0;

      for (const fee of fees) {
        if (fee.name.toLowerCase().includes("bus")) {
          busFee += Number(fee.amount);
        }
        if (fee.name.toLowerCase().includes("food")) {
          foodFee += Number(fee.amount);
        }
        if (fee.name.toLowerCase().includes("boarding")) {
          boardingFee += Number(fee.amount);
        }
      }

      // Create the student term fee record
      const studentTermFee = await prisma.studentTermFee.create({
        data: {
          studentId: student.id,
          classId: data.classId,
          bus_fee: additionalPayments.bus_fee ? busFee : 0,
          food_fee: additionalPayments.food_fee ? foodFee : 0,
          boarding_fee: additionalPayments.boarding_fee ? boardingFee : 0,
          term_one_fee: classInfo.term_1 ?? 0,
          term_two_fee: classInfo.term_2 ?? 0,
          term_three_fee: classInfo.term_3 ?? 0,
          term_one_balance:
            Number(classInfo.term_1) + busFee + foodFee + boardingFee ?? 0,
          term_two_balance:
            Number(classInfo.term_2) + busFee + foodFee + boardingFee ?? 0,
          term_three_balance:
            Number(classInfo.term_3) + busFee + foodFee + boardingFee ?? 0,
        },
      });

      res.status(201).json({ student, studentTermFee });
    } catch (error) {
      next(error);
    }
  }
);

// PATCH existing student
router.patch(
  "/student/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const additionalPayments = req.body.additionalPayments;

      // Update the student record
      const student = await prisma.student.update({
        where: { id: Number(id) },
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
          dob: data.dob,
          gender: data.gender,
          classId: data.classId,
        },
      });

      // Get the class information
      const classInfo = await prisma.class.findUnique({
        where: {
          id: data.classId,
        },
      });

      if (!classInfo) {
        throw new Error("Class not found");
      }

      // Find additional fees from the database based on regex patterns
      const fees = await prisma.additionalFee.findMany({
        where: {
          OR: [
            { name: { contains: "bus", mode: "insensitive" } },
            { name: { contains: "food", mode: "insensitive" } },
            { name: { contains: "boarding", mode: "insensitive" } },
          ],
        },
      });

      // Delete existing AdditionalFeeStudent records
      await prisma.additionalFeeStudent.deleteMany({
        where: {
          studentId: student.id,
        },
      });

      // Create additional fee student records based on matched fees
      const additionalFeeStudents = fees.map((fee) => {
        return prisma.additionalFeeStudent.create({
          data: {
            studentId: student.id,
            additionalFeeId: fee.id,
          },
        });
      });

      // Wait for all additional fee student records to be created
      await Promise.all(additionalFeeStudents);

      // Calculate the fee amounts
      let busFee = 0;
      let foodFee = 0;
      let boardingFee = 0;

      for (const fee of fees) {
        if (fee.name.toLowerCase().includes("bus")) {
          busFee += Number(fee.amount);
        }
        if (fee.name.toLowerCase().includes("food")) {
          foodFee += Number(fee.amount);
        }
        if (fee.name.toLowerCase().includes("boarding")) {
          boardingFee += Number(fee.amount);
        }
      }

      // Delete existing StudentTermFee records
      await prisma.studentTermFee.deleteMany({
        where: {
          studentId: student.id,
        },
      });

      // Create new StudentTermFee record
      const studentTermFee = await prisma.studentTermFee.create({
        data: {
          studentId: student.id,
          classId: data.classId,

          bus_fee: additionalPayments.bus_fee ? busFee : 0,
          food_fee: additionalPayments.food_fee ? foodFee : 0,
          boarding_fee: additionalPayments.boarding_fee ? boardingFee : 0,
          term_one_fee: classInfo.term_1 ?? 0,
          term_two_fee: classInfo.term_2 ?? 0,
          term_three_fee: classInfo.term_3 ?? 0,
          term_one_balance:
            Number(classInfo.term_1) + busFee + foodFee + boardingFee ?? 0,
          term_two_balance:
            Number(classInfo.term_2) + busFee + foodFee + boardingFee ?? 0,
          term_three_balance:
            Number(classInfo.term_3) + busFee + foodFee + boardingFee ?? 0,
        },
      });

      res.status(200).json({
        student,

        busFee,
        foodFee,
        boardingFee,

        studentTermFee,
      });
    } catch (error) {
      next(error);
    }
  }
);

// get all students with pagination
router.get(
  "/students",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const students = await prisma.student.findMany({
        orderBy: {
          createdAt: "desc",
        },
        // return student's class name
        include: {
          Class: true,
          StudentTermFee: true,
          AdditionalFeeStudent: true,
        },
        skip: startIndex,
        take: limit,
      });

      const totalItems = await prisma.student.count();

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

// get all students
router.get(
  "/students/all",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const student = await prisma.student.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          Class: true,
        },
      });
      res.status(200).json({ student });
    } catch (error) {
      next(error);
    }
  }
);

// get one student
router.get(
  "/student/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const student = await prisma.student.findUnique({
        where: {
          id: Number(id),
        },
      });
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.status(200).json(student);
    } catch (error) {
      next(error);
    }
  }
);

// delete student
router.delete(
  "/student/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const student = await prisma.student.delete({
        where: {
          id: Number(id),
        },
      });

      res.status(204).json(student);
    } catch (error) {
      next(error);
      return res.status(404).json({ message: "Student not found" });
    }
  }
);
// search students by name
router.get(
  "/students/search/:name",
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.params;
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const students = await prisma.student.findMany({
        where: {
          OR: [
            {
              first_name: {
                contains: name?.toString().toLowerCase() || "",
                mode: "insensitive",
              },
            },
            {
              last_name: {
                contains: name?.toString().toLowerCase() || "",
                mode: "insensitive",
              },
            },
          ],
        },
        skip: startIndex,
        take: limit,
      });

      if (!students) {
        return res.status(404).json({ error: "student not found" });
      }

      const totalItems = await prisma.student.count({
        where: {
          OR: [
            {
              first_name: {
                contains: name?.toString().toLowerCase() || "",
                mode: "insensitive",
              },
            },
            {
              last_name: {
                contains: name?.toString().toLowerCase() || "",
                mode: "insensitive",
              },
            },
          ],
        },
      });

      res.status(200).json({
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        itemsPerPage: limit,
        totalItems: totalItems,
        items: students.slice(0, endIndex),
      });
    } catch (error: any) {
      next(error);
    }
  }
);

export default router;
