import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { login as apiLogin } from "../api/auth";
import { decodeToken } from "../utils/jwt";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { AlertCircle, Building2 } from "lucide-react";

export const LoginDepartment = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Already logged in → redirect
  if (isAuthenticated && user?.role === "DepartmentOfficial") {
    return <Navigate to="/department/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await apiLogin(formData);
      const decoded = decodeToken(response.token);

      if (decoded?.role !== "DepartmentOfficial") {
        setError(
          "Unauthorized role for this portal. Please use the correct login portal for your role."
        );
        setLoading(false);
        return;
      }

      login(response.token);
      navigate("/department/dashboard");
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1F3A5F] rounded-full mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#1F3A5F] mb-2">Department Portal</h1>
          <p className="text-gray-600">Official Grievance Management System</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Input
              label="Official Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="official@department.gov"
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-center text-gray-600">
              Different portal?{" "}
              <a href="/login/citizen" className="text-[#1F3A5F] hover:underline font-medium">
                Citizen
              </a>{" "}
              |{" "}
              <a href="/login/admin" className="text-[#1F3A5F] hover:underline font-medium">
                Administrator
              </a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
