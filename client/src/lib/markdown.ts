import { marked } from "marked";

// Configure marked options for GitHub-like rendering
marked.setOptions({
  breaks: true,        // Convert line breaks to <br>
  gfm: true,           // Use GitHub Flavored Markdown
  smartLists: true,    // Use smarter list behavior
  smartypants: true,   // Use smart typography
  highlight: function(code: string) {
    return code;       // In a real app, we would use highlight.js or prism.js here
  }
});

// Parse markdown to HTML
export function parseMarkdown(markdown: string): string {
  try {
    const result = marked.parse(markdown);
    // Make sure we always return a string, even if marked returns a Promise
    if (typeof result === 'string') {
      return result;
    }
    return '<p class="text-red-500">Error: Unexpected result type</p>';
  } catch (error) {
    console.error('Error parsing markdown:', error);
    return '<p class="text-red-500">Error parsing markdown</p>';
  }
}
