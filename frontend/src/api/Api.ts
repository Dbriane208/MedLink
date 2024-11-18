/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { handleAxiosError } from "../utils/AxiosError";

const BASE_URL = 'http://localhost:3000/api/v1'

interface RegisterUserData {
    name: string,
    email: string,
    password: string,
    confirmPassword: string
}

interface LoginUserData {
    email: string,
    password: string
}

interface Appointment {
    userId: number,
    doctorId: number,
    date: Date
}

export const registerUser = async (userData: RegisterUserData): Promise<string | undefined> => {
    try {
        const url = `${BASE_URL}/users/register`;

        const response = await axios.post(url, userData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (err) {
        const er = handleAxiosError(err)
        if(er) {
            console.log("Error registering in User:", er);
        }
    }
}

export const loginUser = async (userData: LoginUserData): Promise<string | undefined> => {
    try {
        const url = `${BASE_URL}/users/login`

        const response = await axios.post(url, userData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (err) {
        const er = handleAxiosError(err)
        if(er) {
            console.log("Error Logging in User:", er);
        }
    }
}


// create an appointment
export const createAppointment = async (book: Appointment): Promise<any> => {
    try {
        const url = `${BASE_URL}/bookings`

        const response = await axios.post(url, book, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data;

    } catch (err) {
        const er = handleAxiosError(err)
        if(er) {
            console.log("Error creating appointment:", er);
        }
    }
}

// get all appointment
export const getAppointments = async (): Promise<any> => {
    try {
        const url = `${BASE_URL}/bookings`

        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data

    } catch (err) {
        const er = handleAxiosError(err)
        if(er) {
            console.log("Error getting appointments:", er);
        }
    }
}

// get all prescriptions
export const getPrescriptions = async (): Promise<any> => {
    try {
        const url = `${BASE_URL}/prescriptions`

        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data
    } catch (err) {
        const er = handleAxiosError(err)
        if(er) {
            console.log("Error getting prescriptions:", er);
        } 
    }
}

// get all doctors
export const getDoctors = async (): Promise<any> => {
    try {
        const url = `${BASE_URL}/doctors`

        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data
    } catch (err) {
        const er = handleAxiosError(err)
        if(er) {
            console.log("Error getting doctors:", er);
        }
    }
}