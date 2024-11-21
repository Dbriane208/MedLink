import { Router } from "express";
import { createPrescription, getAllPrescriptions,updatePrescriptionById,deletePrescriptionById,getPrescriptionByUserId, getPrescriptionByDoctorId } from "../controllers/PrescriptionController";
import { protect, restrictTo } from "../middlewares/AuthMiddleware";

const router = Router();

router.route("/")
.get(getAllPrescriptions)
.post(protect,createPrescription)

router.route("/:id")
.patch(protect,updatePrescriptionById)
.delete(protect,deletePrescriptionById)

router.route("/user/:id")
.get(protect,getPrescriptionByUserId)

router.route("/doctor/:id")
.get(getPrescriptionByDoctorId)

export default router