import React, { useRef, useEffect, useState } from "react";

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

  // Update line numbers when markdown content changes
  useEffect(() => {
    if (markdown) {
      const lines = markdown.split('\n').length;
      setLineCount(lines);
    } else {
      setLineCount(1);
    }
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
      <div className="flex-1 flex overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-200">
        {/* Line Numbers */}
        <div 
          ref={lineNumbersRef}
          className="flex-none w-12 bg-gray-100 dark:bg-gray-800 py-2 text-right text-slate-500 dark:text-slate-400 font-mono select-none overflow-y-auto" 
          id="line-numbers"
          style={{
            fontSize: `${Math.max(fontSize - 2, 10)}px`
          }}
        >
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} className="px-2">{i + 1}</div>
          ))}
        </div>

        {/* Actual Editor */}
        <div className="flex-1 relative overflow-auto">
          <div className="w-full h-full" style={{ fontSize: `${fontSize}px` }}>
            <textarea 
              ref={textareaRef}
              id="markdown-editor" 
              className="w-full h-full resize-none p-2 outline-none font-mono leading-relaxed text-slate-800 dark:text-slate-200 caret-slate-800 dark:caret-white bg-white dark:bg-gray-900 overflow-y-auto markdown-syntax"
              placeholder="Type your Markdown here..."
              value={markdown}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              wrap="off"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPanel;
