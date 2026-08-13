"use client";

import * as React from "react";
import { ArrowUpIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type ChatComposerProps = {
  onSend: (content: string) => Promise<void> | void;
  isSending?: boolean;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
};

/**
 * Message input form with send button. Enter sends; Shift+Enter inserts a newline.
 */
export function ChatComposer({
  onSend,
  isSending = false,
  placeholder = "Message ChitChat…",
  className,
  autoFocus = false,
}: ChatComposerProps) {
  const [value, setValue] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (autoFocus) {
      textareaRef.current?.focus();
    }
  }, [autoFocus]);

  /** Submits the current message when the form is submitted or Enter is pressed. */
  async function handleSubmit(event?: React.FormEvent) {
    event?.preventDefault();
    const content = value.trim();
    if (!content || isSending) return;

    setValue("");
    await onSend(content);
    textareaRef.current?.focus();
  }

  /** Handles keyboard shortcuts — Enter to send, Shift+Enter for a new line. */
  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSubmit();
    }
  }

  const canSend = value.trim().length > 0 && !isSending;

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      className={cn("w-full", className)}
    >
      <InputGroup className="h-auto min-h-[52px] rounded-[26px] border border-border bg-muted/60 focus-within:bg-background focus-within:border-primary transition-colors shadow-sm p-2.5 items-end">
        <Button type="button" variant="ghost" size="icon" className="rounded-full size-8 shrink-0 text-muted-foreground hover:text-foreground hover:bg-secondary">
          <PlusIcon className="size-5" />
        </Button>
        <InputGroupTextarea
          ref={textareaRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a message..."
          disabled={isSending}
          rows={1}
          className="max-h-48 min-h-[32px] py-1 px-3 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground border-none bg-transparent focus-visible:ring-0 resize-none shadow-none"
        />
        <InputGroupButton
          type="submit"
          size="icon-sm"
          variant="ghost"
          disabled={!canSend}
          className={cn("size-8 shrink-0 rounded-full transition-colors", canSend ? "bg-foreground text-background hover:opacity-90" : "bg-muted text-muted-foreground")}
          aria-label="Send message"
        >
          {isSending ? <Spinner /> : <ArrowUpIcon className="size-[18px]" strokeWidth={2.5} />}
        </InputGroupButton>
      </InputGroup>
    </form>
  );
}
