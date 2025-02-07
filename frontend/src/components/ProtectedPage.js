import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

function ProtectedPage({ children }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
}

export default ProtectedPage; 