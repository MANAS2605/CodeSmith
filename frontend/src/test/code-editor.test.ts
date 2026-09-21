import { describe, it, expect } from "vitest";
import { cleanCodeContent } from "@/lib/code-theme";

describe("cleanCodeContent", () => {
  it("strips enclosing markdown code block fences", () => {
    const rawCode = "```tsx\nimport React from 'react';\nconst TodoApp = () => <div />;\nexport default TodoApp;\n```";
    const cleaned = cleanCodeContent(rawCode);
    expect(cleaned).toBe("import React from 'react';\nconst TodoApp = () => <div />;\nexport default TodoApp;");
  });

  it("strips first line if it starts with ```tsx even without closing ```", () => {
    const rawCode = "```tsx\nimport React from 'react';\nconst TodoApp = () => <div />;\nexport default TodoApp;";
    const cleaned = cleanCodeContent(rawCode);
    expect(cleaned).toBe("import React from 'react';\nconst TodoApp = () => <div />;\nexport default TodoApp;");
  });

  it("preserves standard code without code block fences", () => {
    const normalCode = "import React from 'react';\nexport default function App() { return null; }";
    expect(cleanCodeContent(normalCode)).toBe(normalCode);
  });
});
