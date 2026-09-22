import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FileSearch, FileEdit, Loader2, Sparkles } from "lucide-react";
import { ChatEvent, ChatEventType } from "@/lib/types";

export const ChatEventRenderer = ({
  event,
  isLoading,
}: {
  event: ChatEvent;
  isLoading?: boolean;
}) => {
  switch (event.type) {
    case ChatEventType.THOUGHT:
      return (
        <div className="flex items-start gap-2.5 text-muted-foreground text-[13px] font-normal leading-normal my-1.5 p-2 rounded-lg bg-[#2D1B4E]/30 border border-[#6D28D9]/30">
          <div className="mt-1 shrink-0">
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#06B6D4]" />
            ) : (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#EC4899] shadow-[0_0_6px_#EC4899] align-middle animate-pulse" />
            )}
          </div>
          <span className="italic text-foreground/80">{event.content}</span>
        </div>
      );

    case ChatEventType.TOOL_LOG:
      return (
        <CollapsibleEvent
          icon={<FileSearch className="w-3.5 h-3.5 text-[#6D28D9] dark:text-[#EC4899]" />}
          label="Read"
          event={event}
          badgeStyle="bg-[#6D28D9]/20 border-[#6D28D9]/40 text-[#EC4899] font-medium"
        />
      );

    case ChatEventType.FILE_EDIT:
      return (
        <CollapsibleEvent
          icon={
            isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#06B6D4]" />
            ) : (
              <FileEdit className="w-3.5 h-3.5 text-[#06B6D4]" />
            )
          }
          label={isLoading ? "Forging" : "Forged"}
          event={event}
          hideToggle
          forceSingleLine={isLoading}
          badgeStyle="bg-[#06B6D4]/15 border-[#06B6D4]/40 text-[#06B6D4] font-medium shadow-[0_0_8px_rgba(6,182,212,0.25)]"
        />
      );

    case ChatEventType.MESSAGE:
      return (
        <div className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed my-2 break-words overflow-x-auto">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{event.content}</ReactMarkdown>
          {isLoading && <span className="streaming-cursor" />}
        </div>
      );

    default:
      return null;
  }
};

const CollapsibleEvent = ({
  icon,
  label,
  event,
  hideToggle = false,
  forceSingleLine = false,
  badgeStyle = "",
}: {
  icon: React.ReactNode;
  label: string;
  event: ChatEvent;
  hideToggle?: boolean;
  forceSingleLine?: boolean;
  badgeStyle?: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Parse files
  const files =
    event.type === ChatEventType.FILE_EDIT
      ? ([event.filePath || event.content].filter(Boolean) as string[])
      : (event.metadata ? event.metadata.split(",") : [event.content].filter(Boolean))
          .filter(Boolean)
          .map((f) => f.trim());

  if (files.length === 0) return null;

  const hasMultipleFiles = files.length > 1;
  const showButton = !hideToggle && hasMultipleFiles && !forceSingleLine;
  const firstFileName = files[0].split("/").pop() || files[0];

  return (
    <div className="flex flex-col gap-1.5 my-1.5 text-xs">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden min-w-0">
          <div className="shrink-0">{icon}</div>
          <span className="text-muted-foreground text-[11px] font-mono uppercase tracking-wider shrink-0 font-medium">
            {label}
          </span>

          {/* File Name Badge with Celestial Glow */}
          <span className={`border text-[11px] px-2.5 py-0.5 rounded-md font-mono truncate max-w-[200px] backdrop-blur-md ${badgeStyle}`}>
            {firstFileName}
          </span>

          {/* +X more label */}
          {!isExpanded && hasMultipleFiles && (
            <span className="text-muted-foreground text-[11px] font-mono whitespace-nowrap">
              +{files.length - 1} more
            </span>
          )}
        </div>

        {showButton && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-muted-foreground hover:text-foreground text-[11px] font-mono px-2 py-0.5 rounded-md border border-border/80 dark:border-[#6D28D9]/30 bg-card/60 hover:bg-[#6D28D9]/15 transition-colors shrink-0"
          >
            {isExpanded ? "Hide" : "Show"}
          </button>
        )}
      </div>

      {/* Expanded File Chips List */}
      {isExpanded && hasMultipleFiles && !forceSingleLine && (
        <div className="flex flex-wrap gap-1.5 pl-6 pt-1">
          {files.slice(1).map((file, idx) => {
            const fileName = file.split("/").pop() || file;
            return (
              <span
                key={idx}
                className={`border text-[11px] px-2.5 py-0.5 rounded-md font-mono truncate max-w-[200px] backdrop-blur-md ${badgeStyle}`}
                title={file}
              >
                {fileName}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};