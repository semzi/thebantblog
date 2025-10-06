// src/hooks/useFetch.ts
import { useEffect, useState } from "react";

export function useFetch<T>(fetchFn: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const result = await fetchFn();
        if (mounted) setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, deps);

  return { data, loading, error };
}
