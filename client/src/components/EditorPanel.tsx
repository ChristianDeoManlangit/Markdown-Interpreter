import React, { useRef, useEffect, useState } from "react";
import Prism from 'prismjs';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';

interface EditorPanelProps {
  markdown: string;
  onChange: (text: string) => void;
  width: number;
}

const EditorPanel: React.FC<EditorPanelProps> = ({ markdown, onChange, width }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [lineCount, setLineCount] = useState(1);

  // Update line numbers and highlight syntax when markdown content changes
  useEffect(() => {
    if (markdown) {
      const lines = markdown.split('\n').length;
      setLineCount(lines);
    } else {
      setLineCount(1);
    }
    
    // Highlight code with Prism.js
    Prism.highlightAll();
  }, [markdown]);

  // Sync scrolling between textarea and line numbers
  useEffect(() => {
    const textarea = textareaRef.current;
    const lineNumbers = lineNumbersRef.current;

    if (!textarea || !lineNumbers) return;

    const handleScroll = () => {
      if (lineNumbers) {
        lineNumbers.scrollTop = textarea.scrollTop;
      }
    };

    textarea.addEventListener('scroll', handleScroll);
    return () => {
      textarea.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle tab key in the editor (insert 2 spaces instead of changing focus)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      
      // Insert 2 spaces at cursor position
      const newText = markdown.substring(0, start) + '  ' + markdown.substring(end);
      onChange(newText);
      
      // Move cursor after the inserted spaces
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  return (
    <div 
      className="flex flex-col overflow-hidden"
      style={{ 
        width: `${width}%`,
        height: width === 100 ? '50vh' : '100%', // 50vh height on mobile (when width is 100%)
        borderRight: width !== 100 ? '1px solid var(--border-color, #e5e7eb)' : 'none' // Only show right border on desktop
      }}
      id="editor-panel"
    >
      <div className="flex-1 flex overflow-hidden bg-editor-light dark:bg-editor-dark transition-colors duration-200">
        {/* Line Numbers */}
        <div 
          ref={lineNumbersRef}
          className="flex-none w-12 bg-gray-100 dark:bg-gray-800 py-2 text-right text-xs text-slate-500 dark:text-slate-400 font-mono select-none overflow-y-hidden" 
          id="line-numbers"
        >
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} className="px-2">{i + 1}</div>
          ))}
        </div>
        
        {/* Actual Editor */}
        <div className="flex-1 relative">
          <pre className="absolute inset-0 m-0 p-0 w-full h-full pointer-events-none prism-highlight overflow-hidden" 
               style={{ zIndex: 1, paddingTop: "0.5rem", paddingLeft: "0.5rem" }}>
            <code className="language-markdown">{markdown || " "}</code>
          </pre>
          <textarea 
            ref={textareaRef}
            id="markdown-editor" 
            className="absolute inset-0 resize-none p-2 outline-none bg-transparent w-full h-full font-mono text-sm leading-relaxed text-transparent caret-slate-800 dark:caret-white"
            placeholder="Type your Markdown here..."
            value={markdown}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ caretColor: "currentColor" }}
          />
        </div>
      </div>
    </div>
  );
};

export default EditorPanel;
