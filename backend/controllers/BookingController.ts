import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import prisma from "../prisma/PrismaClient";

export const createAppointment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, doctorId, date } = req.body;

        const existingAppointment = await prisma.appointment.findFirst({
            where: {
                userId: userId,
                doctorId: doctorId,
                date: new Date(date) 
            }
        });

        if (existingAppointment) {
            return next(new AppError("An appointment already exists for this doctor and user on this date", 409));
        }

        const appointment = await prisma.appointment.create({ data: req.body });

        res.status(201).json({
            status: 'success',
            message: "Appointment created successfully",
            data: appointment
        });

    } catch (err) {
        return next(new AppError("Error creating the appointment", 500));
    }
};


export const getAllAppointments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const appointments = await prisma.appointment.findMany();

        if(!appointments) return next(new AppError("No available appointments", 400));

        res.status(200).json({
            status: 'success',
            message: "All appointments fetched successfully",
            data: appointments
        });

    } catch (err) {
        return next(new AppError("Error getting all appointments", 500));
    }
}

export const cancelAppointmentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const appointmentId = parseInt(req.params.id);

        const appointment = await prisma.appointment.findFirst({where: {id: appointmentId}});

        if(!appointment) return next(new AppError("Appointment not found", 404));
    
        await prisma.appointment.delete({ where: { id: appointmentId }});

        res.status(200).json({
            status: 'success',
            message: 'Appointment canceled successfully',
        });
        
    } catch (err) {
        return next(new AppError("Error cancelling the appointment", 500));
    }
}

export const updateAppointmentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {date} = req.body;
        const appointmentId = parseInt(req.params.id);

        const appointment = await prisma.appointment.update({
            where: { id: appointmentId},
            data: {date: date}
        });

        res.status(200).json({
            status: 'success',
            message: 'Appointment updated successfully',
            data: appointment
        });

    } catch (err) {
        return next(new AppError("Error updating Appointment", 500));
    }
}