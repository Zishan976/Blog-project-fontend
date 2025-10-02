import React, { useState, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import "./index.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ContentManagement from "./pages/ContentManagement";
import BlogViewer from "./pages/BlogViewer";
import Sidebar from "./components/Sidebar";
import BlogPost from "./pages/BlogPost";

function Layout() {
  return (
    <div className="flex h-screen bg-gray-100 up-down">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto ">
        <Outlet />
      </main>
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <BlogViewer />,
      errorElement: <NotFound />,
    },
    {
      path: "/post/:id",
      element: <BlogPost />,
      errorElement: <NotFound />,
    },
    {
      path: "/admin",
      element: isAuthenticated ? <Layout /> : <Navigate to="/login" replace />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: "", element: <Dashboard /> },
        { path: "content-management", element: <ContentManagement /> },
      ],
    },
    {
      path: "/login",
      element: isAuthenticated ? (
        <Navigate to="/admin" replace />
      ) : (
        <Login onLogin={() => setIsAuthenticated(true)} />
      ),
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
