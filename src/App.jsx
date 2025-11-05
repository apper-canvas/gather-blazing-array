import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { router } from "@/router";
import { useEffect } from "react";

// Initialize ApperClient globally for email notifications
const initializeApperClient = () => {
  if (typeof window !== 'undefined' && window.ApperSDK) {
    window.apperClient = new window.ApperSDK.ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }
};

function App() {
  useEffect(() => {
    // Initialize ApperClient when SDK is loaded
    initializeApperClient();
    
    // Listen for SDK load event if it's not already loaded
    const handleSDKLoad = () => {
      initializeApperClient();
    };
    
    if (!window.ApperSDK) {
      window.addEventListener('ApperSDKLoaded', handleSDKLoad);
      return () => window.removeEventListener('ApperSDKLoaded', handleSDKLoad);
    }
  }, []);

return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;