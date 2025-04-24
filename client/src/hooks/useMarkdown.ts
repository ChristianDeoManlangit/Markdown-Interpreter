import { useState, useEffect } from "react";
import { parseMarkdown } from "@/lib/markdown";

export function useMarkdown(initialMarkdown: string = "") {
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [html, setHtml] = useState("");

  // Parse markdown to HTML whenever markdown changes
  useEffect(() => {
    setHtml(parseMarkdown(markdown));
  }, [markdown]);

  // Attempt to load saved content from localStorage on initial load
  useEffect(() => {
    const savedContent = localStorage.getItem("markdown-editor-content");
    if (savedContent) {
      setMarkdown(savedContent);
    }
  }, []);

  return { markdown, setMarkdown, html };
}
