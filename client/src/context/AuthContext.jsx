import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

const getErrorMessage = (err, fallback) => {
  return (
    err?.response?.data?.message ||
    err?.message ||
    fallback
  );
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("istore_auth");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed.user);
      setToken(parsed.token);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("istore_auth", JSON.stringify(data));
      return { ok: true };
    } catch (err) {
      return { ok: false, message: getErrorMessage(err, "Invalid credentials.") };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post("/auth/register", { name, email, password });
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("istore_auth", JSON.stringify(data));
      return { ok: true };
    } catch (err) {
      return { ok: false, message: getErrorMessage(err, "Signup failed.") };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("istore_auth");
  };

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}