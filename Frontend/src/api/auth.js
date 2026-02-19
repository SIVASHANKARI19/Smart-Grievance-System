import apiClient from "./client";

/**
 * Login API call
 * @param {Object} credentials
 * @param {string} credentials.email
 * @param {string} credentials.password
 */
export const login = async (credentials) => {
  const response = await apiClient.post("/api/auth/login", credentials);
  return response.data;
};

/**
 * Logout API call
 */
export const logout = async () => {
  await apiClient.post("/api/auth/logout");
};
