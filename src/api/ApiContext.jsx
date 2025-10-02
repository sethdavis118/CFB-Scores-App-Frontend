// From Fitness Trackr Pro (and other places)
import { createContext, useContext, useState } from "react";

export const API = "http://localhost:3000";

const ApiContext = createContext();

// Token support may need to be added later.
export function ApiProvider({ children }) {
  const headers = { "Content-Type": "application/json" };

  /**
   * Makes an API call and parses the response as JSON if possible.
   * Throws an error if anything goes wrong.
   */
  const request = async (resource, options) => {
    // Fetches from the API.
    const response = await fetch(API + resource, {
      ...options,
      headers,
    });
    const isJson = /json/.test(response.headers.get("Content-Type"));
    const result = isJson ? await response.json() : undefined;
    if (!response.ok) throw Error(result?.message ?? "Something went wrong.");
    return result;
  };

  // Creating tags object to update certain objects.
  const [tags, setTags] = useState({});

  /** Stores the provided query function for a given tag */
  const provideTag = (tag, query) => {
    setTags({ ...tags, [tag]: query });
  };

  /** Calls all query functions associated with the given tags */
  const invalidateTags = (tagsToInvalidate) => {
    tagsToInvalidate.forEach((tag) => {
      const query = tags[tag];
      if (query) query();
    });
  };

  const value = { request, provideTag, invalidateTags };
  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export function useApi() {
  const context = useContext(ApiContext);
  if (!context) throw Error("useApi must be used within ApiProvider");
  return context;
}
