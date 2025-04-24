import React from "react";

interface PreviewPanelProps {
  html: string;
  width: number;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ html, width }) => {
  return (
    <div 
      className="flex-1 bg-white dark:bg-gray-900"
      style={{ 
        width: `${width}%`,
        height: width === 100 ? '50vh' : '100%'
      }}
    >
      <div 
        className="markdown-preview w-full h-full"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

export default PreviewPanel;
