import { Router } from "express";
import {
  createDoctor,
  getDoctorById,
  getAllDoctors,
  getDoctorBySpecialization,
  deleteDoctorById,
  updateDoctorsDataById,
  updateDoctorEmailAndPasswordById,
  loginDoctor
} from "../controllers/DoctorController";
import { uploadMiddleware } from "../utils/MutlerConfig";
import { protect, restrictTo } from "../middlewares/AuthMiddleware";

const router = Router();

router.route("/")
.post(protect, restrictTo("admin"),createDoctor)
.get(getAllDoctors)

router.route("/login")
.post(loginDoctor)

router.route("/specialization/:name")
.get(protect, getDoctorBySpecialization)

router.route("/update/:id")
.patch(protect, updateDoctorEmailAndPasswordById)

router
  .route("/:id")
  .get(getDoctorById)
  .patch(protect, uploadMiddleware, updateDoctorsDataById)
  .delete(protect,restrictTo("admin"), deleteDoctorById)
 
export default router;
