import { Router } from "express";

import studentRouter from "../controller/student.controller";
import userRouter from "../controller/user.controller";
import teacherRouter from "../controller/teacher.controller";
import guardianRouter from "../controller/guardian.controller";
import classRouter from "../controller/class.controller";
import classFeeRouter from "../controller/classFee.controller";
import additionalFeeRouter from "../controller/additionalFee.controller";
import additionalFeeStudentRouter from "../controller/additionalFeeStudent.controller";
import feePaymentRouter from "../controller/feePayment.controller";
import studentTermFeeRouter from "../controller/studentTermFee.controller";



const router = Router();

router.use("/api", studentRouter);
router.use("/api", userRouter);
router.use("/api", teacherRouter);
router.use("/api", guardianRouter);
router.use("/api", classRouter);
router.use("/api", classFeeRouter);
router.use("/api", additionalFeeRouter);
router.use("/api", additionalFeeStudentRouter);
router.use("/api", feePaymentRouter);
router.use("/api", studentTermFeeRouter);





// localhost:3000/api/students

export default router;
