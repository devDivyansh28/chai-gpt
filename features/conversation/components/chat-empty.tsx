"use client";

import { useUser } from "@clerk/nextjs";
import { BotMessageSquare } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

/** Empty-state placeholder shown before the first message is sent. */
export function ChatEmpty() {
  const { user, isLoaded } = useUser();
  const firstName = user?.firstName || "there";

  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <Empty className="border-0">
        <EmptyHeader className="animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-1000 ease-out fill-mode-both">
          <EmptyMedia variant="default" className="mb-6 mx-auto text-primary">
            <BotMessageSquare className="size-14 animate-bounce delay-500 duration-2000" />
          </EmptyMedia>
          <EmptyTitle className="text-3xl md:text-4xl font-bold tracking-tight text-center max-w-lg leading-tight">
            {isLoaded ? (
              <>
                Hey <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">{firstName}</span>,
                <br className="sm:hidden" />
                {" "}let&apos;s have a ChitChat..
              </>
            ) : (
              <span className="opacity-0">Loading...</span>
            )}
          </EmptyTitle>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
