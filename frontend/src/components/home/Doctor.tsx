/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import { createAppointment, getDoctors } from "../../api/Api";
import { handleAxiosError } from "../../utils/AxiosError";
import { useState, useEffect } from "react";
import { Doctor } from "../../api/ModelInterfaces";
import { checkAuthAndGetUserId } from "../../utils/CurrentUser";

export default function Doctors() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [date, setAppointmentDate] = useState<Date | null>(null);
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        const id = checkAuthAndGetUserId();
        if (id) {
            setUserId(id);
        }
    }, []);

    const {mutate: fetchDoctors} = useMutation({
        mutationFn: getDoctors,
        onSuccess: (data: any) => {
            const doctorsArray = Array.isArray(data)
                ? data
                : data?.data
                    ? Array.isArray(data.data)
                        ? data.data
                        : []
                    : [];

            if (doctorsArray.length > 0) {
                setDoctors(doctorsArray);
                setError(null);
            } else {
                setError("No doctors available.");
            }
            setLoading(false);
        },
        onError: (error: any) => {
            const errData = handleAxiosError(error);
            const errorMessage = typeof errData === "string" ? errData : "An unknown error occurred.";
            setError(errorMessage);
            setLoading(false);
        },
    });

    const appointmentMutation = useMutation({
        mutationFn: createAppointment,
        onSuccess: (data: any) => {
            console.log("Appointment successfull", data);
            setLoading(false);
            setShowPopup(false);
        },
        onError: (error: any) => {
            const errData = handleAxiosError(error);
            const errorMessage = typeof errData === "string" ? errData : "An unknown error occurred.";
            setError(errorMessage);
            setLoading(false);
        },
    });

    const handleCreateAppointment = () => {
        if (!date || !selectedDoctor || !userId) {
            setError("Please fill in all required fields.");
            return;
        }
        setLoading(true);
        appointmentMutation.mutate({
            userId,
            doctorId: selectedDoctor.id,
            date: date,
        });
    };

    useEffect(() => {
        setLoading(true);
        fetchDoctors();
    }, [fetchDoctors]);

    const handleBookNow = (doctor: Doctor) => {
        setSelectedDoctor(doctor);
        setAppointmentDate(null);
        setShowPopup(true);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="bg-gradient-to-b from-blue-50 to-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
                        Our Medical Professionals
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
                        Expert healthcare providers ready to help you.
                    </p>
                </div>

                {doctors.length === 0 ? (
                    <div className="text-center text-gray-600">No doctors found.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {doctors.map((doctor, index) => (
                            <div
                                key={index}
                                className="bg-white shadow-xl rounded-xl p-8 flex flex-col items-center text-center transform transition duration-300 hover:shadow-2xl hover:-translate-y-1"
                            >
                                <div className="relative">
                                    <img
                                        src={doctor.profilePic}
                                        alt={`${doctor.name}'s profile`}
                                        className="w-24 h-24 rounded-full mb-6 shadow-lg object-cover border-4 border-blue-100"
                                    />
                                </div>

                                <div className="space-y-1 mb-3">
                                    <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs ${doctor.status.toLowerCase() === 'available'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                    {doctor.specialization}
                                </span>
                                </div>

                                <span className={`px-2 py-1 mb-3 rounded-full text-xs ${doctor.status.toLowerCase() === 'available'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                    {doctor.status}
                                </span>

                                <p className="text-gray-600 mb-6 text-sm leading-relaxed min-h-[80px]">
                                    {doctor.description}
                                </p>

                                <div className="mt-auto space-y-4 w-full">
                                    <div className="flex justify-center text-sm text-gray-600">
                                        <span>Experience: {doctor.experience} years</span>
                                    </div>
                                    <div className="flex justify-center">
                                        <button
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                                            onClick={() => handleBookNow(doctor)}
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pop-up Card */}
            {showPopup && selectedDoctor && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Book Appointment</h3>
                        <p className="text-gray-600 mb-4">
                            Doctor ID: <strong>{selectedDoctor.id}</strong>
                        </p>
                        <p className="text-gray-600 mb-4">
                            User ID: <strong>{userId}</strong>
                        </p>
                        <div className="mb-4">
                            <label htmlFor="date" className="text-gray-700 block mb-2">
                                Appointment Date
                            </label>
                            <input
                                type="date"
                                id="date"
                                value={date ? date.toISOString().split('T')[0] : ""}
                                onChange={(e) => setAppointmentDate(new Date(e.target.value))}
                                className="peer border-[#e5eaf2] border rounded-md outline-none pl-10 pr-4 py-3 w-full focus:border-[#3B9DF8] transition-colors duration-300"
                            />
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={handleCreateAppointment}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Create
                            </button>
                            <button
                                onClick={() => setShowPopup(false)}
                                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
