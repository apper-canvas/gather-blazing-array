import { Outlet, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/Footer";

const Layout = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Route protection logic
  const isPublicRoute = ['/', '/events', '/about', '/login', '/signup'].includes(location.pathname) || 
                       location.pathname.startsWith('/events/');
  const isAuthRoute = ['/login', '/signup'].includes(location.pathname);
  const isProtectedRoute = ['/dashboard', '/my-events', '/create-event', '/profile'].includes(location.pathname) ||
                          location.pathname.startsWith('/edit-event/');

  // Redirect logic for auth routes
  if (isAuthRoute && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Redirect logic for protected routes
  if (isProtectedRoute && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Outlet context to pass auth state to child components
  const outletContext = {
    isAuthenticated,
    isPublicRoute,
    isProtectedRoute
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1">
          <Outlet context={outletContext} />
        </main>
        <Footer />
      </div>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="text-sm"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
};

export default Layout;