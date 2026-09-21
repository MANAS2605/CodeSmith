import { createTheme } from "@uiw/codemirror-themes";
import { tags } from "@lezer/highlight";

export function cleanCodeContent(raw: string): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  const blockMatch = trimmed.match(/^```[a-zA-Z0-9_-]*\r?\n([\s\S]*?)(?:\r?\n```\s*)?$/);
  if (blockMatch) return blockMatch[1];
  const lines = raw.split(/\r?\n/);
  if (lines.length > 1 && lines[0].trim().startsWith("```")) return lines.slice(1, lines[lines.length - 1].trim() === "```" ? -1 : undefined).join("\n");
  return raw;
}
const darkSettings = { background: "#18181b", backgroundImage: "", foreground: "#abb2bf", caret: "#528bff", selection: "#3e4451", selectionMatch: "#3a3f4b", lineHighlight: "#282c3433", gutterBackground: "#18181b", gutterForeground: "#5c6370", gutterBorder: "transparent" };
const lightSettings = { background: "#ffffff", backgroundImage: "", foreground: "#24292f", caret: "#0969da", selection: "#b6e3ff", selectionMatch: "#ddf4ff", lineHighlight: "#f6f8fa", gutterBackground: "#ffffff", gutterForeground: "#8c959f", gutterBorder: "transparent" };
const darkStyles = [{ tag: tags.comment, color: "#5c6370", fontStyle: "italic" }, { tag: [tags.controlKeyword, tags.moduleKeyword], color: "#c678dd" }, { tag: [tags.keyword, tags.definitionKeyword, tags.modifier], color: "#e06c75" }, { tag: [tags.propertyName, tags.definition(tags.propertyName)], color: "#e5c07b" }, { tag: [tags.function(tags.variableName), tags.function(tags.propertyName)], color: "#61afef" }, { tag: [tags.typeName, tags.className, tags.namespace, tags.string], color: "#98c379" }, { tag: [tags.number, tags.integer, tags.float], color: "#d19a66" }, { tag: tags.variableName, color: "#abb2bf" }];
const lightStyles = [{ tag: tags.comment, color: "#6e7781", fontStyle: "italic" }, { tag: [tags.controlKeyword, tags.moduleKeyword], color: "#a626a4" }, { tag: [tags.keyword, tags.definitionKeyword, tags.modifier], color: "#e45649" }, { tag: [tags.propertyName, tags.definition(tags.propertyName)], color: "#b76b01" }, { tag: [tags.function(tags.variableName), tags.function(tags.propertyName)], color: "#4078f2" }, { tag: [tags.typeName, tags.className, tags.namespace, tags.string], color: "#50a14f" }, { tag: [tags.number, tags.integer, tags.float], color: "#986801" }, { tag: tags.variableName, color: "#24292f" }];
export const vscodeDarkTheme = createTheme({ theme: "dark", settings: darkSettings, styles: darkStyles });
export const vscodeLightTheme = createTheme({ theme: "light", settings: lightSettings, styles: lightStyles });
