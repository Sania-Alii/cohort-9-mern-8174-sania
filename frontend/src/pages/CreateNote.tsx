import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import JoditEditor from "jodit-react";
import { ArrowLeft, Save, X } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

const CreateNote = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { id } = useParams();
  const isEditMode = Boolean(id); 
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

useEffect(() => {
    document.title = isEditMode ? "Edit Note | NoteFlow" : "New Note | NoteFlow";
    if (isEditMode) {
      if (location.state?.noteData) {
        const note = location.state.noteData;
        setTitle(note.title || "");
        setContent(note.content || "");
      } else {
        const fetchNoteById = async () => {
          try {
            const response = await api.get(`/notes/${id}`);
            if (response.data && response.data.success) {
              const note = response.data.data;
              setTitle(note.title || "");
              setContent(note.content || "");
            }
          } catch (err) {
            console.error("Error fetching note for edit:", err);
          }
        };
        fetchNoteById();
      }
    }
  }, [id, location.state]);
  
  const editorConfig = useMemo(() => ({
    placeholder: isEditMode ? "" : "Start writing..."
  }), [isEditMode]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const noteData = { title, content };
      
      if (isEditMode) {
        
        await api.put(`/notes/${id}`, noteData);
      } else {
        
        await api.post('/notes', noteData);
      }
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Failed to save note:", error);
      alert(error.response?.data?.message || "Failed to save note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#FFFBF7] font-sans">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-4 mb-8">
          <Link 
            to="/dashboard" 
            aria-label="Back to dashboard"
            className="p-3 bg-white rounded-full shadow-sm text-slate-600 hover:text-blue-600 transition-colors border border-gray-100 hover:shadow-md"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h2 className="text-3xl font-extrabold text-slate-800">
            {isEditMode ? "Edit Note" : "Create New Note"}
          </h2>
        </div>

       
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

          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-2">Note Content</label>
            <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm transition-all focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
              <JoditEditor
                value={content}
                config={editorConfig}
                onChange={(newContent) => setContent(newContent)}
              />
            </div>
          </div>

          <div className="flex justify-end items-center gap-4 border-t border-gray-100 pt-6">
            <button 
              type="button"
              onClick={handleCancel}
              className="px-8 py-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 hover:text-slate-800 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-blue-500/30 hover:-translate-y-0.5 disabled:opacity-70"
            >
              <Save className="h-5 w-5" />
              {loading ? "Saving..." : "Save Note"}
            </button>
          </div>

        </form>
      </main>
    </div>
  );
};

export default CreateNote;