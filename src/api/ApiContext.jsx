// From Fitness Trackr Pro (and other places)
import { createContext, useContext, useState } from "react";

export const API = "http://localhost:3000";

const ApiContext = createContext();

export function ApiProvider({ children }) {
  const [user, setUser] = useState(null);

  const request = async (resource, options = {}) => {
    const res = await fetch(resource, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Request failed: ${res.status}`);
    }

    // handle empty responses
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) return null;
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
