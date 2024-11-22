export interface User {
    id: number;
    email: string;
    name: string;
    password: string;
    profilePic: string;
    resetToken: string | null;
    resetTokenExpires: string | null;
    token: string;
    loggedOut: boolean;
    createdAt: string;
    updatedAt: string;
    data: User
}

export interface Doctor {
    id: number
    name: string;
    email: string;
    description: string;
    specialization: string;
    profilePic: string;
    status: string;
    experience: string;
    data: Doctor
}

export interface Appointment {
    id: number
    userId: number,
    doctorId: number,
    date: Date,
    doctor: Doctor,
    user: User
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
  