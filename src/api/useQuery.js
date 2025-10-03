// Taken from Fitness Trackr Pro (and others)

import { useEffect, useState } from "react";
import { useApi } from "./ApiContext";

/** return data, loading, and error, if needed. */
export default function useQuery(resource, tag) {
  // Gets request and provideTag
  const { request, provideTag } = useApi();

  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  //tags

  useEffect(() => {
    if (!resource) return; //invalid resourse, just return
    if (tag) provideTag(tag, query);
    query();
  }, [resource]);

  return { data, loading, error };
}
