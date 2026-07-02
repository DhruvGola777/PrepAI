import { useState } from "react";
import googleLogo from "../assets/googleImage.png"
import { useNavigate } from "react-router-dom";
import { X, Loader2 } from 'lucide-react';
import { useAuth } from "../hooks/useAuth";
import toast from 'react-hot-toast';

const Login = ({ onClose }) => {
    const [state, setState] = useState("login") // "login", "register", "forgot-password"
    const navigate = useNavigate()
    const { login, register, forgotPassword, isLoading, error } = useAuth()
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        let res;
        if (state === "login") {
            res = await login({ email: formData.email, password: formData.password });
        } else if (state === "register") {
            res = await register(formData);
        } else if (state === "forgot-password") {
            res = await forgotPassword(formData.email);
        }

        if (res.success) {
            if (state === "forgot-password") {
                setState("login");
            } else {
                toast.success(state === "login" ? "Logged in successfully!" : "Account created successfully!");
                navigate("/dashboard");
            }
        } else {
            toast.error(res.error || "Request failed");
        }
    }

    const handleGoogleLogin = () => {
        const url = `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/google`;
        const width = 500;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        
        const popup = window.open(url, 'Google Login', `width=${width},height=${height},left=${left},top=${top}`);

        const messageListener = (event) => {
            if (event.data?.type === 'GOOGLE_AUTH_SUCCESS' && event.data?.token) {
                localStorage.setItem('token', event.data.token);
                window.removeEventListener('message', messageListener);
                if (onClose) onClose();
                navigate('/dashboard');
                window.location.reload(); 
            }
        };

        window.addEventListener('message', messageListener);
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const formContent = (
        <form
            onSubmit={handleSubmit}
            className="sm:w-87.5 w-full text-center bg-gray-900 border border-gray-800 rounded-2xl px-8 relative">
            
            {onClose && (
                <button 
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer z-10"
                >
                    <X className="w-6 h-6" />
                </button>
            )}

            <h1 className="text-white text-3xl mt-10 font-medium">
                {state === "login" ? "Login" : state === "register" ? "Sign up" : "Reset Password"}
            </h1>

            <p className="text-gray-400 text-sm mt-2">Please sign in to continue</p>
            
            {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                    {error}
                </div>
            )}

            {state === "register" && (
                <div className="flex items-center mt-6 w-full bg-gray-800 border border-gray-700 h-12 rounded-full overflow-hidden pl-6 gap-2 ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <circle cx="12" cy="8" r="5" /> <path d="M20 21a8 8 0 0 0-16 0" /> </svg>
                    <input type="text" name="name" placeholder="Name" className="w-full bg-transparent text-white placeholder-gray-400 border-none outline-none " value={formData.name} onChange={handleChange} required />
                </div>
            )}

            <div className="flex items-center w-full mt-4 bg-gray-800 border border-gray-700 h-12 rounded-full overflow-hidden pl-6 gap-2 ">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /> <rect x="2" y="4" width="20" height="16" rx="2" /> </svg>
                <input type="email" name="email" placeholder="Email id" className="w-full bg-transparent placeholder-gray-400 border-none outline-none " value={formData.email} onChange={handleChange} required />
            </div>

            {state !== "forgot-password" && (
                <div className=" flex items-center mt-4 w-full bg-gray-800 border border-gray-700 h-12 rounded-full overflow-hidden pl-6 gap-2 ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /> <path d="M7 11V7a5 5 0 0 1 10 0v4" /> </svg>
                    <input type="password" name="password" placeholder="Password" className="w-full bg-transparent text-white placeholder-gray-400 border-none outline-none" value={formData.password} onChange={handleChange} required />
                </div>
            )}

            {state === "login" && (
                <div className="mt-4 text-left">
                    <button type="button" onClick={() => setState("forgot-password")} className="text-sm text-indigo-400 hover:underline cursor-pointer">
                        Forget password?
                    </button>
                </div>
            )}

            <button 
                type="submit" 
                disabled={isLoading || isGoogleLoading}
                className="mt-2 w-full h-11 rounded-full text-gray-300 bg-indigo-600 hover:bg-indigo-500 transition flex justify-center items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin text-white" />
                        {state === "login" ? "Logging in..." : state === "register" ? "Signing up..." : "Sending link..."}
                    </>
                ) : (
                    state === "login" ? "Login" : state === "register" ? "Sign up" : "Send Reset Link"
                )}
            </button>
            <div className="flex items-center gap-4 w-full my-5">
                <div className="w-full h-px bg-gray-300/90"></div>
                <p className="w-full text-nowrap text-sm text-gray-500/90">or sign in with Google</p>
                <div className="w-full h-px bg-gray-300/90"></div>
            </div>
            <button 
                type="button" 
                onClick={handleGoogleLogin}
                disabled={isLoading || isGoogleLoading}
                className="mt-2 w-full h-11 rounded-full text-gray-300 bg-transparent transition flex justify-center items-center justify-center gap-2 border border-gray-700/90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isGoogleLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin text-white" />
                        Connecting...
                    </>
                ) : (
                    <>
                        <img src={googleLogo} alt="Google" className="w-7 h-7" />
                        Login with Google
                    </>
                )}
            </button>
            {state === "forgot-password" ? (
                <p onClick={() => setState("login")} className="text-gray-400 text-sm mt-6 mb-11 cursor-pointer">
                    Back to <span className="text-indigo-400 hover:underline">Login</span>
                </p>
            ) : (
                <p onClick={() => setState(prev => prev === "login" ? "register" : "login") } className="text-gray-400 text-sm mt-3 mb-11 cursor-pointer" >
                    {state === "login" ? "Don't have an account?" : "Already have an account?"}
                    <span className="text-indigo-400 hover:underline ml-1">click here</span>
                </p>
            )}
        </form>
    );

    if (onClose) {
        return formContent;
    }

    return (
        <div className="min-h-screen flex items-center justify-center dark:bg-slate-950">
            {formContent}
        </div>
    )
}

export default Login;