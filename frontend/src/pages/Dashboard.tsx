import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import api from "../api/axios";
import { Plus, Calendar, Eye, Pencil, Trash2, X } from "lucide-react";

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface NotesResponse {
  success: boolean;
  data: Note[];
}

const Dashboard = () => {
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  
  const [viewNote, setViewNote] = useState<Note | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Dashboard | NoteFlow";
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await api.get<NotesResponse>("/notes");
      
      if (response.data && response.data.success) {
        setNotes(response.data.data);
      }
    } catch (err: unknown) {
      console.error("Error loading notes:", err);
      setError("Failed to load notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (id: string) => {
    setNoteToDelete(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setNoteToDelete(null);
    setShowDeleteModal(false);
  };

  // delete note from db 
  const confirmDelete = async () => {
    if (!noteToDelete) return;

    try {
      await api.delete(`/notes/${noteToDelete}`);

      const updatedNotes = notes.filter((note) => note._id !== noteToDelete);
      setNotes(updatedNotes);
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Something went wrong while deleting.");
    } finally {
      setShowDeleteModal(false);
      setNoteToDelete(null);
    }
  };

  // send note data to edit page
  const handleEdit = (note: Note) => {
    navigate(`/edit-note/${note._id}`, { state: { noteData: note } });
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: "numeric", 
      month: "short", 
      day: "numeric" 
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getCardTheme = (index: number) => {
    const themes = [
      { bgColor: "bg-[#D6EFFF]", textColor: "text-[#004A77]" },
      { bgColor: "bg-[#FFE4B5]", textColor: "text-[#7A4B00]" },
      { bgColor: "bg-[#F9D6FF]", textColor: "text-[#6A0077]" },
      { bgColor: "bg-[#D4F7D4]", textColor: "text-[#005500]" }
    ];
    return themes[index % themes.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-amber-50 to-blue-50 font-sans">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Your Workspace</h1>
            <p className="text-gray-500 mt-2 font-medium">Manage and organize your thoughts</p>
          </div>
          
          <Link 
            to="/create-note" 
            className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300"
          >
            <Plus className="h-5 w-5" />
            New Note
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 font-medium">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-gray-500 text-center mt-20 font-medium">Loading notes...</div>
        ) : notes.length === 0 ? (
          <div className="text-center mt-24">
            <h3 className="text-xl font-bold text-gray-700 mb-2">No notes found</h3>
            <p className="text-gray-500 mb-6">You haven't created any notes yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note, index) => {
              const theme = getCardTheme(index);
              
              return (
                <div 
                  key={note._id} 
                  className={`${theme.bgColor} rounded-[2rem] p-7 shadow-sm hover:shadow-md transition-all duration-300 relative group min-h-[220px]`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className={`text-xl font-bold ${theme.textColor} pr-2`}>
                      {note.title}
                    </h3>
                    
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleEdit(note)}
                        aria-label="Edit note" 
                        className={`${theme.textColor} opacity-60 hover:opacity-100 transition-opacity`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => openDeleteModal(note._id)}
                        aria-label="Delete note" 
                        className={`${theme.textColor} opacity-40 hover:opacity-100 hover:text-red-600 transition-all`}
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                  
                  <div 
                    className={`${theme.textColor} opacity-80 text-sm mb-12 leading-relaxed line-clamp-3 font-medium overflow-hidden`}
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(note.content) }}
                  />
                  
                  <div className="flex justify-between items-center absolute bottom-7 left-7 right-7">
                    <div className={`text-xs font-bold ${theme.textColor} opacity-70 flex items-center gap-1.5`}>
                      <Calendar className="h-4 w-4" />
                      {formatDate(note.createdAt)}
                    </div>
                    <button 
                      onClick={() => setViewNote(note)}
                      aria-label="View note"
                      className={`${theme.textColor} opacity-50 hover:opacity-100 transition-opacity cursor-pointer`}
                    >
                      <Eye className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Link 
          to="/create-note" 
          aria-label="Create new note"
          className="sm:hidden fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-transform z-50"
        >
          <Plus className="h-7 w-7" />
        </Link>
      </main>

      {viewNote && (
        <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-xl border border-gray-100 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900 pr-4">{viewNote.title}</h2>
              <div className="flex items-center gap-4 shrink-0">
                <button 
                  onClick={() => {
                    setViewNote(null);
                    handleEdit(viewNote);
                  }}
                  aria-label="Edit note" 
                  className="text-gray-400 hover:text-gray-800 transition-colors"
                >
                  <Pencil className="h-5 w-5" />
                </button>
                <button 
                 onClick={() => setViewNote(null)}
                 aria-label="Close note view"
                 className="text-gray-400 hover:text-gray-800 transition-colors"
                 >
                <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-6 border-b border-gray-100 pb-4">
              <Calendar className="h-4 w-4" />
              {formatDate(viewNote.createdAt)}
            </div>
            <div 
              className="text-gray-700 text-base leading-relaxed jodit-wysiwyg"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(viewNote.content) }}
            />
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Note</h3>
            <p className="text-gray-500 text-sm mb-8 font-medium">Are you sure you want to delete this note? This action cannot be undone.</p>
            <div className="flex justify-end gap-3 items-center">
              <button 
                onClick={closeDeleteModal}
                className="text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;