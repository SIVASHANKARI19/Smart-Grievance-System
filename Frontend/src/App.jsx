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
 
  );
}

export default App;
