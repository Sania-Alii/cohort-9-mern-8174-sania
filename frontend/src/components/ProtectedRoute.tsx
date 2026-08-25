import { useContext, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const auth = useContext(AuthContext);

  // Wait until local storage check is complete
  if (!auth?.isInitialized) {
    return null;
  }

  // if user does not have a token, send them back to login page
  if (!auth?.token) {
    return <Navigate to="/login" replace />;
  }

  // if they have a token, they can see the page
  return children;
};