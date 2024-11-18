import { Router } from "express";
import {
  createDoctor,
  getDoctorById,
  getAllDoctors,
  getDoctorBySpecialization,
  deleteDoctorById,
  updateDoctorsDataById,
  updateDoctorEmailAndPasswordById
} from "../controllers/DoctorController";
import { uploadMiddleware } from "../utils/MutlerConfig";
import { protect, restrictTo } from "../middlewares/AuthMiddleware";

const router = Router();

router.route("/")
.post(protect, restrictTo("admin"),createDoctor)
.get(getAllDoctors)

router.route("/specialization/:name")
.get(protect, getDoctorBySpecialization)

router.route("/update/:id")
.patch(protect, updateDoctorEmailAndPasswordById)

router
  .route("/:id")
  .get(protect, getDoctorById)
  .patch(protect, uploadMiddleware, updateDoctorsDataById)
  .delete(protect,restrictTo("admin"), deleteDoctorById)
 
export default router;
