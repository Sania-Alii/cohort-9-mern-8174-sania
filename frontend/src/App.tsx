import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import CreateNote from './pages/CreateNote'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Main Route */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-note" element={<CreateNote />} /> 

      </Routes>
    </BrowserRouter>
  );
}

export default App;