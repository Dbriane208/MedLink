/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/Api";

const LoginPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      navigate('/home');
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        const newToken = localStorage.getItem('token');
        if (newToken) {
          navigate('/home');
        } else {
          navigate('/home');
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate]);

  const mutation = useMutation({
    mutationFn: loginUser,

    onSuccess: (data: any) => {
      const token = data?.token;

      if (token) {
        localStorage.setItem('token', JSON.stringify({ token }));
        setSuccess('Login successful');
        setError('');
        setEmail('');
        setPassword('');

        navigate('/home');
      } else {
        setError(data.message);
      }
    },
    onError: (error: any) => {
      setError(error?.response?.data?.message || 'Login failed. Please try again.');
      setSuccess('');
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    mutation.mutate({ email, password });
  };

  return (
    <div className="flex flex-col justify-center items-center w-full max-w-md p-8 rounded-lg shadow-lg bg-white">
      <h1 className="text-2xl font-semibold text-center mb-6 text-gray-700">Sign In</h1>
      <p className="text-center text-gray-500 mb-4">Please Login to access your dashboard.</p>

      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-500 text-sm">{success}</div>}

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

        {/* Button */}
        <div className="w-full relative my-2">
          <button
            type="submit"
            className="w-full py-3 border border-[#3B9DF8] bg-[#3B9DF8] text-[#ffffff] hover:bg-[#ffffff] hover:text-[#3B9DF8] transition duration-300 rounded-md disabled:opacity-50"
          >
            Login
          </button>
        </div>
      </form>

      <p className="text-center text-gray-500 mb-4">
        Don't have an account?{' '}
        <span
          onClick={() => navigate('/register')}
          className="text-blue-500 cursor-pointer hover:underline"
        >
          Register
        </span>
      </p>
    </div>
  ); 
};

export default LoginPage;
