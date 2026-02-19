import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  getDepartmentGrievances,
  updateGrievanceStatus,
} from "../api/grievances";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { LogOut, RefreshCw, AlertTriangle } from "lucide-react";

export const DepartmentDashboard = () => {
  const { user, logout } = useAuth();

  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  useEffect(() => {
    if (user?.department) {
      fetchGrievances();
    }
  }, [user]);

  const fetchGrievances = async () => {
    if (!user?.department) return;

    try {
      const data = await getDepartmentGrievances(user.department);
      setGrievances(data);
      calculateStats(data);
    } catch (err) {
      console.error("Failed to fetch grievances:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    setStats({
      total: data.length,
      pending: data.filter((g) => g.status === "Pending").length,
      inProgress: data.filter((g) => g.status === "In Progress").length,
      resolved: data.filter((g) => g.status === "Resolved").length,
    });
  };

  const handleStatusUpdate = async (id, status) => {
    setUpdating(id);
    try {
      await updateGrievanceStatus(id, { status });
      fetchGrievances();
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login/department";
  };

  const getStatusVariant = (status) => {
    const map = {
      Pending: "pending",
      "In Progress": "in-progress",
      Resolved: "resolved",
    };
    return map[status] || "pending";
  };

  const getPriorityVariant = (priority) => {
    const map = {
      Low: "low",
      Medium: "medium",
      High: "high",
      Critical: "critical",
    };
    return map[priority] || "low";
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#1F3A5F]">
              Department Dashboard
            </h1>
            <p className="text-sm text-gray-600">
              {user?.department} | Official ID: {user?.userId}
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={fetchGrievances}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="secondary" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="!p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Grievances</p>
              <p className="text-3xl font-bold text-[#1F3A5F]">
                {stats.total}
              </p>
            </div>
          </Card>

          <Card className="!p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-amber-600">
                {stats.pending}
              </p>
            </div>
          </Card>

          <Card className="!p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-blue-600">
                {stats.inProgress}
              </p>
            </div>
          </Card>

          <Card className="!p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-3xl font-bold text-green-600">
                {stats.resolved}
              </p>
            </div>
          </Card>
        </div>

        <Card title="Grievance Management">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin h-8 w-8 border-b-2 border-[#1F3A5F]" />
            </div>
          ) : grievances.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No grievances assigned to your department
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold">
                      Complaint ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold">
                      Priority
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold">
                      Created Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {grievances.map((g) => (
                    <tr key={g._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          {g.complaintId}
                          {g.massComplaint && (
                            <AlertTriangle className="w-4 h-4 text-red-600 ml-2" />
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-4 max-w-md">
                        <p className="text-sm line-clamp-2">
                          {g.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {g.category}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <Badge variant={getPriorityVariant(g.priority)}>
                          {g.priority}
                        </Badge>
                        {g.priorityScore && (
                          <span className="text-xs ml-2 text-gray-500">
                            ({g.priorityScore.toFixed(2)})
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <Badge variant={getStatusVariant(g.status)}>
                          {g.status}
                        </Badge>
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-600">
                        {new Date(g.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-4">
                        <select
                          value={g.status}
                          disabled={updating === g._id}
                          onChange={(e) =>
                            handleStatusUpdate(g._id, e.target.value)
                          }
                          className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-[#4A7BA7]"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};
