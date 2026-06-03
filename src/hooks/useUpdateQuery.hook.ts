import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

type QueryObject = Record<string, string | null | undefined>;

export const useUpdateQuery = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  return useCallback(
    (query: QueryObject) => {
      const params = new URLSearchParams(searchParams);

      Object.entries(query).forEach(([key, value]) => {
        if (value === undefined || value === null) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      setSearchParams(params);
    },
    [searchParams, setSearchParams],
  );
};
