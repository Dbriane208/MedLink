/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { loginDoctor, loginUser } from "../../api/Api";

const LoginPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        const newToken = localStorage.getItem('token');
        if (newToken) {
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
      console.log("token",token);
      const role = data?.data.role;
      console.log("role",role);

      if (token && role == "user") {
        localStorage.setItem('token', JSON.stringify({ token }));
        setSuccess('Login successful');
        setError('');
        setEmail('');
        setPassword('');

        navigate('/home');
      } 

      if(token && role == "admin"){
        localStorage.setItem('token', JSON.stringify({ token }));
        setSuccess('Login successful');
        setError('');
        setEmail('');
        setPassword('');

        navigate('/admin')
      }
    },

    onError: () => {
      setError('Login failed. Check credentials. Please try again.');
      setSuccess('');
    },
  });

  const docMutation = useMutation({
    mutationFn: loginDoctor,
    onSuccess: (data: any) => {
      const token = data?.token;
      console.log("Doc token", token)
      const role = data?.data.role;

      if (token && role == "doctor") {
        localStorage.setItem('doctor', JSON.stringify({ token }));
        setSuccess('Login successful');
        setError('');
        setEmail('');
        setPassword('');

        navigate('/doctor');
      }

    },
    onError: (error: any) => {
      setError('Login failed. Check credentials. Please try again.');
      console.log("Doctor error", error)
      setSuccess('');
    }
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    mutation.mutate({ email, password });
    docMutation.mutate({email,password});
  };

  // Determine if either mutation is loading
  const isLoading = mutation.isPending || docMutation.isPending;

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
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
              disabled={isLoading}
              className="w-full py-3 border border-[#3B9DF8] bg-[#3B9DF8] text-[#ffffff] hover:bg-[#ffffff] hover:text-[#3B9DF8] transition duration-300 rounded-md disabled:opacity-50 flex justify-center items-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Login'
              )}
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
    </div>
  );
};

export default LoginPage;