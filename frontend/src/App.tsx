import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import CreateNote from './pages/CreateNote'; 
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Routes, only logged in users can access */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/create-note" 
          element={
            <ProtectedRoute>
              <CreateNote />
            </ProtectedRoute>
          } 
        /> 
        <Route 
          path="/edit-note/:id" 
          element={
            <ProtectedRoute>
              <CreateNote />
            </ProtectedRoute>
          } 
        /> 

      </Routes>
    </BrowserRouter>
  );
}

export default App;