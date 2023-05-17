import { Router } from "express";

import studentRouter from "../controller/student.controller";
import userRouter from "../controller/user.controller";

const router = Router();

router.use("/api", studentRouter);
router.use("/api", userRouter);

// localhost:3000/api/students

export default router;
