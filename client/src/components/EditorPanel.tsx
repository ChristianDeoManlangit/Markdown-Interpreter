import React, { useRef, useEffect, useState } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-markup";

interface EditorPanelProps {
  markdown: string;
  onChange: (text: string) => void;
  width: number;
  fontSize?: number;
}

const EditorPanel: React.FC<EditorPanelProps> = ({ markdown, onChange, width, fontSize = 14 }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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

  useEffect(() => {
    if (textareaRef.current) {
      const text = textareaRef.current.value;
      const html = Prism.highlight(text || '', Prism.languages.markdown, 'markdown');
      const highlightedDiv = textareaRef.current.parentElement?.querySelector('.editor-highlight');
      if (highlightedDiv && highlightedDiv instanceof HTMLElement) {
        highlightedDiv.innerHTML = html + '\n';
        highlightedDiv.scrollTop = textareaRef.current.scrollTop;
        highlightedDiv.scrollLeft = textareaRef.current.scrollLeft;
      }
    }
  }, [markdown]);

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const highlightedDiv = e.currentTarget.parentElement?.querySelector('.editor-highlight');
    if (highlightedDiv && highlightedDiv instanceof HTMLElement) {
      highlightedDiv.scrollTop = e.currentTarget.scrollTop;
      highlightedDiv.scrollLeft = e.currentTarget.scrollLeft;
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
          <div className="editor-highlight absolute top-0 left-0 w-full h-full p-2 pointer-events-none font-mono whitespace-pre" style={{ fontSize: `${fontSize}px` }}></div>
          <textarea 
            ref={textareaRef}
            id="markdown-editor" 
            className="w-full h-full resize-none p-2 outline-none font-mono leading-relaxed text-slate-800 dark:text-slate-200 caret-slate-800 dark:caret-white bg-white dark:bg-gray-900 overflow-auto prism-editor language-markup"
            style={{ fontSize: `${fontSize}px` }}
            placeholder="Type your Markdown here..."
            value={markdown}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            spellCheck={false}
            wrap="off"
          />
        </div>
      </div>
    </div>
  );
};

export default EditorPanel;