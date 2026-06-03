import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export function useQuery(queryStr: string | null = null) {
  const location = useLocation();

  return useMemo(() => {
    const queryParams = new URLSearchParams(queryStr ?? location.search);

    const resultObject: Record<string, string> = {};

    queryParams.forEach((value, key) => {
      resultObject[key] = value;
    });

    return resultObject;
  }, [queryStr, location.search]);
}
