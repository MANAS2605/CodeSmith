import { useMemo } from 'react';
import { ChatEvent, ChatEventType } from '@/lib/types';

// Regex to capture celestial stream tags: tool, message, file, thought
// Lenient closing for streaming chunks (matches closing tag OR end of stream)
const TAG_REGEX = /<(tool|message|file|thought)(?:\s+([^>]*?))?>([\s\S]*?)(?:<\/\1>|$)/gi;
const ATTR_REGEX = /(?:path|args)="([^"]+)"/i;

export const parseStreamContent = (streamBuffer: string): ChatEvent[] => {
  if (!streamBuffer || !streamBuffer.trim()) {
    return [];
  }

  const events: ChatEvent[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // Reset regex index for safety
  TAG_REGEX.lastIndex = 0;

  while ((match = TAG_REGEX.exec(streamBuffer)) !== null) {
    // 1. Capture any plain text / markdown preceding this tag
    if (match.index > lastIndex) {
      const textBefore = streamBuffer.substring(lastIndex, match.index);
      if (textBefore.trim()) {
        events.push({
          type: ChatEventType.MESSAGE,
          content: textBefore.trim(),
        });
      }
    }

    const tagName = match[1].toLowerCase();
    const rawAttrs = match[2] || "";
    const rawContent = match[3] || "";

    const attrMatch = ATTR_REGEX.exec(rawAttrs);
    const attrValue = attrMatch ? attrMatch[1] : undefined;

    let type: ChatEventType = ChatEventType.MESSAGE;
    let filePath: string | undefined;
    let metadata: string | undefined;

    if (tagName === 'tool') {
      type = ChatEventType.TOOL_LOG;
      metadata = attrValue;
    } else if (tagName === 'file') {
      type = ChatEventType.FILE_EDIT;
      filePath = attrValue;
    } else if (tagName === 'thought') {
      type = ChatEventType.THOUGHT;
    } else if (tagName === 'message') {
      type = ChatEventType.MESSAGE;
    }

    // Preserve code indentation for file edits
    const cleanContent =
      type === ChatEventType.FILE_EDIT
        ? rawContent.replace(/^\r?\n/, "").replace(/\r?\n$/, "")
        : rawContent.trim();

    if (cleanContent || filePath || metadata) {
      events.push({
        type,
        content: cleanContent,
        filePath,
        metadata,
      });
    }

    lastIndex = match.index + match[0].length;

    // Guard against zero-length match infinite loops
    if (match.index === TAG_REGEX.lastIndex) {
      TAG_REGEX.lastIndex++;
    }
  }

  // 2. Capture any trailing plain text / markdown after the last tag
  if (lastIndex < streamBuffer.length) {
    const trailingText = streamBuffer.substring(lastIndex);
    if (trailingText.trim()) {
      events.push({
        type: ChatEventType.MESSAGE,
        content: trailingText.trim(),
      });
    }
  }

  // 3. Fallback: if no events were extracted but buffer is non-empty
  if (events.length === 0 && streamBuffer.trim()) {
    events.push({
      type: ChatEventType.MESSAGE,
      content: streamBuffer.trim(),
    });
  }

  return events;
};

export const useStreamParser = (streamBuffer: string) => {
  return useMemo(() => parseStreamContent(streamBuffer), [streamBuffer]);
};