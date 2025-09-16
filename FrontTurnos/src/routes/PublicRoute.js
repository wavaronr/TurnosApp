import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // If the token exists, redirect to the Home page
  if (token) {
    return <Navigate to="/Home" replace />;
  }

  // Otherwise, render the requested component (e.g., Login)
  return children;
};

export default PublicRoute;
