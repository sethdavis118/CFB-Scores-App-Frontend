// Taken from Fitness Trackr Pro (and others)

import { useEffect, useState } from "react";
import { useApi } from "./ApiContext";

/** Queries the API and returns the data, loading status, and error message. */
export default function useQuery(resource, tag) {
  // Gets request and provideTag functions from useApi. These fetch data from Api's and assign tags, respectively.
  const { request, provideTag } = useApi();

  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Querying the API and returning data.
  const query = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await request(resource);
      setData(result);
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Setting the tag on load.
  useEffect(() => {
    if (tag) provideTag(tag, query);
    query();
  }, [resource]);

  return { data, loading, error };
}
