import * as jwtDecode from "jwt-decode";

export const decodeToken = (token) => {
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  return decoded.exp * 1000 < Date.now();
};

export const getStoredToken = () => localStorage.getItem("authToken");
export const setStoredToken = (token) => localStorage.setItem("authToken", token);
export const removeStoredToken = () => localStorage.removeItem("authToken");
