export interface User {
    id: number;
    email: string;
    name: string;
    password: string;
    profilePic: string;
    resetToken: string | null;
    resetTokenExpires: string | null;
    role: string;
    loggedOut: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Doctor {
    name: string;
    description: string;
    specialization: string;
    profilePic: string;
    status: string;
    experience: string;
}

export interface Appointment {
    id: number
    userId: number,
    doctorId: number,
    date: Date,
    user: User,
    doctor: Doctor
}

export interface Prescription {
    id: number;
    patientId: number;
    doctorId: number;
    appointmentId: number;
    medication: string;
    dosage: string;
    frequency: string;
    instructions: string;
    prescribedAt: string;  
    duration: string;
    doctor: Doctor;
    appointment: Appointment;
    patient: User;
  }
  