import { useState, useRef, useEffect } from "react";
import { Send, Loader2, ThumbsUp, ThumbsDown, Copy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useStreamParser } from "../hooks/use-stream-parser";
import { ChatEventRenderer } from "./ChatEventRenderer";
import { ChatEvent } from "@/lib/types";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  createdAt?: string;
  events?: ChatEvent[];
  editedFiles?: string[];
}

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isStreaming: boolean;
  isLoading?: boolean;
  readOnly?: boolean;
}

export function ChatPanel({
  messages,
  onSendMessage,
  isStreaming,
  isLoading,
  readOnly,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    onSendMessage(input.trim());
    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground select-text">
      {/* Transcript Viewport */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-[44rem] mx-auto w-full">
          {isLoading ? (
            /* 3 skeleton lines */
            <div className="space-y-4 py-8 animate-pulse">
              <div className="h-4 bg-muted/60 rounded w-1/4" />
              <div className="h-4 bg-muted/40 rounded w-3/4" />
              <div className="h-4 bg-muted/30 rounded w-1/2" />
            </div>
          ) : messages.length === 0 ? (
            /* Quiet empty state: serif heading + 1 line copy, no Bot icon */
            <div className="flex flex-col items-center justify-center py-24 text-center px-4">
              <h3 className="font-display text-xl font-medium text-foreground mb-2">
                What are we building?
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Describe what you want to build or modify
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <TranscriptTurn
                  key={message.id}
                  message={message}
                  isStreaming={isStreaming && message.isStreaming}
                />
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Composer Area */}
      <div className="shrink-0 p-3 sm:p-4 border-t border-border bg-panel">
        <div className="max-w-[44rem] mx-auto w-full space-y-2">
          {/* Bordered card container, focus-within = signal ring */}
          <form
            onSubmit={handleSubmit}
            className="relative rounded-[8px] border border-border bg-background transition-all focus-within:ring-2 focus-within:ring-signal focus-within:ring-offset-1 focus-within:ring-offset-background p-2"
          >
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder={
                readOnly
                  ? "You have view-only access to this project"
                  : "Describe what you want to build..."
              }
              className="min-h-[52px] max-h-[200px] w-full resize-none border-0 bg-transparent p-1 pr-10 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:outline-none shadow-none"
              disabled={isStreaming || readOnly}
              rows={1}
            />

            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isStreaming || readOnly}
              className="absolute right-2.5 bottom-2.5 h-8 w-8 rounded-[6px] bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-opacity"
              aria-label="Send message"
            >
              {isStreaming ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>

          {/* Footer Keyboard Hint & Thinking Indicator */}
          <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
            <div className="font-mono text-[11px] select-none text-muted-foreground">
              <span>Enter to send</span>
              <span className="mx-1 text-border">·</span>
              <span>Shift+Enter for a new line</span>
            </div>

            {isStreaming && (
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-signal font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-signal animate-ping" />
                Thinking...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TranscriptTurn({
  message,
  isStreaming,
}: {
  message: ChatMessage;
  isStreaming?: boolean;
}) {
  const liveEvents = useStreamParser(message.content || "");
  const eventsToRender =
    message.events && message.events.length > 0 ? message.events : liveEvents;

  const isUser = message.role === "user";

  return (
    <div className="space-y-1.5">
      {/* Speaker Header: Small mono uppercase label + timestamp */}
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground select-none">
        <span className="font-medium text-foreground/80">
          {isUser ? "YOU" : "CODESMITH"}
        </span>
        {message.createdAt && (
          <>
            <span className="text-border">·</span>
            <span className="tabular-nums">
              {format(new Date(message.createdAt), "HH:mm")}
            </span>
          </>
        )}
      </div>

      {isUser ? (
        /* User Turn: 6px radius block on muted background */
        <div className="rounded-[6px] bg-muted/50 border border-border/60 p-3.5 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
      ) : (
        /* Assistant Turn: 1px left rule timeline */
        <div className="pl-3.5 border-l border-border space-y-2 py-0.5">
          <div className="space-y-1">
            {eventsToRender.map((event, idx) => {
              const isLast = idx === eventsToRender.length - 1;
              return (
                <ChatEventRenderer
                  key={idx}
                  event={event}
                  isLoading={isStreaming && isLast}
                />
              );
            })}
          </div>

          {/* Action buttons for finished assistant turns */}
          {!isStreaming && eventsToRender.length > 0 && (
            <div className="flex items-center gap-1 pt-1 opacity-70 hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-[4px] text-muted-foreground hover:text-foreground"
                aria-label="Retry"
                title="Retry"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-[4px] text-muted-foreground hover:text-foreground"
                aria-label="Thumbs up"
                title="Thumbs up"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-[4px] text-muted-foreground hover:text-foreground"
                aria-label="Thumbs down"
                title="Thumbs down"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-[4px] text-muted-foreground hover:text-foreground"
                aria-label="Copy message"
                title="Copy"
                onClick={() => {
                  if (message.content) {
                    navigator.clipboard.writeText(message.content);
                  }
                }}
              >
                <Copy className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
