import { useState, useRef, useEffect } from "react";
import { Send, Loader2, ThumbsUp, ThumbsDown, Copy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useStreamParser } from "../hooks/use-stream-parser";
import { ChatEventRenderer } from "./ChatEventRenderer";
import { ChatEvent } from "@/lib/types";
import { ConstellationGraphic } from "./celestial/ConstellationGraphic";
import { cn } from "@/lib/utils";

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

const SUGGESTIONS = [
  "✨ Add interactive celestial animations to the header",
  "🌌 Build a dynamic constellation network component",
  "🚀 Refactor the layout with glowing glassmorphism",
];

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

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom(isStreaming ? "auto" : "smooth");
  }, [messages, isStreaming]);

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

  const handleSuggestionClick = (prompt: string) => {
    if (isStreaming || readOnly) return;
    setInput(prompt);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col h-full bg-card/40 dark:bg-[#0B071E]/80 text-foreground select-text relative">
      {/* Transcript Viewport */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-[44rem] mx-auto w-full">
          {isLoading ? (
            /* Celestial Skeleton lines */
            <div className="space-y-4 py-8 animate-pulse">
              <div className="h-4 bg-[#6D28D9]/20 rounded-md w-1/4" />
              <div className="h-4 bg-muted/50 rounded-md w-3/4" />
              <div className="h-4 bg-muted/40 rounded-md w-1/2" />
            </div>
          ) : messages.length === 0 ? (
            /* Celestial Empty State with Constellation Graphic */
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="relative mb-5">
                <div className="absolute inset-0 rounded-full bg-[#6D28D9]/20 blur-xl animate-pulse-glow" />
                <ConstellationGraphic variant="compass" className="w-24 h-24 relative z-10" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2 celestial-gradient-text">
                What shall we forge among the stars?
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
                Describe the celestial features, UI transformations, or logic you wish to construct.
              </p>

              {/* Suggestion Chips */}
              {!readOnly && (
                <div className="flex flex-col sm:flex-row flex-wrap gap-2 justify-center max-w-md">
                  {SUGGESTIONS.map((suggestion, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion.replace(/^[✨🌌🚀]\s*/, ""))}
                      className="text-xs px-3 py-1.5 rounded-full border border-[#6D28D9]/30 hover:border-[#EC4899]/60 bg-card/80 dark:bg-[#2D1B4E]/60 hover:bg-[#6D28D9]/15 backdrop-blur-md text-foreground/80 hover:text-[#06B6D4] transition-all text-left truncate shadow-xs"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
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

      {/* Composer Area with Celestial Glass */}
      <div className="shrink-0 p-3 sm:p-4 border-t border-border/80 dark:border-[#6D28D9]/30 bg-card/80 dark:bg-[#2D1B4E]/40 backdrop-blur-md">
        <div className="max-w-[44rem] mx-auto w-full space-y-2">
          <form
            onSubmit={handleSubmit}
            className="relative rounded-xl border border-border/90 dark:border-[#6D28D9]/40 bg-background backdrop-blur-xl transition-all focus-within:border-[#06B6D4] focus-within:ring-2 focus-within:ring-[#EC4899]/30 focus-within:shadow-[0_0_20px_rgba(236,72,153,0.2)] p-2.5"
          >
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder={
                readOnly
                  ? "View-only access enabled for this orbit"
                  : "Transmit instructions to the celestial forge..."
              }
              className="min-h-[52px] max-h-[200px] w-full resize-none border-0 bg-transparent p-1 pr-12 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:outline-none shadow-none"
              disabled={isStreaming || readOnly}
              rows={1}
            />

            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isStreaming || readOnly}
              className="absolute right-2.5 bottom-2.5 h-8 w-8 rounded-lg bg-gradient-to-r from-[#6D28D9] via-[#EC4899] to-[#06B6D4] hover:opacity-95 text-white shadow-[0_0_12px_rgba(236,72,153,0.4)] disabled:opacity-30 transition-all"
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
            <div className="font-mono text-[11px] select-none text-muted-foreground flex items-center gap-1.5">
              <span>Enter to transmit</span>
              <span className="text-border">·</span>
              <span>Shift+Enter for newline</span>
            </div>

            {isStreaming && (
              <span className="inline-flex items-center gap-2 font-mono text-[11px] text-[#06B6D4] font-medium">
                <span className="w-2 h-2 rounded-full bg-[#06B6D4] animate-ping" />
                Synthesizing Astral Code...
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
    <div className="space-y-2">
      {/* Speaker Header */}
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground select-none">
        <span className={cn("font-semibold", isUser ? "text-[#EC4899]" : "text-[#06B6D4]")}>
          {isUser ? "EXPLORER" : "CODESMITH AI"}
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
        /* User Turn: Celestial Glass Bubble */
        <div className="bg-white dark:bg-[#2D1B4E]/90 text-foreground border border-border/90 dark:border-[#6D28D9]/40 p-4 text-sm leading-relaxed whitespace-pre-wrap rounded-2xl shadow-sm dark:shadow-md">
          {message.content}
        </div>
      ) : (
        /* Assistant Turn: Left Celestial Pulsar Timeline */
        <div className="pl-4 border-l-2 border-[#6D28D9]/40 dark:border-[#6D28D9]/30 space-y-2 py-0.5 relative">
          {/* Pulsar Node at top of timeline */}
          <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[#06B6D4] shadow-[0_0_8px_#06B6D4]" />

          <div className="space-y-1.5">
            {eventsToRender && eventsToRender.length > 0 ? (
              eventsToRender.map((event, idx) => (
                <ChatEventRenderer
                  key={idx}
                  event={event}
                  isLoading={isStreaming && idx === eventsToRender.length - 1}
                />
              ))
            ) : message.content && message.content.trim().length > 0 ? (
              <div className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed my-1.5 break-words">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                {isStreaming && <span className="streaming-cursor" />}
              </div>
            ) : isStreaming ? (
              <div className="flex items-center gap-2 text-xs text-[#06B6D4] font-mono py-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Synthesizing astral response...</span>
              </div>
            ) : null}
          </div>

          {/* Action buttons for finished assistant turns */}
          {!isStreaming && (eventsToRender.length > 0 || (message.content && message.content.trim().length > 0)) && (
            <div className="flex items-center gap-1 pt-1 opacity-70 hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground"
                aria-label="Retry"
                title="Retry"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground"
                aria-label="Thumbs up"
                title="Thumbs up"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground"
                aria-label="Thumbs down"
                title="Thumbs down"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground"
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
