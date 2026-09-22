import { describe, it, expect } from "vitest";
import { parseStreamContent } from "@/hooks/use-stream-parser";
import { ChatEventType } from "@/lib/types";

describe("parseStreamContent", () => {
  it("returns empty array for empty or whitespace content", () => {
    expect(parseStreamContent("")).toEqual([]);
    expect(parseStreamContent("   \n\t  ")).toEqual([]);
  });

  it("parses plain markdown without any tags as a MESSAGE event", () => {
    const raw = "Hello! I am CodeSmith. How can I assist you today?";
    const events = parseStreamContent(raw);
    expect(events).toHaveLength(1);
    expect(events[0]).toEqual({
      type: ChatEventType.MESSAGE,
      content: raw,
      filePath: undefined,
      metadata: undefined,
    });
  });

  it("parses <tool> tag with args attribute", () => {
    const raw = '<tool args="src/main.ts">Searching files</tool>';
    const events = parseStreamContent(raw);
    expect(events).toHaveLength(1);
    expect(events[0]).toEqual({
      type: ChatEventType.TOOL_LOG,
      content: "Searching files",
      filePath: undefined,
      metadata: "src/main.ts",
    });
  });

  it("parses <file> tag with path attribute and preserves indentation", () => {
    const code = "  const a = 1;\n  return a;";
    const raw = `<file path="src/App.tsx">\n${code}\n</file>`;
    const events = parseStreamContent(raw);
    expect(events).toHaveLength(1);
    expect(events[0].type).toBe(ChatEventType.FILE_EDIT);
    expect(events[0].filePath).toBe("src/App.tsx");
    expect(events[0].content).toBe(code);
  });

  it("parses <thought> and <message> tags", () => {
    const raw = "<thought>Thinking...</thought><message>Here is the reply</message>";
    const events = parseStreamContent(raw);
    expect(events).toHaveLength(2);
    expect(events[0]).toEqual({
      type: ChatEventType.THOUGHT,
      content: "Thinking...",
      filePath: undefined,
      metadata: undefined,
    });
    expect(events[1]).toEqual({
      type: ChatEventType.MESSAGE,
      content: "Here is the reply",
      filePath: undefined,
      metadata: undefined,
    });
  });

  it("parses mixed stream with text before, between, and after tags", () => {
    const raw = `Starting work now.
<tool args="scan">Scanning directory</tool>
I will now write the file:
<file path="src/index.ts">console.log("hello");</file>
Everything is complete!`;

    const events = parseStreamContent(raw);
    expect(events).toHaveLength(5);
    expect(events[0].type).toBe(ChatEventType.MESSAGE);
    expect(events[0].content).toBe("Starting work now.");

    expect(events[1].type).toBe(ChatEventType.TOOL_LOG);
    expect(events[1].metadata).toBe("scan");

    expect(events[2].type).toBe(ChatEventType.MESSAGE);
    expect(events[2].content).toBe("I will now write the file:");

    expect(events[3].type).toBe(ChatEventType.FILE_EDIT);
    expect(events[3].filePath).toBe("src/index.ts");

    expect(events[4].type).toBe(ChatEventType.MESSAGE);
    expect(events[4].content).toBe("Everything is complete!");
  });

  it("handles streaming in-progress unclosed tags leniently", () => {
    const raw = 'I am editing:<file path="src/Button.tsx">export const Button = ()';
    const events = parseStreamContent(raw);
    expect(events).toHaveLength(2);
    expect(events[0].type).toBe(ChatEventType.MESSAGE);
    expect(events[0].content).toBe("I am editing:");
    expect(events[1].type).toBe(ChatEventType.FILE_EDIT);
    expect(events[1].filePath).toBe("src/Button.tsx");
    expect(events[1].content).toBe("export const Button = ()");
  });
});
