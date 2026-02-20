import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginCitizen } from './pages/LoginCitizen';
import { LoginDepartment } from './pages/LoginDepartment';
import { LoginAdmin } from './pages/LoginAdmin';
import CitizenDashboard  from './pages/CitizenDashboard';
import { DepartmentDashboard } from './pages/DepartmentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthProvider } from './contexts/AuthContext';

// Simple role-based protection using localStorage
const RoleProtectedRoute = ({ children, allowedRole }) => {
  const role = localStorage.getItem('role');

  if (role?.toLowerCase() !== allowedRole.toLowerCase()) {
    // Not authorized → redirect to respective login page
    if (allowedRole.toLowerCase() === 'citizen') return <Navigate to="/login/citizen" replace />;
    if (allowedRole.toLowerCase() === 'officer') return <Navigate to="/login/department" replace />;
    if (allowedRole.toLowerCase() === 'admin') return <Navigate to="/login/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login/citizen" replace />} />

        {/* Login routes */}
        <Route path="/login/citizen" element={<LoginCitizen />} />
        <Route path="/login/department" element={<LoginDepartment />} />
        <Route path="/login/admin" element={<LoginAdmin />} />

        {/* Dashboards with role-based protection */}
        <Route
          path="/citizen/dashboard"
          element={
            <RoleProtectedRoute allowedRole="citizen">
              <CitizenDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/department/dashboard"
          element={
            <RoleProtectedRoute allowedRole="officer">
              <DepartmentDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <RoleProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </RoleProtectedRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/login/citizen" replace />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
