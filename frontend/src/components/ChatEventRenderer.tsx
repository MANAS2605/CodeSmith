import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FileSearch, FileEdit, Loader2 } from "lucide-react";
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
        <div className="flex items-start gap-2.5 text-muted-foreground text-[13px] font-normal leading-normal my-1.5">
          <div className="mt-1 shrink-0">
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-signal" />
            ) : (
              <span className="inline-block w-1.5 h-1.5 rounded-full border border-muted-foreground/80 align-middle" />
            )}
          </div>
          <span className="italic">{event.content}</span>
        </div>
      );

    case ChatEventType.TOOL_LOG:
      return (
        <CollapsibleEvent
          icon={<FileSearch className="w-3.5 h-3.5" />}
          label="Read"
          event={event}
        />
      );

    case ChatEventType.FILE_EDIT:
      return (
        <CollapsibleEvent
          icon={
            isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-signal" />
            ) : (
              <FileEdit className="w-3.5 h-3.5" />
            )
          }
          label={isLoading ? "Editing" : "Edited"}
          event={event}
          hideToggle
          forceSingleLine={isLoading}
        />
      );

    case ChatEventType.MESSAGE:
      return (
        <div className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed my-2">
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
}: {
  icon: React.ReactNode,
  label: string,
  event: ChatEvent,
  hideToggle?: boolean,
  forceSingleLine?: boolean,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Parse files
  const files =
    event.type === ChatEventType.FILE_EDIT
      ? ([event.filePath].filter(Boolean) as string[])
      : (event.metadata?.split(",") || []).filter(Boolean).map((f) => f.trim());

  if (files.length === 0) return null;

  const hasMultipleFiles = files.length > 1;
  const showButton = !hideToggle && hasMultipleFiles && !forceSingleLine;
  const firstFileName = files[0].split("/").pop() || files[0];

  return (
    <div className="flex flex-col gap-1.5 my-1.5 text-xs">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden min-w-0">
          <div className="text-muted-foreground shrink-0">{icon}</div>
          <span className="text-muted-foreground text-[12px] font-mono uppercase tracking-wider shrink-0">
            {label}
          </span>

          {/* File Name Badge */}
          <span className="bg-panel border border-border text-foreground text-[11px] px-2 py-0.5 rounded-[4px] font-mono truncate max-w-[200px]">
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
            className="text-muted-foreground hover:text-foreground text-[11px] font-mono px-2 py-0.5 rounded-[4px] border border-border bg-panel hover:bg-panel-hover transition-colors shrink-0"
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
                className="bg-panel border border-border text-foreground text-[11px] px-2 py-0.5 rounded-[4px] font-mono truncate max-w-[200px]"
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