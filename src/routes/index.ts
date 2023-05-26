import { Router } from "express";

import studentRouter from "../controller/student.controller";
import userRouter from "../controller/user.controller";
import teacherRouter from "../controller/teacher.controller";
import guardianRouter from "../controller/guardian.controller";
import classRouter from "../controller/class.controller";
import additionalFeeRouter from "../controller/additionalFee.controller";
import additionalFeeStudentRouter from "../controller/additionalFeeStudent.controller";
import feePaymentRouter from "../controller/feePayment.controller";
import studentTermFeeRouter from "../controller/studentTermFee.controller";
import authRouter from "../controller/auth.controller";
import reportRouter from "../controller/reports.controller";
import termRouter from "../controller/term.controller";
import schoolRouter from "../controller/school.controller";

const router = Router();

router.use("/api", studentRouter);
router.use("/api", userRouter);
router.use("/api", teacherRouter);
router.use("/api", guardianRouter);
router.use("/api", classRouter);
router.use("/api", additionalFeeRouter);
router.use("/api", additionalFeeStudentRouter);
router.use("/api", feePaymentRouter);
router.use("/api", studentTermFeeRouter);
router.use("/api", authRouter);
router.use("/api", reportRouter);
router.use("/api", termRouter);
router.use("/api", schoolRouter);

export default router;
