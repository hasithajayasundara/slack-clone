import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

type CreateRequest = { id: Id<"workspaces">, name: string };
type CreateResponse = Id<"channels"> | null;

type Options = {
  onSuccess?: (data: CreateResponse) => void;
  onError?: (e: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};


type Params = {
  workspaceId: Id<"workspaces">;
};

export const useGetChannels = ({ workspaceId }: Params) => {
  const data = useQuery(api.channels.get, { workspaceId });
  const isLoading = data === undefined;
  return { data, isLoading };
};

export const useCreateChannel = () => {
  const [data, setData] = useState<CreateResponse>(null);
  const [error, setError] = useState<Error | null>(null);
  const [state, setState] = useState<"success" | "error" | "settled" | "pending" | "idle">("idle");

  const isPending = useMemo(() => state === "pending", [state]);
  const isError = useMemo(() => state === "error", [state]);
  const isSettled = useMemo(() => state === "settled", [state]);
  const isSuccess = useMemo(() => state === "success", [state]);

  const mutation = useMutation(api.channels.create);

  const mutate = useCallback(async (values: CreateRequest, options?: Options) => {
    try {
      setData(null);
      setError(null);
      setState("pending");
      const response = await mutation(values);
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
