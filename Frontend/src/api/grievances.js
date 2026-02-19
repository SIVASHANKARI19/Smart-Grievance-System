import apiClient from "./client";

// ✅ Create a grievance
export const createGrievance = async (data) => {
  const response = await apiClient.post("/api/grievances", data);
  return response.data;
};

// ✅ Get grievances created by logged-in citizen
export const getMyGrievances = async () => {
  const response = await apiClient.get("/api/grievances/my");
  return response.data;
};

// ✅ Get grievances by department
export const getDepartmentGrievances = async (department) => {
  const response = await apiClient.get(
    `/api/grievances/department/${department}`
  );
  return response.data;
};

// ✅ Get all grievances (admin)
export const getAllGrievances = async () => {
  const response = await apiClient.get("/api/grievances");
  return response.data;
};

// ✅ Update grievance status
export const updateGrievanceStatus = async (id, data) => {
  const response = await apiClient.put(
    `/api/grievances/${id}/status`,
    data
  );
  return response.data;
};
