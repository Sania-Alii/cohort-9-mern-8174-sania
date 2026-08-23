import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    // TODO: Implement backend authentication here
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#F5EBE6] font-sans px-4">
      <div className="w-full max-w-md p-10 bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="NoteFlow Logo" className="h-14 w-14 object-contain mb-3 drop-shadow-sm" />
          <h2 className="text-3xl font-extrabold text-slate-800">Welcome Back</h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">Log in to your NoteFlow account</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full px-5 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 bg-[#F8FAFC] focus:bg-white transition-all text-slate-800"
              placeholder="sania@example.com"
            />
            {errors.email && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className="w-full px-5 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 bg-[#F8FAFC] focus:bg-white transition-all text-slate-800"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-4 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-blue-500/30 mt-4"
          >
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500 font-medium">
          Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline font-bold">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;