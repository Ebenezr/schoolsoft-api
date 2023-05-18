import { Router } from "express";

import studentRouter from "../controller/student.controller";
import userRouter from "../controller/user.controller";
import teacherRouter from "../controller/teacher.controller";

const router = Router();

router.use("/api", studentRouter);
router.use("/api", userRouter);
router.use("/api", teacherRouter);


// localhost:3000/api/students

export default router;
