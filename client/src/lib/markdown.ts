import { marked } from "marked";

// Configure marked options
marked.setOptions({
  breaks: true,        // Convert line breaks to <br>
  gfm: true,           // Use GitHub Flavored Markdown
  headerIds: true,     // Generate IDs for headings
  mangle: false,       // Don't escape HTML
  sanitize: false,     // Don't sanitize HTML
  smartLists: true,    // Use smarter list behavior
  smartypants: true,   // Use smart typography
  xhtml: false,        // Don't close void tags with />
  highlight: function(code, lang) {
    return code;       // In a real app, we would use highlight.js or prism.js here
  }
});

// Parse markdown to HTML
export function parseMarkdown(markdown: string): string {
  return marked.parse(markdown);
}
