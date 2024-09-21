import { useCallback, useMemo, useState } from "react";
import { useMutation, usePaginatedQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const BATCH_SIZE = 20;

type GetMessageRequest = {
  channelId?: Id<"channels">
  conversationId?: Id<"conversations">;
  parentMessageId?: Id<"messages">;
};

type CreateRequest = {
  body: string,
  workspaceId: Id<"workspaces">,
  image?: Id<"_storage">,
  channelId?: Id<"channels">,
  parentMessageId?: Id<"messages">,
  conversationId?: Id<"conversations">,
};


export type GetMessageResponse = typeof api.messages.get._returnType["page"];
type CreateResponse = Id<"messages"> | null;

type Options = {
  onSuccess?: (data: CreateResponse) => void;
  onError?: (e: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useGetMessages = ({
  channelId, parentMessageId, conversationId,
}: GetMessageRequest) => {
  const { results, status, loadMore } = usePaginatedQuery(api.messages.get, {
    channelId,
    conversationId,
    parentMessageId
  }, {
    initialNumItems: BATCH_SIZE,
  });

  return {
    results,
    status,
    loadMore: () => loadMore(BATCH_SIZE),
  }
};

export const useCreateMessage = () => {
  const [data, setData] = useState<CreateResponse>(null);
  const [error, setError] = useState<Error | null>(null);
  const [state, setState] = useState<"success" | "error" | "settled" | "pending" | "idle">("idle");

  const isPending = useMemo(() => state === "pending", [state]);
  const isError = useMemo(() => state === "error", [state]);
  const isSettled = useMemo(() => state === "settled", [state]);
  const isSuccess = useMemo(() => state === "success", [state]);

  const mutation = useMutation(api.messages.create);

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
