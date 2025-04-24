import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import EditorPanel from "@/components/EditorPanel";
import PreviewPanel from "@/components/PreviewPanel";
import { useMarkdown } from "@/hooks/useMarkdown";

const defaultMarkdown = `# Welcome to Markdown Editor

## Getting Started

This is a simple **Markdown** editor with live preview. You can:

- Write Markdown syntax
- See instant preview
- Save your work
- Download in different formats

### Code Example

\`\`\`javascript
function helloWorld() {
  console.log("Hello, Markdown!");
}
\`\`\`
`;

const MarkdownEditor = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { markdown, setMarkdown, html } = useMarkdown(defaultMarkdown);
  const [panelSizes, setPanelSizes] = useState({
    editor: 50, // percentage
    preview: 50,
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isDragging, setIsDragging] = useState(false);

  // Handle resize when dragging the separator
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const container = document.getElementById("editor-container");
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const editorPercentage = ((e.clientX - containerRect.left) / containerRect.width) * 100;
          
          // Limit to ensure panels don't get too small
          const clampedPercentage = Math.max(20, Math.min(80, editorPercentage));
          
          setPanelSizes({
            editor: clampedPercentage,
            preview: 100 - clampedPercentage,
          });
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length > 0) {
        const container = document.getElementById("editor-container");
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const editorPercentage = ((e.touches[0].clientX - containerRect.left) / containerRect.width) * 100;
          
          // Limit to ensure panels don't get too small
          const clampedPercentage = Math.max(20, Math.min(80, editorPercentage));
          
          setPanelSizes({
            editor: clampedPercentage,
            preview: 100 - clampedPercentage,
          });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, { passive: false });
      document.addEventListener("touchend", handleTouchEnd);
      document.body.style.cursor = "col-resize";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.body.style.cursor = "";
    };
  }, [isDragging]);

  // Check for window resize to update mobile state
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <Navigation 
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        markdownContent={markdown}
        onContentLoad={setMarkdown}
      />
      
      <div 
        className={`flex-1 ${isMobile ? 'flex flex-col' : 'flex'} overflow-hidden`} 
        id="editor-container"
      >
        <EditorPanel 
          markdown={markdown}
          onChange={setMarkdown}
          width={isMobile ? 100 : panelSizes.editor}
        />
        
        {/* Draggable divider - only shown on desktop */}
        {!isMobile && (
          <div 
            className={`w-1 bg-gray-200 dark:bg-gray-700 hover:bg-blue-500 dark:hover:bg-blue-600 cursor-col-resize z-10 ${isDragging ? 'bg-blue-500 dark:bg-blue-600' : ''}`}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          ></div>
        )}
        
        {/* Mobile divider - horizontal */}
        {isMobile && (
          <div className="h-1 w-full bg-gray-200 dark:bg-gray-700"></div>
        )}
        
        <PreviewPanel 
          html={html}
          width={isMobile ? 100 : panelSizes.preview}
        />
      </div>
    </>
  );
};

export default MarkdownEditor;
