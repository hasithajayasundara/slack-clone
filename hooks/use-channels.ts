import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

type CreateRequest = { id: Id<"workspaces">, name: string };
type UpdateRequest = { id: Id<"channels">, name: string };
type RemoveRequest = { id: Id<"channels"> };

type CreateResponse = Id<"channels"> | null;
type UpdateResponse = Id<"channels"> | null;
type RemoveResponse = Id<"channels"> | null;


type Options = {
  onSuccess?: (data: CreateResponse) => void;
  onError?: (e: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useChannelId = () => {
  const params = useParams();
  return params.channelId as Id<"channels">;
};

export const useGetChannels = ({ workspaceId }: { workspaceId: Id<"workspaces"> }) => {
  const data = useQuery(api.channels.get, { workspaceId });
  const isLoading = data === undefined;
  return { data, isLoading };
};


export const useGetChannel = ({ id }: { id: Id<"channels"> }) => {
  const data = useQuery(api.channels.getById, { id });
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

export const useUpdateChannel = () => {
  const [data, setData] = useState<UpdateResponse>(null);
  const [error, setError] = useState<Error | null>(null);
  const [state, setState] = useState<"success" | "error" | "settled" | "pending" | "idle">("idle");

  const isPending = useMemo(() => state === "pending", [state]);
  const isError = useMemo(() => state === "error", [state]);
  const isSettled = useMemo(() => state === "settled", [state]);
  const isSuccess = useMemo(() => state === "success", [state]);

  const mutation = useMutation(api.channels.update);

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
    updateChannel: mutate,
    data,
    error,
    isError,
    isSettled,
    isSuccess,
    isUpdatingChannel: isPending,
  };
};

export const useRemoveChannel = () => {
  const [data, setData] = useState<RemoveResponse>(null);
  const [error, setError] = useState<Error | null>(null);
  const [state, setState] = useState<"success" | "error" | "settled" | "pending" | "idle">("idle");

  const isPending = useMemo(() => state === "pending", [state]);
  const isError = useMemo(() => state === "error", [state]);
  const isSettled = useMemo(() => state === "settled", [state]);
  const isSuccess = useMemo(() => state === "success", [state]);

  const mutation = useMutation(api.channels.remove);

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
    removeChannel: mutate,
    data,
    error,
    isError,
    isSettled,
    isSuccess,
    isRemovingChannel: isPending,
  };
};
