import React, { useRef, useEffect, useState } from "react";

interface EditorPanelProps {
  markdown: string;
  onChange: (text: string) => void;
  width: number;
}

const EditorPanel: React.FC<EditorPanelProps> = ({ markdown, onChange, width }) => {
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
      className="flex flex-col border-r border-gray-200 dark:border-gray-700 overflow-hidden" 
      style={{ width: `${width}%` }}
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
          <textarea 
            ref={textareaRef}
            id="markdown-editor" 
            className="absolute inset-0 resize-none p-2 outline-none bg-white dark:bg-gray-900 w-full h-full font-mono text-sm leading-relaxed"
            placeholder="Type your Markdown here..."
            value={markdown}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </div>
  );
};

export default EditorPanel;
