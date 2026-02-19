import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // ⏳ Still checking auth (page refresh, initial load)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F3A5F]"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // 🔒 Not logged in
  if (!isAuthenticated || !user) {
    return <Navigate to="/login/citizen" replace />;
  }

  // 🚦 Logged in but wrong role
  if (!allowedRoles.includes(user.role)) {
    const roleRedirects = {
      citizen: "/citizen/dashboard",
      department: "/department/dashboard",
      admin: "/admin/dashboard",
    };

    return (
      <Navigate
        to={roleRedirects[user.role] || "/login/citizen"}
        replace
      />
    );
  }

  // ✅ Authorized
  return <>{children}</>;
};
