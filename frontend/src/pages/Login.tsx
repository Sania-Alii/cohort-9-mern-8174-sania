import { useForm } from "react-hook-form";
import { useEffect, useContext } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import type { AuthUser } from "../context/AuthContext";
import api from "../api/axios";

interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  token: string;
}

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
 
  useEffect(() => {
    document.title = "Log In | NoteFlow";
  }, []);

  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', data);
      
      // if successful, save user data 
      if (auth) {

        const userData: AuthUser = {
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email
        };
        auth.login(userData, response.data.token);
      }
      
      navigate('/dashboard');
    } catch (error: unknown) {
      console.error("Login error:", error);
      
      let errorMessage = "Invalid email or password";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setError("root", {
        type: "server",
        message: errorMessage
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5EBE6] font-sans px-4 py-8 sm:py-12">
      
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl shadow-stone-900/15 border border-white overflow-hidden transform transition-all duration-500 hover:shadow-stone-900/25">
        
        <div className="md:w-5/12 bg-gradient-to-br from-pink-50 via-amber-50 to-blue-50 p-10 flex flex-col items-center justify-center text-center relative overflow-hidden">
          
          <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-pink-300/40 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-blue-300/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-[30%] right-[-10%] w-48 h-48 bg-yellow-300/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[20%] left-[-10%] w-40 h-40 bg-emerald-300/30 rounded-full blur-3xl"></div>

          <div className="p-6 bg-white/50 backdrop-blur-lg rounded-[2.5rem] shadow-lg border border-white/60 mb-8 relative z-10 transform transition-transform duration-500 hover:scale-105">
            <img src="/logo.png" alt="NoteFlow Logo" className="h-28 w-28 sm:h-32 sm:w-32 object-contain drop-shadow-md" />
          </div>
          <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight relative z-10 mb-2 drop-shadow-sm">Welcome Back !</h2>
          <p className="text-slate-600 text-base font-medium relative z-10">Log in to your NoteFlow account</p>
        </div>
        
        <div className="md:w-7/12 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white relative">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            
            <div className="group relative">
              <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2 transition-colors group-hover:text-blue-600">Email Address</label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="w-full px-5 py-4 border border-stone-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-[#F8FAFC] focus:bg-white shadow-sm hover:border-blue-300 transition-all duration-300 text-slate-800 text-base"
                placeholder="sania@example.com"
              />
              {errors.email && <p className="text-rose-500 text-xs mt-2 font-bold animate-bounce">{errors.email.message}</p>}
            </div>

            <div className="group relative">
              <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-2 transition-colors group-hover:text-blue-600">Password</label>
              <input
                id="password"
                type="password"
                {...register("password")}
                className="w-full px-5 py-4 border border-stone-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-[#F8FAFC] focus:bg-white shadow-sm hover:border-blue-300 transition-all duration-300 text-slate-800 text-base"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-rose-500 text-xs mt-2 font-bold animate-bounce">{errors.password.message}</p>}
            </div>

            {errors.root && (
              <p className="text-rose-500 text-sm font-bold text-center mt-2 bg-rose-50 py-3 rounded-xl border border-rose-100">
                {errors.root.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-4 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white font-extrabold text-lg rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-1 mt-6 disabled:opacity-70 disabled:hover:translate-y-0 relative overflow-hidden group"
            >
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-[shine_1.5s] left-[-100%]"></div>
              <span className="relative z-10">{isSubmitting ? "Signing In..." : "Sign In"}</span>
            </button>

          </form>

          <p className="mt-10 text-center text-sm text-slate-500 font-medium">
            Don't have an account? <Link to="/signup" className="text-blue-600 hover:text-purple-600 hover:underline font-extrabold transition-colors">Sign up</Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shine {
          100% { left: 200%; }
        }
      `}</style>
      
    </div>
  );
};

export default Login;