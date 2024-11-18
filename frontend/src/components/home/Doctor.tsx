/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import { getDoctors } from "../../api/Api";
import { handleAxiosError } from "../../utils/AxiosError";
import { useState, useEffect } from "react";
import { Doctor } from "../../api/ModelInterfaces";

export default function Doctors() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const mutation = useMutation({
        mutationFn: getDoctors,
        onSuccess: (data: any) => {
            const doctorsArray = Array.isArray(data) ? data : 
                (data?.data ? (Array.isArray(data.data) ? data.data : []) : []);
            
            if (doctorsArray.length > 0) {
                setDoctors(doctorsArray);
                console.log("Doctors fetched successfully", doctorsArray);
                setError(null);
            } else {
                console.error("No doctors data found");
                setError("No doctors available.");
            }
            setLoading(false);
        },
        onError: (error: any) => {
            const errData = handleAxiosError(error);
            const errorMessage = typeof errData === "string" ? errData : "An unknown error occurred.";
            setError(errorMessage);
            console.error("Error fetching doctors:", errorMessage);
            setLoading(false);
        }
    });

    // UseEffect to trigger the fetch once
    useEffect(() => {
        setLoading(true);
        mutation.mutate();
    }, []); 

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

                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
                                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium`}>
                                        {doctor.specialization}
                                    </span>
                                </div>

                                <p className="text-gray-600 mt-4 mb-6 text-sm leading-relaxed min-h-[80px]">
                                    {doctor.description}
                                </p>

                                <div className="mt-auto space-y-4 w-full">
                                    <div className="flex justify-center text-sm text-gray-600">
                                        <span>Experience: {doctor.experience} years</span>
                                    </div>
                                    <div className="flex justify-center">
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}