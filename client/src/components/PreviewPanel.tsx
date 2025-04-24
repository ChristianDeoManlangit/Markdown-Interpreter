import React from "react";

interface PreviewPanelProps {
  html: string;
  width: number;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ html, width }) => {
  return (
    <div 
      className="overflow-auto bg-white dark:bg-gray-900"
      style={{ width: `${width}%` }}
    >
      <div 
        className="p-6 max-w-none prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg h-full"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

export default PreviewPanel;
