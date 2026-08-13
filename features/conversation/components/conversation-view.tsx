"use client";
import { Separator } from "@/components/ui/separator";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useChat } from "@ai-sdk/react";
import React, { useMemo } from "react";
import { useConversations } from "../hooks/use-conversation";
import { queryKeys } from "../utils/query-keys";
import { toast } from "sonner";
import { ChatEmpty } from "./chat-empty";
import { ChatMessages } from "./chat-message";
import { ChatComposer } from "./chat-composer";

type ConversationViewProps = {
  conversationId: string;
  initialMessages: UIMessage[];
};

/**
 * Main chat view — header, message list (or empty state), and composer with streaming.
 */
export const ConversationView = ({
  conversationId,
  initialMessages,
}: ConversationViewProps) => {
  const queryClient = useQueryClient();
  const { data: conversations } = useConversations();

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest: ({ id, messages }) => ({
          body: {
            id,
            message: messages.at(-1),
          },
        }),
      }),
    [],
  );

  const { messages, sendMessage, status } = useChat({
    id: conversationId,
    messages: initialMessages,
    transport,
    onFinish: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.all,
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const title =
    conversations?.find((item) => item.id === conversationId)?.title ?? "Chat";

  return (
    <div className="flex h-full w-full flex-col relative overflow-hidden bg-background">
      <header className="flex h-14 shrink-0 items-center justify-between border-b px-4 bg-transparent z-20">
        <div className="flex items-center gap-2">
          <h1 className="truncate text-sm font-medium">{title}</h1>
          <ChevronDownIcon className="size-4 text-muted-foreground" />
        </div>
      </header>

      <div className="flex-1 min-h-0 overflow-y-auto w-full relative z-0">
        {messages.length === 0 ? (
          <ChatEmpty />
        ) : (
          <ChatMessages messages={messages} status={status} />
        )}
        <div className="h-40" />
      </div>

      <div className="absolute bottom-0 w-full px-4 pb-4 pt-8 bg-gradient-to-t from-background via-background/90 to-transparent z-10 pointer-events-none">
        <div className="max-w-3xl mx-auto w-full pointer-events-auto">
          <ChatComposer
            onSend={(text) => {
              void sendMessage({ text });
              if (window.location.pathname === "/") {
                window.history.replaceState(null, "", `/c/${conversationId}`);
              }
            }}
            isSending={status !== "ready"}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};
