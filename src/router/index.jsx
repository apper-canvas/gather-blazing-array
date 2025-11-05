import { createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import { getRouteConfig } from "./route.utils";
import Root from "@/layouts/Root";
import Layout from "@/components/organisms/Layout";

// Lazy load all page components
// Page components
const Home = lazy(() => import('@/components/pages/Home'));
const Events = lazy(() => import('@/components/pages/Events'));
const EventDetails = lazy(() => import('@/components/pages/EventDetails'));
const About = lazy(() => import('@/components/pages/About'));
const Login = lazy(() => import('@/components/pages/Login'));
const Signup = lazy(() => import('@/components/pages/Signup'));
const Dashboard = lazy(() => import('@/components/pages/Dashboard'));
const MyEvents = lazy(() => import('@/components/pages/MyEvents'));
const CreateEvent = lazy(() => import('@/components/pages/CreateEvent'));
const EditEvent = lazy(() => import('@/components/pages/EditEvent'));
const Profile = lazy(() => import('@/components/pages/Profile'));
const NotFound = lazy(() => import('@/components/pages/NotFound'));

// Authentication components
const Callback = lazy(() => import('@/components/pages/Callback'));
const ErrorPage = lazy(() => import('@/components/pages/ErrorPage'));
const ResetPassword = lazy(() => import('@/components/pages/ResetPassword'));
const PromptPassword = lazy(() => import('@/components/pages/PromptPassword'));

// Suspense wrapper
const createRoute = ({
  path,
  index,
  element,
  access,
  children,
  ...meta
}) => {
  // Get config for this route
  let configPath;
  if (index) {
    configPath = "/";
  } else {
    configPath = path.startsWith('/') ? path : `/${path}`;
  }

  const config = getRouteConfig(configPath);
  const finalAccess = access || config?.allow;

  const route = {
    ...(index ? { index: true } : { path }),
    element: element ? <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>}>{element}</Suspense> : element,
    handle: {
      access: finalAccess,
      ...meta,
    },
  };

  if (children && children.length > 0) {
    route.children = children;
  }

  return route;
};

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>
);

// Wrap components with Suspense
const withSuspense = (Component) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

// Main routes configuration

// Router configuration
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "",
        element: <Layout />,
        children: [
          createRoute({ index: true, element: <Home /> }),
          createRoute({ path: "events", element: <Events /> }),
          createRoute({ path: "events/:id", element: <EventDetails /> }),
          createRoute({ path: "about", element: <About /> }),
          createRoute({ path: "login", element: <Login /> }),
          createRoute({ path: "signup", element: <Signup /> }),
          createRoute({ path: "dashboard", element: <Dashboard /> }),
          createRoute({ path: "my-events", element: <MyEvents /> }),
          createRoute({ path: "create-event", element: <CreateEvent /> }),
          createRoute({ path: "edit-event/:id", element: <EditEvent /> }),
          createRoute({ path: "profile", element: <Profile /> }),
          createRoute({ path: "callback", element: <Callback /> }),
          createRoute({ path: "error", element: <ErrorPage /> }),
          createRoute({ path: "reset-password/:appId/:fields", element: <ResetPassword /> }),
          createRoute({ path: "prompt-password/:appId/:emailAddress/:provider", element: <PromptPassword /> }),
          createRoute({ path: "*", element: <NotFound /> })
        ]
      }
    ]
}
]);