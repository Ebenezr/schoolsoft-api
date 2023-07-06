import { Router } from "express";

import studentRouter from "../controller/student.controller";
import userRouter from "../controller/user.controller";
import teacherRouter from "../controller/teacher.controller";
import classRouter from "../controller/class.controller";
import feePaymentRouter from "../controller/feePayment.controller";
import studentTermFeeRouter from "../controller/studentTermFee.controller";
import authRouter from "../controller/auth.controller";
import reportRouter from "../controller/reports.controller";
import schoolRouter from "../controller/school.controller";

const router = Router();

router.use("/api", studentRouter);
router.use("/api", userRouter);
router.use("/api", teacherRouter);
router.use("/api", classRouter);
router.use("/api", feePaymentRouter);
router.use("/api", studentTermFeeRouter);
router.use("/api", authRouter);
router.use("/api", reportRouter);
router.use("/api", schoolRouter);

export default router;
