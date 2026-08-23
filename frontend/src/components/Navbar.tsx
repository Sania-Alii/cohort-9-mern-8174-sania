import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  // get user details from context
  const user = auth?.user;
  
   const getInitials = (name: string | undefined) => {
  if (!name) return "U";

    const parts = name.split(" ");
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const handleLogout = () => {
    if (auth) {
      auth.logout(); 
      navigate('/login'); 
    }
  };

  return (
    <nav className="bg-[#FAF6F0]/90 backdrop-blur-md border-b border-[#E3D4C6] sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo & Name */}
          <div className="flex items-center gap-2.5">
            <img 
              src="/logo.png" 
              alt="NoteFlow Logo" 
              className="h-10 w-10 object-contain drop-shadow-sm hover:scale-105 transition-transform duration-300"
            />
            <h1 className="text-2xl font-extrabold text-blue-600 tracking-tight">
              NoteFlow
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 border-r border-gray-300/60 pr-4">
              <div className="h-8 w-8 rounded-full bg-[#D6EFFF] flex items-center justify-center text-[#004A77] font-bold text-sm">
                {getInitials(user?.name)}
              </div>
              <span className="text-sm font-bold text-gray-700">
                {user?.name || "User"}
              </span>
            </div>
            
            <button 
              onClick={handleLogout}
              aria-label="Logout"
              className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;