import { createContext, useContext, useState } from "react";

export const API = "http://localhost:3000/api";

const ApiContext = createContext();

export function ApiProvider({ children }) {
  const [user, setUser] = useState(null);

  const request = async (resource, options = {}) => {
    const normalized = resource.startsWith("/") ? resource : `${resource}`;
    const token = localStorage.getItem("token");

    const res = await fetch(API + normalized, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Request failed: ${res.status}`);
    }

    return res.json();
  };
  return (
    <ApiContext.Provider value={{ request, user, setUser }}>
      {children}
    </ApiContext.Provider>
  );
}

export const useApi = () => {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error("useApi must be used within ApiProvider");
  return ctx;
};
