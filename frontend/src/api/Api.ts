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

export interface UpdateUserNameAndPassword {
    email: string,
    name: string
}

interface Appointment {
    userId: number,
    doctorId: number,
    date: Date
}

export const registerUser = async (userData: RegisterUserData): Promise<any> => {
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

export const loginUser = async (userData: LoginUserData): Promise<any> => {
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

// get user by Id
export const getUserbyId = async (userId: number): Promise<any> => {
    try {
        const token: any = localStorage.getItem("token");

        if(!token) {
            console.log("No token found in local storage");
        }

        const usertoken = JSON.parse(token)

        const url = `${BASE_URL}/users/${userId}`

        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${usertoken.token}`
            }
        });

        return response.data;
    } catch (err) {
        const er = handleAxiosError(err)
        if(er) {
            console.log("Error getting the User:", er);
        }
    }
}

// update user name and password by Id
export const updateUserNameAndEmailById = async (details: UpdateUserNameAndPassword, userId: number): Promise<any> => {
    try {
        const token: any = localStorage.getItem("token");

        if(!token) {
            console.log("No token found in local storage");
        }

        const usertoken = JSON.parse(token)

        const url = `${BASE_URL}/users/${userId}`

        const response = await axios.patch(url, details, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${usertoken.token}`
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

// get appointment by id
export const getAppointmentByUserId = async (userId: number): Promise<any> => {
    try {
        const token: any = localStorage.getItem("token");

        if(!token) {
            console.log("No token found in local storage");
        }

        const usertoken = JSON.parse(token)

        const url = `${BASE_URL}/bookings/user/${userId}`

        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                 Authorization: `Bearer ${usertoken.token}`
            }
        });

        return response.data

    } catch (err) {
        const er = handleAxiosError(err)
        if(er) {
            console.log("Error getting user appointments:", er);
        }
    }
}

// get appointment by id
export const deleteAppointmentId = async (appId: number): Promise<any> => {
    try {
        const token: any = localStorage.getItem("token");

        if(!token) {
            console.log("No token found in local storage");
        }

        const usertoken = JSON.parse(token)

        const url = `${BASE_URL}/bookings/${appId}`

        const response = await axios.delete(url, {
            headers: {
                'Content-Type': 'application/json',
                 Authorization: `Bearer ${usertoken.token}`
            }
        });

        return response.data

    } catch (err) {
        const er = handleAxiosError(err)
        if(er) {
            console.log("Error deleting user appointments:", er);
        }
    }
}



// get prescription by user id
export const getPrescriptionsByUserId = async (userId: number): Promise<any> => {
    try {
        const token: any = localStorage.getItem("token");

        if(!token) {
            console.log("No token found in local storage");
        }

        const usertoken = JSON.parse(token)

        const url = `${BASE_URL}/prescriptions/user/${userId}`

        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                 Authorization: `Bearer ${usertoken.token}`
            }
        });

        return response.data

    } catch (err) {
        const er = handleAxiosError(err)
        if(er) {
            console.log("Error getting user prescriptions:", er);
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