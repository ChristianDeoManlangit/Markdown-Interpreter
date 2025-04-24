import JSZip from "jszip";
import FileSaver from "file-saver";
import { parseMarkdown } from "./markdown";

const STORAGE_KEY = "markdown-editor-content";

// Create a new empty file
export function createNewFile(): boolean {
  try {
    // Clear local storage for this app
    localStorage.removeItem(STORAGE_KEY);
    
    // Reload the page to reset the editor
    window.location.reload();
    return true;
  } catch (error) {
    console.error("Error creating new file:", error);
    return false;
  }
}

// Save content to localStorage
export function saveToLocalStorage(content: string): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, content);
    return true;
  } catch (error) {
    console.error("Error saving to local storage:", error);
    return false;
  }
}

// Load content from localStorage
export function loadFromLocalStorage(): string | null {
  try {
    const content = localStorage.getItem(STORAGE_KEY);
    
    if (content) {
      // Reload the page with content from localStorage
      window.location.reload();
      return content;
    }
    return null;
  } catch (error) {
    console.error("Error loading from local storage:", error);
    return null;
  }
}

// Download markdown content as a .md file
export function downloadMarkdown(content: string): void {
  try {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    FileSaver.saveAs(blob, "markdown-content.md");
  } catch (error) {
    console.error("Error downloading markdown:", error);
  }
}

// Download markdown content and HTML preview as a .zip file
export function downloadZip(content: string): void {
  try {
    const zip = new JSZip();
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Markdown Preview</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          pre {
            background: #f5f5f5;
            padding: 10px;
            border-radius: 5px;
            overflow-x: auto;
          }
          code {
            font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
            font-size: 0.9em;
            background: #f5f5f5;
            padding: 2px 4px;
            border-radius: 3px;
          }
          pre code {
            background: transparent;
            padding: 0;
          }
          img {
            max-width: 100%;
          }
          blockquote {
            margin: 0;
            padding-left: 15px;
            border-left: 3px solid #ddd;
            color: #666;
          }
          table {
            border-collapse: collapse;
            width: 100%;
          }
          table, th, td {
            border: 1px solid #ddd;
          }
          th, td {
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>
        ${parseMarkdown(content)}
      </body>
      </html>
    `;
    
    // Add files to the zip
    zip.file("content.md", content);
    zip.file("preview.html", htmlContent);
    
    // Generate zip and trigger download
    zip.generateAsync({ type: "blob" }).then(function(blob) {
      FileSaver.saveAs(blob, "markdown-content.zip");
    });
  } catch (error) {
    console.error("Error creating zip file:", error);
  }
}
