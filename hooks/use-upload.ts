import { useCallback, useMemo, useState } from "react";
import { useMutation } from "convex/react";

import { api } from "@/convex/_generated/api";

type Options = {
  onSuccess?: (data: string | null) => void;
  onError?: (e: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useGenerateUploadUrl = () => {
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [state, setState] = useState<"success" | "error" | "settled" | "pending" | "idle">("idle");

  const isPending = useMemo(() => state === "pending", [state]);
  const isError = useMemo(() => state === "error", [state]);
  const isSettled = useMemo(() => state === "settled", [state]);
  const isSuccess = useMemo(() => state === "success", [state]);

  const mutation = useMutation(api.upload.generateUploadUrl);

  const mutate = useCallback(async (_values: {}, options?: Options) => {
    try {
      setData(null);
      setError(null);
      setState("pending");
      const response = await mutation();
      options?.onSuccess?.(response);
      setData(response);
      setState("success");
      return response;
    } catch (err) {
      options?.onError?.(err as Error);
      if (options?.throwError) {
        throw err;
      }
      setError(err as Error);
      setState("error");
    } finally {
      options?.onSettled?.();
    }
  }, [mutation]);

  return {
    mutate,
    data,
    error,
    isError,
    isSettled,
    isSuccess,
    isPending,
  };
};
