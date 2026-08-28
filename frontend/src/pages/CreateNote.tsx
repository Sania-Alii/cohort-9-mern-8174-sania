import { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import JoditEditor from "jodit-react";
import { ArrowLeft, Save } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

const CreateNote = () => {
  useEffect(() => {
    document.title = "New Note | NoteFlow";
  }, []);
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Work");
  const [priority, setPriority] = useState("Normal");
  const [content, setContent] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/notes', {
        title,
        category,
        priority,
        content
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Failed to save note:", error);
      alert(error.response?.data?.message || "Failed to save note. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5EBE6] font-sans">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            to="/dashboard" 
            aria-label="Back to dashboard"
            className="p-3 bg-white rounded-full shadow-sm text-slate-600 hover:text-blue-600 transition-colors border border-gray-100 hover:shadow-md"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h2 className="text-3xl font-extrabold text-slate-800">Create New Note</h2>
        </div>

        {/* Note Editor Form */}
        <form onSubmit={handleSave} className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100 p-8 sm:p-10">
          
          <div className="mb-8">
            <label htmlFor="title" className="block text-sm font-bold text-slate-700 mb-2">Note Title</label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              className="w-full px-5 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 bg-[#F8FAFC] focus:bg-white transition-all text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <label htmlFor="category" className="block text-sm font-bold text-slate-700 mb-2">Category</label>
              <select 
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-5 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 bg-[#F8FAFC] focus:bg-white transition-all text-slate-800"
              >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Study">Study</option>
                <option value="Engineering">Engineering</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="priority" className="block text-sm font-bold text-slate-700 mb-2">Priority</label>
              <select 
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-5 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 bg-[#F8FAFC] focus:bg-white transition-all text-slate-800"
              >
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="mb-10">
            <label className="block text-sm font-bold text-slate-700 mb-2">Note Content</label>
            <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm transition-all focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
              <JoditEditor
                value={content}
                onChange={(newContent) => setContent(newContent)}
              />
            </div>
          </div>

          <div className="flex justify-end border-t border-gray-100 pt-8">
            <button 
              type="submit"
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-blue-500/30 hover:-translate-y-0.5"
            >
              <Save className="h-5 w-5" />
              Save Note
            </button>
          </div>

        </form>
      </main>
    </div>
  );
};

export default CreateNote;

