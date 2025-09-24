// Taken from Fitness Trackr Pro (and others)

import { useState } from "react";
import { useApi } from "./ApiContext";

/**
 * Returns a function to mutate some data via the API, as well as some state
 * that tracks the response of that mutation request.
 */
export default function useMutation(method, resource, tagsToInvalidate) {
  // Getting the request and invalidateTags functions from useApi.
  const { request, invalidateTags } = useApi();

  // Defining the variables that this function will return.
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const mutate = async (body) => {
    setLoading(true);
    setError(null);
    let result;
    try {
      if (token) {
        result = await request(resource, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        result = await request(resource, {
          method,
          body: JSON.stringify(body),
        });
      }
      setData(result);
      invalidateTags(tagsToInvalidate);
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return { mutate, data, loading, error };
}
