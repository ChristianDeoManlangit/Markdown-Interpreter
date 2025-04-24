
import React, { useRef, useEffect, useState } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-markdown";
import "prismjs/themes/prism-tomorrow.css";

interface EditorPanelProps {
  markdown: string;
  onChange: (text: string) => void;
  width: number;
  fontSize?: number;
}

const EditorPanel: React.FC<EditorPanelProps> = ({ markdown, onChange, width, fontSize = 14 }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [lineCount, setLineCount] = useState(1);

  useEffect(() => {
    if (markdown) {
      const lines = markdown.split('\n').length;
      setLineCount(lines);
    } else {
      setLineCount(1);
    }
  }, [markdown]);

  useEffect(() => {
    const textarea = textareaRef.current;
    const lineNumbers = lineNumbersRef.current;
    const pre = preRef.current;

    if (!textarea || !lineNumbers || !pre) return;

    const handleScroll = () => {
      lineNumbers.scrollTop = textarea.scrollTop;
      pre.scrollTop = textarea.scrollTop;
      pre.scrollLeft = textarea.scrollLeft;
    };

    textarea.addEventListener('scroll', handleScroll);
    return () => textarea.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (preRef.current) {
      const code = preRef.current.querySelector('code');
      if (code) {
        code.textContent = markdown;
        Prism.highlightElement(code);
      }
    }
  }, [markdown]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newText = markdown.substring(0, start) + '  ' + markdown.substring(end);
      onChange(newText);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const currentLine = markdown.substring(0, start).split('\n').pop() || '';
      const indentMatch = currentLine.match(/^(\s*)/);
      const indent = indentMatch ? indentMatch[1] : '';
      const listMatch = currentLine.match(/^(\s*[-*+]\s+)/);
      const newIndent = listMatch ? listMatch[1] : indent;
      
      const newText = markdown.substring(0, start) + '\n' + newIndent + markdown.substring(start);
      onChange(newText);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + newIndent.length + 1;
        }
      }, 0);
    }
  };

  return (
    <div 
      className="flex flex-col overflow-hidden"
      style={{ 
        width: `${width}%`,
        height: width === 100 ? '50vh' : '100%',
        borderRight: width !== 100 ? '1px solid var(--border-color, #e5e7eb)' : 'none'
      }}
      id="editor-panel"
    >
      <div className="flex-1 flex overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-200">
        <div 
          ref={lineNumbersRef}
          className="flex-none w-12 bg-gray-100 dark:bg-gray-800 py-2 text-right text-slate-500 dark:text-slate-400 font-mono select-none"
          style={{ fontSize: `${Math.max(fontSize - 2, 10)}px` }}
        >
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} className="px-2">{i + 1}</div>
          ))}
        </div>

        <div className="flex-1 relative overflow-hidden">
          <textarea 
            ref={textareaRef}
            id="markdown-editor" 
            className="absolute inset-0 w-full h-full resize-none p-2 outline-none font-mono leading-relaxed text-transparent bg-transparent caret-slate-800 dark:caret-white overflow-auto"
            style={{ fontSize: `${fontSize}px` }}
            placeholder="Type your Markdown here..."
            value={markdown}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            wrap="off"
          />
          <pre 
            ref={preRef}
            className="absolute inset-0 pointer-events-none p-2 font-mono overflow-auto"
            style={{ fontSize: `${fontSize}px` }}
          >
            <code className="language-markdown">{markdown}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default EditorPanel;
