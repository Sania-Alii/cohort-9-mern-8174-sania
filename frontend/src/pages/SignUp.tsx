import { useForm } from "react-hook-form";
import { useEffect, useContext } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext, AuthUser } from "../context/AuthContext";
import api from "../api/axios";

interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  token: string;
}

const signUpSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"], 
});

type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUp = () => {
  useEffect(() => {
    document.title = "Create Account | NoteFlow";
  }, []);

  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { register, handleSubmit, setError, formState: { errors } } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const registerData = {
        name: data.name,
        email: data.email,
        password: data.password
      };

      const response = await api.post<AuthResponse>('/auth/register', registerData);
      
      if (auth) {
        // save token 
        const userData: AuthUser = {
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email
        };
        auth.login(userData, response.data.token);
      }
      
      navigate('/dashboard');
    } catch (error: unknown) {
      console.error("Signup error:", error);
      
      let errorMessage = "Registration failed. Please try again.";
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
    <div className="flex h-screen items-center justify-center bg-[#F5EBE6] font-sans px-4">
      <div className="w-full max-w-md p-10 bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100 overflow-y-auto max-h-[95vh]">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" alt="NoteFlow Logo" className="h-12 w-12 object-contain mb-2 drop-shadow-sm" />
          <h2 className="text-2xl font-extrabold text-slate-800">Create Account</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Join NoteFlow today</p>
        </div>
        
       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className="w-full px-5 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 bg-[#F8FAFC] focus:bg-white transition-all text-slate-800"
              placeholder="Sania Ali"
            />
            {errors.name && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full px-5 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 bg-[#F8FAFC] focus:bg-white transition-all text-slate-800"
              placeholder="sania@example.com"
            />
            {errors.email && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-1">Password</label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className="w-full px-5 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 bg-[#F8FAFC] focus:bg-white transition-all text-slate-800"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.password.message}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-bold text-slate-700 mb-1">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              className="w-full px-5 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 bg-[#F8FAFC] focus:bg-white transition-all text-slate-800"
              placeholder="••••••••"
            />
            {errors.confirmPassword && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.confirmPassword.message}</p>}
          </div>

          {/* backend error message */}
          {errors.root && (
            <p className="text-rose-500 text-sm font-bold text-center mt-2">
              {errors.root.message}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-blue-500/30 mt-2"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 font-medium">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline font-bold">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;



