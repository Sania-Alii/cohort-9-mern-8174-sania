import { useEffect } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { Plus, MoreVertical, Calendar, CheckCircle2 } from "lucide-react";

const Dashboard = () => {
  useEffect(() => {
    document.title = "Dashboard | NoteFlow";
  }, []);
  // dummy data 
  const notes = [
    { 
      id: 1, 
      title: "Architecture Review", 
      content: "Finalize the Pino logger setup and integrate SonarQube. Ensure Mocha/Chai tests hit 80% coverage.", 
      date: "Aug 22, 2026",
      bgColor: "bg-[#D6EFFF]", 
      textColor: "text-[#004A77]",
      tag: "Engineering"
    },
    { 
      id: 2, 
      title: "Grocery List", 
      content: "Eggs, Milk, Bread, Apples, and some snacks for the weekend.", 
      date: "Aug 21, 2026",
      bgColor: "bg-[#FFE4B5]", 
      textColor: "text-[#7A4B00]",
      tag: "Personal"
    },
    { 
      id: 3, 
      title: "UI/UX Enhancements", 
      content: "Implement soft shadows, rounded corners, and pastel color schemes to improve user experience.", 
      date: "Aug 20, 2026",
      bgColor: "bg-[#F9D6FF]", 
      textColor: "text-[#6A0077]",
      tag: "Design"
    },
    { 
      id: 4, 
      title: "Sprint Planning", 
      content: "Discuss stacked PR workflow with the team. Need to review the branching strategy document.", 
      date: "Aug 19, 2026",
      bgColor: "bg-[#D4F7D4]", 
      textColor: "text-[#005500]",
      tag: "Management"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFFBF7] font-sans">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">All Notes</h1>
            <p className="text-gray-500 mt-2 font-medium">Colorful & beautiful notes</p>
          </div>
          
          {/* Create Button */}
          <Link 
            to="/create-note" 
            className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300"
          >
            <Plus className="h-5 w-5" />
            New Note
          </Link>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div 
              key={note.id} 
              className={`${note.bgColor} rounded-[2rem] p-7 shadow-sm hover:shadow-md transition-all duration-300 relative group`}
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-3">
                <h3 className={`text-xl font-bold ${note.textColor}`}>
                  {note.title}
                </h3>
                <button aria-label="Open note actions" className={`${note.textColor} opacity-50 hover:opacity-100 transition-opacity`}>
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
              
              {/* Card Content */}
              <p className={`${note.textColor} opacity-80 text-sm mb-10 leading-relaxed line-clamp-3 font-medium`}>
                {note.content}
              </p>
              
              {/* Card Footer */}
              <div className="flex justify-between items-center absolute bottom-7 left-7 right-7">
                <div className={`text-xs font-bold ${note.textColor} opacity-70 flex items-center gap-1.5`}>
                  <Calendar className="h-4 w-4" />
                  {note.date}
                </div>
                <CheckCircle2 className={`h-6 w-6 ${note.textColor} opacity-50`} />
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Floating Action Button */}
        <Link 
          to="/create-note" 
          aria-label="Create new note"
          className="sm:hidden fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-transform z-50"
        >
          <Plus className="h-7 w-7" />
        </Link>

      </main>
    </div>
  );
};

export default Dashboard;