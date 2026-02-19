import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { login as apiLogin } from "../api/auth";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { AlertCircle, Users } from "lucide-react";

export const LoginCitizen = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

 
    if (isAuthenticated && user?.role === "citizen") {
    return <Navigate to="/citizen/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await apiLogin(formData);
      console.log("LOGIN RESPONSE:", response); // { token }

      login(response.token); // 🔥 REQUIRED
      navigate("/citizen/dashboard");
    } catch {
      setError("Login failed");
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
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#1F3A5F] mb-2">Citizen Portal</h1>
          <p className="text-gray-600">Public Grievance Redressal System</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="citizen@example.com"
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
              <a
                href="/login/department"
                className="text-[#1F3A5F] hover:underline font-medium"
              >
                Department Official
              </a>{" "}
              |{" "}
              <a
                href="/login/admin"
                className="text-[#1F3A5F] hover:underline font-medium"
              >
                Administrator
              </a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
