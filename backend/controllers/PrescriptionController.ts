import { Request, Response, NextFunction } from "express";
import prisma from "../prisma/PrismaClient";
import AppError from "../utils/AppError";

export const createPrescription = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { patientId, doctorId, appointmentId} = req.body;

        const existingPrescription = await prisma.prescription.findUnique({
            where: {
                patientId: patientId,
                doctorId: doctorId,
                appointmentId: appointmentId
            }
        });

        if(existingPrescription) return next(new AppError("Prescription already given", 409));

        const prescription = await prisma.prescription.create({ data: req.body });

        res.status(201).json({
            status: 'success',
            message: "Prescription made successfully",
            data: prescription
        });

    } catch (err) {
        console.log(err);
        return next(new AppError("Error creating prescription", 500));
    }
}


export const getAllPrescriptions = async (req: Request, res: Response, next: NextFunction) => {
    try {
       const prescriptions = await prisma.prescription.findMany({
            include: {
                doctor: true,
                appointment: true,
                patient: true
            }
       });
       
       res.status(200).json({
        status: 'success',
        message: 'Prescriptions fetched successfully',
        data: prescriptions
       });

    } catch (err) {
        return next(new AppError("Error getting all the prescriptions", 500));
    }
}

export const updatePrescriptionById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prescriptionId = parseInt(req.params.id);

        const existingPrescription = await prisma.prescription.findFirst({ where: {id: prescriptionId}});

        if(!existingPrescription) return next(new AppError("No such prescription found", 404));

        const prescription = await prisma.prescription.update(
            { where: {id: prescriptionId},
            data: req.body
        });

        res.status(200).json({
            status: 'success',
            message: "Prescription updated successfully",
            data: prescription
        });

    } catch (err) {
        return next(new AppError("Error updating the prescription", 500));
    }
}

export const deletePrescriptionById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prescriptionId = parseInt(req.params.id);

        const existingPrescription = await prisma.prescription.findFirst({ where: {id: prescriptionId}});

        if(!existingPrescription) return next(new AppError("No such prescription found", 404));

        await prisma.prescription.delete({ where: { id: prescriptionId}});

        res.status(200).json({
            status: 'success',
            message: "Prescription deleted successfully"
        });

    } catch (err) {
        return next(new AppError("Error deleting the prescription", 500));
    }
}

export const getPrescriptionByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.params.id);

        const user = await prisma.user.findFirst({where: { id: userId}});

        if(!user) return next(new AppError("User not found", 404));

        const prescription = await prisma.prescription.findMany({ 
            where: {patientId: userId},
            include: {
                doctor: true,
                appointment: true
            }
        });

        res.status(200).json({
            status: 'success',
            message: "User Prescriptions fetched successfully",
            data: prescription
        });

    } catch (err) {
        return next(new AppError("Error getting user prescriptions", 500));
    }
}

export const getPrescriptionByDoctorId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const docId = parseInt(req.params.id);

        const doctor = await prisma.doctor.findFirst({ where: {id: docId}});

        if(!doctor) return next(new AppError("Doctor not found", 404));

        const prescription = await prisma.prescription.findMany({ 
            where: {doctorId: docId},
            include: {
                patient: true,
                appointment: true
            }
        });

        res.status(200).json({
            status: 'success',
            message: "Doctor Prescriptions fetched successfully",
            data: prescription
        });

    } catch (err) {
        return next(new AppError("Error getting doctor given prescriptions", 500));
    }
}