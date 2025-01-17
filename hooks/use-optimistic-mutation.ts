import { QueryKey, useMutation } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import { ActionFunction } from "../types/action-function";
import { Draft, produce } from "immer";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export const useOptimisticMutation = <
  U,
  P,
  D = Awaited<ReturnType<ActionFunction>>
>({
  queryClient,
  queryKey,
  mutationFn,
  optimisticUpdateFn,
  settledFn,
}: {
  queryClient: QueryClient;
  queryKey: QueryKey;
  mutationFn: (
    update: U
  ) => Promise<D extends Awaited<ReturnType<ActionFunction>> ? D : never>;
  // Return the previous data
  optimisticUpdateFn?: (update: U, draft: Draft<P>) => void;
  settledFn?: (
    data: D | undefined,
    error: Error | null,
    variables: U,
    context: any
  ) => void;
}) => {
  const { toast } = useToast();

  return useMutation({
    mutationFn,

    // Optimistic update
    onMutate: async (update) => {
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<P>(queryKey);

      if (previousData === undefined) {
        console.error("No previous data found for query key", queryKey);
      } else if (optimisticUpdateFn) {
        queryClient.setQueryData(
          queryKey,
          produce(previousData, (draft) => optimisticUpdateFn(update, draft))
        );
      }

      return { previousData };
    },

    onSuccess: (data, _variables, _context) => {
      if (data.message) {
        toast(data.message);
      }
    },

    onError: (error, _variables, context) => {
      // Skip redirect errors, they're not actual errors.
      if (isRedirectError(error)) return;

      toast({
        title: "Oops, something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });

      queryClient.setQueryData(queryKey, context?.previousData);
    },

    onSettled: async (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey });
      settledFn?.(data, error, variables, context);
    },
  });
};
