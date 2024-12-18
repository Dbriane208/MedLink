/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { FaPrescriptionBottleMedical, FaUserDoctor } from "react-icons/fa6";
import { LuHelpCircle, LuLogOut } from "react-icons/lu";
import { FaTimes } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { createDoctor, getAppointments, getDoctors, getPrescriptions, getUserbyId } from "../../api/Api";
import { handleAxiosError } from "../../utils/AxiosError";
import { formatDate } from "../../utils/FormatDate";
import { Appointment, Doctor, Prescription, User } from "../../api/ModelInterfaces";
import { checkAuthAndGetUserId } from "../../utils/CurrentUser";
import { useNavigate } from "react-router-dom";

const AdminSidebar = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showAppointments, setShowAppointments] = useState(false);
    const [showPrescriptions, setShowPrescriptions] = useState(false);
    const [showDoctors, setShowDoctors] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [user, setUser] = useState<User>();
    const [showPopup, setShowPopup] = useState(false);
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [specialization, setSpecialization] = useState<string>('');
    const [experience, setExperience] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showDoctorForm, setShowDoctorForm] = useState(false);
    const navigate = useNavigate();


    const getUser = useMutation({
        mutationFn: (id: number) => getUserbyId(id),
        onSuccess: (data: User) => {
            console.log("User data", data)
            setUser(data)
            setError(null)
        },
        onError: (error) => {
            const errData = handleAxiosError(error);
            const errorMessage = typeof errData === "string" ? errData : "An unknown error occurred.";
            setError(errorMessage);
            setLoading(false);
        }
    });

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

    const mutPrescription = useMutation({
        mutationFn: getPrescriptions,
        onSuccess: (data: any) => {
            const prescriptionArray = Array.isArray(data) ? data :
                (data?.data ? (Array.isArray(data.data) ? data.data : []) : []);

            if (prescriptionArray.length > 0) {
                setPrescriptions(prescriptionArray);
                console.log("Prescriptions fetched successfully", prescriptionArray);
                // setError(null)
            } else {
                console.error("No prescription data found");
            }
            setLoading(false);
        },
        onError: (error: any) => {
            const errData = handleAxiosError(error);
            const errorMessage = typeof errData === "string" ? errData : "An unknown error occurred.";
            setError(errorMessage);
            console.error("Error fetching prescriptions:", errorMessage);
            setLoading(false);
        }
    });

    const mutDoctors = useMutation({
        mutationFn: getDoctors,
        onSuccess: (data: any) => {
            const doctorsArray = Array.isArray(data) ? data :
                (data?.data ? (Array.isArray(data.data) ? data.data : []) : []);

            if (doctorsArray.length > 0) {
                setDoctors(doctorsArray);
                console.log("Doctors fetched successfully", doctorsArray);
                setError(null)
            } else {
                console.error("No Doctors data found");
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

    const doctorMutation = useMutation({
        mutationFn: createDoctor,
        onSuccess: (data: any) => {
            console.log("Doctor created successfully", data);
            setLoading(false);
            setShowDoctorForm(false);
            // Clear form fields
            setName('');
            setEmail('');
            setPassword('');
            setDescription('');
            setSpecialization('');
            setExperience('');
            setError(null);
            // Refresh doctors list
            mutDoctors.mutate();
        },
        onError: (error: any) => {
            console.log("Doctor not created", error);
            const errData = handleAxiosError(error);
            const errorMessage = typeof errData === "string" ? errData : "An unknown error occurred.";
            setError(errorMessage);
            setLoading(false);
        },
    });

    useEffect(() => {
        setLoading(true);
        const id = checkAuthAndGetUserId();

        if (id) {
            console.log(id);
            setUserId(id);
            getUser.mutate(id);
        }

        Promise.all([
            mutPrescription.mutate(id),
            mutation.mutate(id),
            mutDoctors.mutate(),
        ]).finally(() => {
            setLoading(false);
        });
    }, [userId]);

    const handleCloseAppointments = () => setShowAppointments(false);
    const handleClosePrescriptions = () => setShowPrescriptions(false);
    const handleCloseDoctors = () => setShowDoctors(false);

    const handleLogout = () => {
        const token = localStorage.removeItem("token")
        console.log("logout token", token);

        navigate("/login")
    }
    const handleDoctor = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!name || !email || !description || !specialization || !experience || !password) {
            setError("Please fill in all required fields.");
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        setLoading(true);
        doctorMutation.mutate({
            name,
            email,
            password,
            description,
            specialization,
            experience
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="relative">
            <aside className="py-6 px-4 bg-white shadow-md rounded-md flex flex-col h-screen">
                <div className="flex flex-col items-center gap-4">
                    <div className="flex flex-col justify-center relative">
                        <div className="flex items-center justify-center">
                            <img
                                src={user?.data.profilePic}
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
                    <p className="text-gray-500 font-[400] text-sm ">Your Details</p>
                    <div className="mt-6">
                        <div className="flex flex-col gap-3">

                            <div className="flex gap-2 text-sm">
                                <span className="font-bold text-gray-700">Name:</span>
                                <span className="text-gray-600">{user?.data.name || "N/A"}</span>
                            </div>

                            <div className="flex gap-2 text-sm">
                                <span className="font-bold text-gray-700">Email:</span>
                                <span
                                    className="text-gray-600 truncate max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
                                    title={user?.data.email}
                                >
                                    {user?.data.email || "N/A"}
                                </span>
                            </div>

                            <button
                                onClick={() => setShowPopup(true)}
                                className="bg-blue-500 text-white rounded-md px-4 py-2 mt-4"
                            >
                                Update Details
                            </button>
                        </div>
                    </div>

                </div>


                <div className="mt-6">
                    <p className="text-gray-500 font-[400] text-sm mb-2">General</p>
                    <div className="flex flex-col gap-3">

                        {/* All Prescriptions */}
                        <div
                            className="flex items-center gap-4 hover:bg-gray-50 p-2 rounded-md cursor-pointer"
                            onClick={() => setShowPrescriptions(true)}
                        >
                            <FaPrescriptionBottleMedical className="text-xl text-gray-800" />
                            <p className="text-sm font-medium text-gray-800">All Prescriptions</p>
                        </div>

                        {/* Add Doctors */}
                        <div
                            className="flex items-center gap-4 hover:bg-gray-50 p-2 rounded-md cursor-pointer"
                            onClick={() => setShowDoctorForm(true)}
                        >
                            <FaUserDoctor className="text-xl text-gray-800" />
                            <p className="text-sm font-medium text-gray-800">Add Doctors</p>
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
                        <div className="flex items-center gap-4 hover:bg-gray-50 p-2 rounded-md cursor-pointer">
                            <LuLogOut className="text-xl text-gray-800" />
                            <p
                                onClick={handleLogout}
                                className="text-sm font-medium text-gray-800"
                            >Logout</p>
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
                        <h2 className="text-lg text-black font-bold mb-4">All Appointments</h2>
                        {appointments.map((appointment) => (
                            <div
                                key={appointment.id}
                                className="border-b border-gray-200 py-4 flex items-center justify-between"
                            >
                                <div className="flex flex-col">
                                    <div className="flex gap-2 text-sm">
                                        <span className="text-gray-500">Patient Name:</span>
                                        <span className="text-gray-500">{user?.data.name || "N/A"}</span>
                                    </div>
                                    <div className="flex gap-2 text-sm">
                                        <span className="text-gray-500">Doctor Name:</span>
                                        <span className="text-gray-500">{appointment.doctor?.name || "N/A"}</span>
                                    </div>
                                    <div className="flex gap-2 text-sm">
                                        <span className="text-gray-500">Time:</span>
                                        <span className="text-gray-500">{formatDate(new Date(appointment.date))}</span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Update</button>
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Pop-up Card */}
            {showDoctors && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white w-11/12 md:w-1/2 max-h-[80%] overflow-y-auto rounded-md shadow-lg p-6 relative">
                        <button
                            className="absolute top-4 right-4 text-black hover:text-gray-700"
                            onClick={handleCloseDoctors}
                        >
                            <FaTimes size={24} />
                        </button>
                        <h2 className="text-lg text-black font-bold mb-4">All Doctors</h2>
                        {doctors.map((doctor) => (
                            <div
                                key={doctor.id}
                                className="border-b border-gray-200 py-4 flex items-center justify-between"
                            >
                                <div className="flex flex-col">
                                    <div className="flex gap-2 text-sm">
                                        <span className="text-gray-500">Doctor Name:</span>
                                        <span className="text-gray-500">{doctor.name || "N/A"}</span>
                                    </div>
                                    <div className="flex gap-2 text-sm">
                                        <span className="text-gray-500">Doctor Email:</span>
                                        <span className="text-gray-500">{doctor.email || "N/A"}</span>
                                    </div>
                                    <div className="flex gap-2 text-sm">
                                        <span className="text-gray-500">Doctor Experience:</span>
                                        <span className="text-gray-500">{doctor.experience || "N/A"}</span>
                                    </div>
                                    <div className="flex gap-2 text-sm">
                                        <span className="text-gray-500">Doctor Description:</span>
                                        <span className="text-gray-500">{doctor.description || "N/A"}</span>
                                    </div>
                                    <div className="flex gap-2 text-sm">
                                        <span className="text-gray-500">Doctor Specialization:</span>
                                        <span className="text-gray-500">{doctor.specialization || "N/A"}</span>
                                    </div>
                                    <div className="flex gap-2 text-sm">
                                        <span className="text-gray-500">Doctor Status:</span>
                                        <span className="text-gray-500">{doctor.status || "N/A"}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showPrescriptions && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white w-11/12 md:w-1/2 max-h-[80%] overflow-y-auto rounded-md shadow-lg p-6 relative">
                        <button
                            className="absolute top-4 right-4 text-black hover:text-gray-700"
                            onClick={handleClosePrescriptions}
                        >
                            <FaTimes size={24} />
                        </button>
                        <h2 className="text-lg text-black font-bold mb-4">All Prescriptions</h2>
                        {prescriptions.map((prescription) => (
                            <div
                                key={prescription.id}
                                className="border-b border-gray-200 py-4"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex flex-col">
                                        <div className="flex gap-2 text-sm">
                                            <span className="text-gray-500">Patient Name:</span>
                                            <span className="text-gray-500">{user?.data.name}</span>
                                        </div>
                                        <div className="flex gap-2 text-sm">
                                            <span className="text-gray-500">Doctor Name:</span>
                                            <span className="text-gray-500">{prescription.doctor.name}</span>
                                        </div>
                                        <div className="flex gap-2 text-sm">
                                            <span className="text-gray-500">Prescribed Date:</span>
                                            <span className="text-gray-500">
                                                {formatDate(new Date(prescription.prescribedAt))}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                        >
                                            Update
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-md">
                                    <h3 className="font-medium text-gray-700 mb-2">Prescription Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex gap-2 text-sm">
                                                <span className="text-gray-500">Medication:</span>
                                                <span className="text-gray-700">{prescription.medication}</span>
                                            </div>
                                            <div className="flex gap-2 text-sm">
                                                <span className="text-gray-500">Dosage:</span>
                                                <span className="text-gray-700">{prescription.dosage}</span>
                                            </div>
                                            <div className="flex gap-2 text-sm">
                                                <span className="text-gray-500">Frequency:</span>
                                                <span className="text-gray-700">{prescription.frequency}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex gap-2 text-sm">
                                                <span className="text-gray-500">Duration:</span>
                                                <span className="text-gray-700">{prescription.duration}</span>
                                            </div>
                                            <div className="flex gap-2 text-sm">
                                                <span className="text-gray-500">Instructions:</span>
                                                <span className="text-gray-700">{prescription.instructions}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white w-11/12 md:w-1/3 rounded-md shadow-lg p-6 relative">
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPopup(false)}
                        >
                            <FaTimes size={24} />
                        </button>
                        <h2 className="text-lg font-bold mb-4 text-gray-800">Update Your Details</h2>
                        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                            >
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {showDoctorForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white w-11/12 md:w-1/3 rounded-md shadow-lg p-6 relative">
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowDoctorForm(false)}
                        >
                            <FaTimes size={24} />
                        </button>
                        <h2 className="text-lg font-bold mb-4 text-gray-800">Add New Doctor</h2>
                        <form className="flex flex-col gap-4" onSubmit={handleDoctor}>
                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter doctor's name"
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter doctor's email"
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter doctor's default password"
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter doctor's description"
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">Specialization</label>
                                <input
                                    type="text"
                                    value={specialization}
                                    onChange={(e) => setSpecialization(e.target.value)}
                                    placeholder="Enter doctor's specialization"
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">Experience (in years)</label>
                                <input
                                    type="number"
                                    value={experience}
                                    onChange={(e) => setExperience(e.target.value)}
                                    placeholder="Enter doctor's experience"
                                    min="0"
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Create Doctor'}
                            </button>
                        </form>
                    </div>
                </div>
            )}


        </div>
    );
};

export default AdminSidebar;
