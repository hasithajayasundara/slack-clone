import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

type CreateRequest = { name: string };
type UpdateRequest = { id: Id<"workspaces">, name: string };
type RemoveRequest = { id: Id<"workspaces"> };
type CreateResponse = Id<"workspaces"> | null;
type UpdateResponse = Id<"workspaces"> | null;
type RemoveResponse = Id<"workspaces"> | null;

type Options = {
  onSuccess?: (data: CreateResponse) => void;
  onError?: (e: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};


export const useGetWorkspaces = () => {
  const data = useQuery(api.workspaces.get);
  const isLoading = data === undefined;
  return { data, isLoading };
};

export const useGetWorkspace = ({ id }: { id: Id<"workspaces"> }) => {
  const data = useQuery(api.workspaces.getById, { id });
  const isLoading = data === undefined;
  return { data, isLoading };
};


export const useCreateWorkspace = () => {
  const [data, setData] = useState<CreateResponse>(null);
  const [error, setError] = useState<Error | null>(null);
  const [state, setState] = useState<"success" | "error" | "settled" | "pending" | "idle">("idle");

  const isPending = useMemo(() => state === "pending", [state]);
  const isError = useMemo(() => state === "error", [state]);
  const isSettled = useMemo(() => state === "settled", [state]);
  const isSuccess = useMemo(() => state === "success", [state]);

  const mutation = useMutation(api.workspaces.create);

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

export const useWorkspaceId = () => {
  const params = useParams();
  return params.workspaceId as Id<"workspaces">;
};

export const useUpdateWorkspace = () => {
  const [data, setData] = useState<UpdateResponse>(null);
  const [error, setError] = useState<Error | null>(null);
  const [state, setState] = useState<"success" | "error" | "settled" | "pending" | "idle">("idle");

  const isPending = useMemo(() => state === "pending", [state]);
  const isError = useMemo(() => state === "error", [state]);
  const isSettled = useMemo(() => state === "settled", [state]);
  const isSuccess = useMemo(() => state === "success", [state]);

  const mutation = useMutation(api.workspaces.update);

  const mutate = useCallback(async (values: UpdateRequest, options?: Options) => {
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
    updateWorkspace: mutate,
    data,
    error,
    isError,
    isSettled,
    isSuccess,
    isUpdatingWorkspace: isPending,
  };
};

export const useRemoveWorkspace = () => {
  const [data, setData] = useState<RemoveResponse>(null);
  const [error, setError] = useState<Error | null>(null);
  const [state, setState] = useState<"success" | "error" | "settled" | "pending" | "idle">("idle");

  const isPending = useMemo(() => state === "pending", [state]);
  const isError = useMemo(() => state === "error", [state]);
  const isSettled = useMemo(() => state === "settled", [state]);
  const isSuccess = useMemo(() => state === "success", [state]);

  const mutation = useMutation(api.workspaces.remove);

  const mutate = useCallback(async (values: RemoveRequest, options?: Options) => {
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
    removeWorkspace: mutate,
    data,
    error,
    isError,
    isSettled,
    isSuccess,
    isRemovingWorkspace: isPending,
  };
};
