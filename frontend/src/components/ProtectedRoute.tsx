import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const auth = useContext(AuthContext);

  // if user doesn't have a token, send them back to login page
  if (!auth?.token) {
    return <Navigate to="/login" replace />;
  }

  // if they have a token, they can see page
  return children;
};