import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/PrismaClient";
import AppError from "../utils/AppError";
import cloudinary from "../utils/CloudinaryConfig";
import { deleteLocalFile, deleteCloudinaryImage } from "./UploadController";


export const getAllDoctors = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const doctors = await prisma.doctor.findMany({
            include: {
                appointments: {
                    select: {
                        id: true,
                        user: true,
                        date: true,
                    },
                },
                prescriptions: true,
            },
        });

        if(!doctors) {
            return next(new AppError("There are no users found", 404));
        }

        res.status(200).json({
            status: 'success',
            message: "All doctors fetched successfully",
            data: doctors
        });

    } catch (err) {
        console.log("doc",err);
        return next(new AppError("Error getting doctors", 500));
    }
}


export const createDoctor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { password, name, experience,email,specialization,description } = req.body;

        if (!password) {
            return next(new AppError("Password is required", 400));
        }

        const hashedPassword = await bcrypt.hash(password, 10); 

        const doctor = await prisma.doctor.create({
            data: {
                name, experience,email,specialization,description,
                password: hashedPassword, 
            },
        });

        res.status(201).json({
            status: "success",
            message: "Doctor created successfully",
            data: doctor
        });

    } catch (err) {
        console.error("Error creating a doctor:", err);
        return next(new AppError("Error creating a doctor", 500));
    }
};


export const loginDoctor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError("Please provide email and password", 400));
        }

        // Fetch doctor data from the database
        const doctor = await prisma.doctor.findUnique({
            where: { email: email },
            select: {
                name: true,
                password: true,
                role: true,
                id: true,
            },
        });

        // If doctor is not found
        if (!doctor) {
            return next(new AppError("Doctor not found", 404));
        }

        // Compare provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, doctor.password);
        if (!isMatch) {
            return next(new AppError("Incorrect password", 401));
        }

        // Generate a JWT token
        const token = jwt.sign({ id: doctor.id }, process.env.JWT_TOKEN!, {
            expiresIn: "10d",
        });

        // Send a success response
        res.status(200).json({
            status: "success",
            message: "Logged in successfully",
            token,
            data: {
                name: doctor.name,
                role: doctor.role,
                id: doctor.id,
            },
        });
    } catch (err) {
        console.error("Login Doctor Error:", err);
        return next(new AppError("An error occurred while logging in", 500));
    }
};


export const getDoctorBySpecialization = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.params;

        const tags = await prisma.doctor.findMany({
            where: { specialization: name }
        });

        if(!name) {
            return next(new AppError("Not a recognized specialization", 404));
        }

        if (!tags) {
            return next(new AppError("No doctors for this specialization", 404)); 
        }

        res.status(200).json({
            status: 'success',
            message: "Specified Doctors successfully fetched",
            data: tags
        });

    } catch (err) {
        return next(new AppError("Error getting the specified doctors", 500));
    }
}

export const getDoctorById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const docId = parseInt(req.params.id);

        const doctor = await prisma.doctor.findUnique({ 
            where: {id: docId},
            include: {
                appointments: {
                    select: {
                        id: true,
                        user: true,
                        date: true,
                    },
                },
                prescriptions: true,
            },
        });

        if(!doctor) {
            return next(new AppError("Doctor not found", 404));
        }

        res.status(200).json({
            status: 'success',
            message: `${doctor?.name} successfully fetched`,
            data: doctor
        });

    } catch (err) {
        return next(new AppError("Error getting the doctor with that Id", 500));
    }
}

export const updateDoctorsDataById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const docId = parseInt(req.params.id);

        const doctor = await prisma.doctor.findUnique({
             where: { id: docId },
             select: { id: true, profilePic: true}
        });

        if (!doctor) return next(new AppError("Doctor not found", 404));
        if(!req.file) return next(new AppError("No file uploaded", 400));

        if (doctor.profilePic) await deleteCloudinaryImage(doctor.profilePic);

        const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
            folder: 'doctor_profile_pictures',
            transformation: [{ width: 500, height: 500, crop: "fill"}, { quality: "auto"}, { fetc_format: "auto"}]
        });

        const { email, password, ...updatedData} = req.body;

        const updateDoctor = await prisma.doctor.update({
            where: { id: docId },
            data: { ...updatedData, profilePic: secure_url } 
        });

        deleteLocalFile(req.file.path);

        res.status(200).json({
            status: 'success',
            message: "Doctor updated successfully",
            data: updateDoctor
        });
        
    } catch (err) {
        if(req.file) deleteLocalFile(req.file.path);
        return next(new AppError("Error updating doctor details", 500));
    }
}

export const deleteDoctorById = async (req: Request, res: Response,  next: NextFunction) => {
    try {
        const docId = parseInt(req.params.id);

        const doctor = await prisma.doctor.findUnique({where: {id: docId}})

        if(!doctor) {
            return next(new AppError("Doctor not found", 404));
        }

        await prisma.doctor.delete({ where: { id: docId }});

        res.status(200).json({
            status: 'success',
            message: "Doctor successfully deleted",
        });

    } catch (err) {
        console.log(err);
        return next(new AppError("Error deleting the specified doctor", 500));
    }
}

export const updateDoctorEmailAndPasswordById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const docId = parseInt(req.params.id);
        const { email, password} = req.body;

        const existingdoctor = await prisma.doctor.findFirst({where: {id: docId}});

        if(!existingdoctor) return next(new AppError("Doctor not found", 404));

        const newemail = await prisma.doctor.findFirst({ where: {email: email}});

        if(newemail) return next(new AppError("Email already exists with another doctor", 404));

        const hashedPassword = await bcrypt.hash(password, 15);

        const doctor = await prisma.doctor.update({
            where: {id: docId},
            data: {
                email: email,
                password: hashedPassword
            }
        });

        const token = jwt.sign({ id: doctor.id}, process.env.JWT_TOKEN!, {expiresIn: "10d"});

        res.status(201).json({
            status: "success",
            message: "Doctor email and password updated successfully",
            token: token,
            data: doctor,
          });


    } catch (err) {
        return next(new AppError("Error updating doctor email and password", 500));
    }
}