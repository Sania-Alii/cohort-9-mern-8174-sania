import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* App Logo & Name */}
          <div className="flex items-center gap-2.5">
            <img 
              src="/logo.png" 
              alt="NoteFlow Logo" 
              className="h-10 w-10 object-contain drop-shadow-sm hover:scale-105 transition-transform duration-300"
            />
            <h1 className="text-2xl font-extrabold text-[#004A77] tracking-tight">
              NoteFlow
            </h1>
          </div>
          
          {/* User Profile & Actions */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 border-r border-gray-200 pr-4">
              <div className="h-8 w-8 rounded-full bg-[#D6EFFF] flex items-center justify-center text-[#004A77] font-bold text-sm">
                SA
              </div>
              <span className="text-sm font-bold text-gray-700">Sania Ali</span>
            </div>
            
            <Link 
              to="/login" 
              className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;