import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Context";

export default function ProtectedRoute({ children }) {

  // Get auth state from context
  const { user, loading } = useAuth();

  // While checking authentication (API call in progress)
  if (loading) return <p className="p-6">Loading...</p>;

  // If user not authenticated → redirect to login page
  if (!user) return <Navigate to="/login" />;

  // If authenticated → render protected content
  return children;
}