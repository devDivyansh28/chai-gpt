"use client";

import { isTextUIPart, type UIMessage } from "ai";
import type { ChatStatus } from "ai";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";

import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from "@/components/ai-elements/message";

import { Loader } from "@/components/ai-elements/loader";
import { useState } from "react";
import { CopyIcon, CheckIcon } from "lucide-react";

function MessageCopyButton({ text }: { text: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <MessageActions className="opacity-0 group-hover:opacity-100 transition-opacity mt-1">
      <MessageAction tooltip="Copy message" onClick={copyToClipboard} variant="ghost" size="icon-sm">
        {isCopied ? <CheckIcon className="size-4 text-green-500" /> : <CopyIcon className="size-4 text-muted-foreground" />}
      </MessageAction>
    </MessageActions>
  );
}

/** Extracts plain text from a `UIMessage` by joining all text parts. */
function getMessageText(message: UIMessage) {
  return message.parts
    .filter(isTextUIPart)
    .map((part) => part.text)
    .join("");
}

type ChatMessagesProps = {
  messages: UIMessage[];
  status: ChatStatus;
};

/**
 * Renders the conversation message list with markdown responses and a loading indicator.
 */
export function ChatMessages({ messages, status }: ChatMessagesProps) {
  const isWaiting = status === "submitted" && messages.at(-1)?.role === "user";

  return (
    <Conversation>
      <ConversationContent className="py-8">
        {messages.map((message) => {
          const text = getMessageText(message);
          return (
            <Message key={message.id} from={message.role}>
              <MessageContent>
                <MessageResponse>{text}</MessageResponse>
              </MessageContent>
              <MessageCopyButton text={text} />
            </Message>
          );
        })}

        {isWaiting ? (
          <Message from="assistant">
            <MessageContent>
              <Loader />
            </MessageContent>
          </Message>
        ) : null}
      </ConversationContent>
    </Conversation>
  );
}
