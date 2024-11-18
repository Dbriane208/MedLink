import { Router } from "express";
import { createAppointment, getAllAppointments,cancelAppointmentById,updateAppointmentById } from "../controllers/BookingController";

const router = Router();

router.route("/")
<<<<<<< Updated upstream
.post(createAppointment)
=======
.post(protect, createAppointment)
>>>>>>> Stashed changes
.get(getAllAppointments)

router.route("/:id")
.patch(updateAppointmentById)
.delete(cancelAppointmentById)

export default router

