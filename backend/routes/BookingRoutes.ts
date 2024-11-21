import { Router } from "express";
import { protect, restrictTo } from "../middlewares/AuthMiddleware";
import { createAppointment, getAllAppointments,cancelAppointmentById,updateAppointmentById,getAppointmentsByDoctorId,getAppointmentsByUserId } from "../controllers/BookingController";

const router = Router();

router.route("/")
.post(createAppointment)
.get(getAllAppointments)

router.route("/:id")
.patch(protect, updateAppointmentById)
.delete(protect, cancelAppointmentById)

router.route("/user/:id")
.get(protect, getAppointmentsByUserId)

router.route("/doctor/:id")
.get(getAppointmentsByDoctorId)

export default router

