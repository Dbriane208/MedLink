import { Router } from "express";
import { createAppointment, getAllAppointments,cancelAppointmentById,updateAppointmentById } from "../controllers/BookingController";

const router = Router();

router.route("/")
.post(createAppointment)
.get(getAllAppointments)

router.route("/:id")
.patch(updateAppointmentById)
.delete(cancelAppointmentById)

export default router

