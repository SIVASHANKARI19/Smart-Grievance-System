import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getAllGrievances } from "../api/grievances";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { LogOut, RefreshCw, AlertTriangle } from "lucide-react";

export const AdminDashboard = () => {
  const { user, logout } = useAuth();

  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    critical: 0,
    massComplaints: 0,
  });

  const [departmentStats, setDepartmentStats] = useState({});

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      const data = await getAllGrievances();
      setGrievances(data);
      calculateStats(data);
      calculateDepartmentStats(data);
    } catch (err) {
      console.error("Failed to fetch grievances:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    setStats({
      total: data.length,
      pending: data.filter(g => g.status === "Pending").length,
      inProgress: data.filter(g => g.status === "In Progress").length,
      resolved: data.filter(g => g.status === "Resolved").length,
      critical: data.filter(
        g => g.priority === "Critical" || g.priority === "High"
      ).length,
      massComplaints: data.filter(g => g.massComplaint).length,
    });
  };

  const calculateDepartmentStats = (data) => {
    const deptStats = {};
    data.forEach(g => {
      deptStats[g.department] = (deptStats[g.department] || 0) + 1;
    });
    setDepartmentStats(deptStats);
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login/admin";
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

  const filteredGrievances =
    selectedDepartment === "all"
      ? grievances
      : grievances.filter(g => g.department === selectedDepartment);

  const departments = [...new Set(grievances.map(g => g.department))];

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#1F3A5F]">
              Administrator Dashboard
            </h1>
            <p className="text-sm text-gray-600">
              System Overview & Analytics
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
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: "Total", value: stats.total, color: "text-[#1F3A5F]" },
            { label: "Pending", value: stats.pending, color: "text-amber-600" },
            { label: "In Progress", value: stats.inProgress, color: "text-blue-600" },
            { label: "Resolved", value: stats.resolved, color: "text-green-600" },
            { label: "High Priority", value: stats.critical, color: "text-red-600" },
            { label: "Mass", value: stats.massComplaints, color: "text-orange-600" },
          ].map(item => (
            <Card key={item.label} className="!p-4 text-center">
              <p className="text-xs text-gray-600">{item.label}</p>
              <p className={`text-2xl font-bold ${item.color}`}>
                {item.value}
              </p>
            </Card>
          ))}
        </div>

        <Card title="All Grievances">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin h-8 w-8 border-b-2 border-[#1F3A5F]" />
            </div>
          ) : filteredGrievances.length === 0 ? (
            <p className="text-center text-gray-600 py-8">
              No grievances found
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {["ID", "Description", "Department", "Priority", "Status", "Date"]
                      .map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                          {h}
                        </th>
                      ))}
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {filteredGrievances.map(g => (
                    <tr key={g._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">
                        {g.complaintId}
                        {g.massComplaint && (
                          <AlertTriangle className="inline w-4 h-4 text-red-600 ml-2" />
                        )}
                      </td>

                      <td className="px-4 py-3">{g.description}</td>
                      <td className="px-4 py-3">{g.department}</td>

                      <td className="px-4 py-3">
                        <Badge variant={getPriorityVariant(g.priority)}>
                          {g.priority}
                        </Badge>
                      </td>

                      <td className="px-4 py-3">
                        <Badge variant={getStatusVariant(g.status)}>
                          {g.status}
                        </Badge>
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(g.createdAt).toLocaleDateString()}
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
