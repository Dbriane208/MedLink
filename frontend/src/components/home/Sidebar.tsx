/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useEffect, useState } from "react";
import { MdSchedule } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUserDoctor, FaPrescriptionBottleMedical } from "react-icons/fa6";
import { LuHelpCircle } from "react-icons/lu";
import { FaTimes } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { getAppointments } from "../../api/Api";
import { handleAxiosError } from "../../utils/AxiosError";
import { formatDate } from "../../utils/FormatDate";
import { Appointment } from "../../api/ModelInterfaces";


const ResponsiveSidebar = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showAppointments, setShowAppointments] = useState(false);

    const mutation = useMutation({
        mutationFn: getAppointments,
        onSuccess: (data: any) => {
            const appointmentArray = Array.isArray(data) ? data :
                (data?.data ? (Array.isArray(data.data) ? data.data : []) : []);

            if (appointmentArray.length > 0) {
                setAppointments(appointmentArray);
                console.log("Appointments fetched successfully", appointmentArray);
                setError(null);
            } else {
                console.error("No appointment data found");
                setError("No Appointments available");
            }
            setLoading(false);
        },
        onError: (error: any) => {
            const errData = handleAxiosError(error);
            const errorMessage = typeof errData === "string" ? errData : "An unknown error occurred.";
            setError(errorMessage);
            console.error("Error fetching appointments:", errorMessage);
            setLoading(false);
        }
    });

    useEffect(() => {
        setLoading(true)
        mutation.mutate()
    }, []);

    // if (loading) {
    //     return <div>Loading...</div>;
    // }

    // if (error) {
    //     return <div className="text-red-500">{error}</div>;
    // }

    // Example user details
    const [userDetails, setUserDetails] = useState({
        name: "John Doe",
        email: "johndoe@example.com",
        photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80"
    });

    const [editDetails, setEditDetails] = useState({
        name: userDetails.name,
        email: userDetails.email,
        photo: userDetails.photo
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setEditDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
    };

    const handleSave = () => {
        setUserDetails(editDetails);
    };

    const handleCloseAppointments = () => setShowAppointments(false);

    return (
        <div className="relative">
            <aside className="py-6 px-4 bg-white shadow-md rounded-md flex flex-col h-screen">
                <div className="flex flex-col items-center gap-4">
                    <div className="flex flex-col justify-center relative">
                        <div className="flex items-center justify-center">
                            <img
                                src={userDetails.photo}
                                alt="profile picture"
                                className="w-24 h-24 rounded-full mb-6 shadow-lg object-cover border-4 border-blue-100"
                            />
                        </div>
                        <button className="bg-blue-500 text-white rounded-md px-4 py-2 mt-2">
                            Update Profile Photo
                        </button>
                        <button className="bg-blue-500 text-white rounded-md px-4 py-2 mt-2">
                            Update Password
                        </button>
                    </div>
                </div>

                <div className="mt-6">
                    <p className="text-gray-500 font-[400] text-sm mb-4">Update Your Details</p>
                    <div className="flex flex-col gap-3">
                        <input
                            type="text"
                            name="name"
                            value={editDetails.name}
                            onChange={handleInputChange}
                            placeholder="Name"
                            className="p-2 border rounded-md text-sm"
                        />
                        <input
                            type="email"
                            name="email"
                            value={editDetails.email}
                            onChange={handleInputChange}
                            placeholder="Email"
                            className="p-2 border rounded-md text-sm"
                        />
                        <button
                            onClick={handleSave}
                            className="bg-blue-500 text-white rounded-md px-4 py-2 mt-2"
                        >
                            Save
                        </button>
                    </div>
                </div>

                <div className="mt-6">
                    <p className="text-gray-500 font-[400] text-sm mb-2">General</p>
                    <div className="flex flex-col gap-3">
                        {/* All Appointments */}
                        <div
                            className="flex items-center gap-4 hover:bg-gray-50 p-2 rounded-md cursor-pointer"
                            onClick={() => setShowAppointments(true)}
                        >
                            <MdSchedule className="text-xl text-gray-800" />
                            <p className="text-sm font-medium text-gray-800">All Appointments</p>
                        </div>

                        {/* All Prescriptions */}
                        <div className="flex items-center gap-4 hover:bg-gray-50 p-2 rounded-md cursor-pointer">
                            <FaPrescriptionBottleMedical className="text-xl text-gray-800" />
                            <p className="text-sm font-medium text-gray-800">All Prescriptions</p>
                        </div>

                        {/* Doctors */}
                        <div className="flex items-center gap-4 hover:bg-gray-50 p-2 rounded-md cursor-pointer">
                            <FaUserDoctor className="text-xl text-gray-800" />
                            <p className="text-sm font-medium text-gray-800">Doctors</p>
                        </div>
                    </div>
                </div>


                <div className="mt-auto">
                    <p className="text-gray-500 font-[400] text-sm mb-2">Support</p>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-4 hover:bg-gray-50 p-2 rounded-md cursor-pointer">
                            <IoSettingsOutline className="text-xl text-gray-800" />
                            <p className="text-sm font-medium text-gray-800">Settings</p>
                        </div>
                        <div className="flex items-center gap-4 hover:bg-gray-50 p-2 rounded-md cursor-pointer">
                            <LuHelpCircle className="text-xl text-gray-800" />
                            <p className="text-sm font-medium text-gray-800">Help!</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Pop-up Card */}
            {showAppointments && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white w-11/12 md:w-1/2 max-h-[80%] overflow-y-auto rounded-md shadow-lg p-6 relative">
                        <button
                            className="absolute top-4 right-4 text-black hover:text-gray-700"
                            onClick={handleCloseAppointments}
                        >
                            <FaTimes size={24} />
                        </button>
                        <h2 className="text-lg font-bold mb-4">All Appointments</h2>
                        {appointments.map((appointment) => (
                            <div
                                key={appointment.id}
                                className="border-b border-gray-200 py-4 flex items-center justify-between"
                            >
                                <div className="flex flex-col">
                                    <div className="flex gap-2 text-sm">
                                        <span className="text-gray-500">Patient Name:</span>
                                        <span className="text-gray-500">{appointment.user.name}</span>
                                    </div>
                                    <div className="flex gap-2 text-sm">
                                        <span className="text-gray-500">Doctor Name:</span>
                                        <span className="text-gray-500">{appointment.doctor.name}</span>
                                    </div>
                                    <div className="flex gap-2 text-sm">
                                        <span className="text-gray-500">Time:</span>
                                        <span className="text-gray-500">{formatDate(new Date(appointment.date))}</span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Update</button>
                                    <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default ResponsiveSidebar;
