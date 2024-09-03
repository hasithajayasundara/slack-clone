import { useCallback } from "react";
import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

type Options = {
  onSuccess?: () => void;
  onError?: () => void;
  onSettled?: () => void;
};

type RequestData = { name: string };

export const useGetWorkspaces = () => {
  const data = useQuery(api.workspaces.get);
  const isLoading = data === undefined;
  return { data, isLoading };
};

export const useCreateWorkspace = () => {
  const mutation = useMutation(api.workspaces.create);

  const mutate = useCallback(async (values: RequestData, options?: Options) => {
    try {
      const response = await mutation(values);
      options?.onSuccess?.();
    } catch (err) {
      options?.onError?.();
    } finally {
      options?.onSettled?.();
    }
  }, [mutation]);

  return { mutate };
};
