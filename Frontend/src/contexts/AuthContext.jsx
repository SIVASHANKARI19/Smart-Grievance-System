import React, { createContext, useContext, useState, useEffect } from "react";
import {
  decodeToken,
  getStoredToken,
  setStoredToken,
  removeStoredToken,
  isTokenExpired,
} from "../utils/jwt";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    console.log("TOKEN:", token);

    if (token && !isTokenExpired(token)) {
      const decoded = decodeToken(token);
      console.log("DECODED USER:", decoded);
      setUser(decoded);
    } else {
      removeStoredToken();
      setUser(null);
    }

    setIsLoading(false);
  }, []);

  const login = (token) => {
    setStoredToken(token);
    const decoded = decodeToken(token);
    setUser(decoded);
    console.log("User logged in:", decoded);
  };

  const logout = () => {
    removeStoredToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
