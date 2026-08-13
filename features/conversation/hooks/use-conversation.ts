"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  createConversation,
  deleteConversation,
  listConversations,
  updateConversation,
} from "@/features/conversation/actions/conversation-action";

import { queryKeys } from "../utils/query-keys";


export function useConversations() {
  return useQuery({
    queryKey: queryKeys.conversations.all,
    queryFn: () => listConversations(),
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (title?: string) => createConversation(title),
    onSuccess: (conversation) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.all,
      });
      router.push(`/c/${conversation.id}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not Create Chat");
    },
  });
}

export function useUpdateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: {
      id: string;
      title?: string;
      isPinned?: boolean;
      isArchived?: boolean;
    }) => updateConversation(id, data),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.conversations.all });
      const previousConversations = queryClient.getQueryData<any[]>(queryKeys.conversations.all);

      if (previousConversations) {
        const updatedConversations = previousConversations.map((conv) => {
          if (conv.id === variables.id) {
            return { ...conv, ...variables };
          }
          return conv;
        });

        if (variables.isPinned !== undefined) {
          updatedConversations.sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            const dateA = new Date(a.lastMessageAt || 0).getTime();
            const dateB = new Date(b.lastMessageAt || 0).getTime();
            return dateB - dateA;
          });
        }

        queryClient.setQueryData(queryKeys.conversations.all, updatedConversations);
      }

      return { previousConversations };
    },
    onError: (error: Error, variables, context) => {
      if (context?.previousConversations) {
        queryClient.setQueryData(queryKeys.conversations.all, context.previousConversations);
      }
      toast.error(error.message || "Could not update chat");
    },
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.all,
      });
    },
    onSuccess: (conversation) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.detail(conversation.id),
      });
    },
  });
}

/** Delete a conversation and leave the page if you were viewing it. */
export function useDeleteConversation(activeId?: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: string) => deleteConversation(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.conversations.all });
      const previousConversations = queryClient.getQueryData<any[]>(queryKeys.conversations.all);

      if (previousConversations) {
        const updatedConversations = previousConversations.filter((conv) => conv.id !== id);
        queryClient.setQueryData(queryKeys.conversations.all, updatedConversations);
      }

      return { previousConversations };
    },
    onError: (error: Error, id, context) => {
      if (context?.previousConversations) {
        queryClient.setQueryData(queryKeys.conversations.all, context.previousConversations);
      }
      toast.error(error.message || "Could not delete chat");
    },
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.all,
      });
    },
    onSuccess: ({ id }) => {
      queryClient.removeQueries({
        queryKey: queryKeys.messages.byConversation(id),
      });

      if (activeId === id) {
        router.push("/");
      }

      toast.success("Chat deleted");
    },
  });
}