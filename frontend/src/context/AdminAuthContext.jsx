// context/AdminAuthContext.jsx
import { createContext, useContext, useState } from "react";
import api from "../utils/api";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("admin_token"));

  async function login(username, password) {
    const res = await api.post("/auth/login", { username, password });
    localStorage.setItem("admin_token", res.data.token);
    setToken(res.data.token);
    return res.data;
  }

  function logout() {
    localStorage.removeItem("admin_token");
    setToken(null);
  }

  return (
    <AdminAuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
