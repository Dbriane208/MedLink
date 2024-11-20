/* eslint-disable @typescript-eslint/no-explicit-any */
import { RiAccountCircleLine, RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineMail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../../api/Api";

const RegisterPage = () => {
    const [name, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: registerUser,
        onSuccess: (data: any) => {
            const token = data?.token;

            if (token) {
                localStorage.setItem("token", JSON.stringify({ token }));
                setSuccess("Registration successful!");
                setError("");
                navigate("/home");
            } else {
                setError(data.message);
                setSuccess("");
            }
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || "Registration failed. Please try again.";
            console.error("Registration failed:", errorMessage);
            setError(errorMessage);
            setSuccess("");
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setSuccess("");
            return;
        }

        setError("");
        setSuccess("");
        mutation.mutate({ name, email, password, confirmPassword });
    };

    return (
        <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
            <div className="flex flex-col justify-center items-center w-full max-w-md p-8 rounded-lg shadow-lg bg-white">
                <h1 className="text-2xl font-semibold text-center mb-6 text-gray-700">Sign Up</h1>
                <p className="text-center text-gray-500 mb-4">Please register to access your dashboard.</p>

                <form onSubmit={handleSubmit} className="space-y-4 w-full">
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    {success && <div className="text-green-500 text-sm">{success}</div>}

                    {/* Username */}
                    <div className="w-full relative my-2">
                        <RiAccountCircleLine className="absolute top-3.5 left-3 text-[1.5rem] text-[#777777]" />
                        <input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Username"
                            value={name}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="peer border-[#e5eaf2] border rounded-md outline-none pl-10 pr-4 py-3 w-full focus:border-[#3B9DF8] transition-colors duration-300"
                        />
                    </div>

                    {/* Email */}
                    <div className="w-full relative my-2">
                        <MdOutlineMail className="absolute top-3.5 left-3 text-[1.5rem] text-[#777777]" />
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="peer border-[#e5eaf2] border rounded-md outline-none pl-10 pr-4 py-3 w-full focus:border-[#3B9DF8] transition-colors duration-300"
                        />
                    </div>

                    {/* Password */}
                    <div className="w-full relative my-2">
                        <RiLockPasswordLine className="absolute top-3.5 left-3 text-[1.5rem] text-[#777777]" />
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="peer border-[#e5eaf2] border rounded-md outline-none pl-10 pr-4 py-3 w-full focus:border-[#3B9DF8] transition-colors duration-300"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="w-full relative my-2">
                        <RiLockPasswordLine className="absolute top-3.5 left-3 text-[1.5rem] text-[#777777]" />
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="peer border-[#e5eaf2] border rounded-md outline-none pl-10 pr-4 py-3 w-full focus:border-[#3B9DF8] transition-colors duration-300"
                        />
                    </div>

                    {/* Button */}
                    <div className="w-full relative my-2">
                        <button
                            type="submit"
                            className="w-full py-3 border border-[#3B9DF8] bg-[#3B9DF8] text-[#ffffff] hover:bg-[#ffffff] hover:text-[#3B9DF8] transition duration-300 rounded-md disabled:opacity-50"
                        >
                            Register
                        </button>
                    </div>
                </form>
                <p className="text-center text-gray-500 mb-4">
                    Already have an account?{' '}
                    <span
                        onClick={() => navigate('/login')}
                        className="text-blue-500 cursor-pointer hover:underline"
                    >
                        Login
                    </span>.
                </p>
            </div>
        </div>

    );
};

export default RegisterPage;
