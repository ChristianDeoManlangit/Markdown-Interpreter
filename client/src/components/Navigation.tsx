import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { saveToLocalStorage, loadFromLocalStorage, downloadMarkdown, downloadZip, createNewFile } from "@/lib/fileOperations";
import { useToast } from "@/hooks/use-toast";

interface NavigationProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  markdownContent: string;
}

const Navigation: React.FC<NavigationProps> = ({ 
  isMobileMenuOpen, 
  toggleMobileMenu, 
  markdownContent 
}) => {
  const { theme, setTheme } = useTheme();
  const [fileDropdownOpen, setFileDropdownOpen] = useState(false);
  const [downloadDropdownOpen, setDownloadDropdownOpen] = useState(false);
  const fileDropdownRef = useRef<HTMLDivElement>(null);
  const downloadDropdownRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (fileDropdownRef.current && !fileDropdownRef.current.contains(event.target as Node)) {
        setFileDropdownOpen(false);
      }
      if (downloadDropdownRef.current && !downloadDropdownRef.current.contains(event.target as Node)) {
        setDownloadDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleFileDropdown = () => {
    setFileDropdownOpen(!fileDropdownOpen);
    setDownloadDropdownOpen(false);
  };

  const toggleDownloadDropdown = () => {
    setDownloadDropdownOpen(!downloadDropdownOpen);
    setFileDropdownOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleNewFile = () => {
    createNewFile();
    setFileDropdownOpen(false);
    toast({
      title: "New file created",
      description: "The editor has been reset.",
    });
  };

  const handleSaveFile = () => {
    saveToLocalStorage(markdownContent);
    setFileDropdownOpen(false);
    toast({
      title: "File saved",
      description: "Your content has been saved to localStorage.",
    });
  };

  const handleLoadFile = () => {
    loadFromLocalStorage();
    setFileDropdownOpen(false);
    toast({
      title: "File loaded",
      description: "Content loaded from localStorage.",
    });
  };

  const handleQuickSave = () => {
    saveToLocalStorage(markdownContent);
    toast({
      title: "File saved",
      description: "Your content has been saved to localStorage.",
    });
  };

  const handleDownloadMd = () => {
    downloadMarkdown(markdownContent);
    setDownloadDropdownOpen(false);
    toast({
      title: "Download started",
      description: "Your Markdown file is being downloaded.",
    });
  };

  const handleDownloadZip = () => {
    downloadZip(markdownContent);
    setDownloadDropdownOpen(false);
    toast({
      title: "Download started",
      description: "Your ZIP file is being downloaded.",
    });
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="px-4 py-2 flex justify-between items-center">
        {/* Left side navigation - Desktop */}
        <div className="hidden md:flex items-center space-x-2">
          {/* File Dropdown */}
          <div className="relative" ref={fileDropdownRef}>
            <button 
              className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-1" 
              aria-expanded={fileDropdownOpen} 
              aria-haspopup="true"
              onClick={toggleFileDropdown}
            >
              <i className="flex-none w-5 text-blue-500 dark:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </i>
              <span>File</span>
              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <div 
              className={`absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-10 ${fileDropdownOpen ? 'block' : 'hidden'}`} 
              role="menu" 
              aria-orientation="vertical"
            >
              <div className="py-1">
                <button 
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2" 
                  onClick={handleNewFile}
                >
                  <i className="flex-none w-5 text-blue-500 dark:text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="12" y1="18" x2="12" y2="12" />
                      <line x1="9" y1="15" x2="15" y2="15" />
                    </svg>
                  </i>
                  <span>New File</span>
                </button>
                <button 
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2" 
                  onClick={handleSaveFile}
                >
                  <i className="flex-none w-5 text-blue-500 dark:text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                  </i>
                  <span>Save</span>
                </button>
                <button 
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2" 
                  onClick={handleLoadFile}
                >
                  <i className="flex-none w-5 text-blue-500 dark:text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 19a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2 2h4a2 2 0 0 1 2 2v1" />
                      <path d="M15 13h5v5h-5z" />
                      <path d="M18 16v-3" />
                      <path d="M15 16h5" />
                    </svg>
                  </i>
                  <span>Load</span>
                </button>
              </div>
            </div>
          </div>

          {/* Download Dropdown */}
          <div className="relative" ref={downloadDropdownRef}>
            <button 
              className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-1" 
              aria-expanded={downloadDropdownOpen} 
              aria-haspopup="true"
              onClick={toggleDownloadDropdown}
            >
              <i className="flex-none w-5 text-blue-500 dark:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </i>
              <span>Download</span>
              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <div 
              className={`absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-10 ${downloadDropdownOpen ? 'block' : 'hidden'}`} 
              role="menu" 
              aria-orientation="vertical"
            >
              <div className="py-1">
                <button 
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2" 
                  onClick={handleDownloadMd}
                >
                  <i className="flex-none w-5 text-blue-500 dark:text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                      <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
                      <path d="M9 9h1V7" />
                      <path d="M14 9h1V7" />
                      <path d="M9 13h6" />
                      <path d="M9 17h6" />
                    </svg>
                  </i>
                  <span>Download as .md</span>
                </button>
                <button 
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2" 
                  onClick={handleDownloadZip}
                >
                  <i className="flex-none w-5 text-blue-500 dark:text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 8v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8" />
                      <path d="M12 2v6.5l3-3" />
                      <path d="M9 5.5l3 3" />
                      <path d="M21 10H3" />
                      <path d="M17 14h1" />
                      <path d="M12 14h1" />
                      <path d="M7 14h1" />
                    </svg>
                  </i>
                  <span>Download as .zip</span>
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button 
            className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-1"
            onClick={handleQuickSave}
          >
            <i className="flex-none w-5 text-blue-500 dark:text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
            </i>
            <span>Save</span>
          </button>
        </div>

        {/* Mobile Hamburger Menu Button */}
        <button 
          className="md:hidden text-slate-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md" 
          aria-label="Open menu"
          onClick={toggleMobileMenu}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* App Icon/Logo (Center on Mobile, Left on Desktop) */}
        <div className="flex items-center md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
          <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            MD Editor
          </span>
        </div>

        {/* Right side navigation */}
        <div className="flex items-center">
          {/* Theme Toggle */}
          <button 
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none" 
            aria-label="Toggle dark mode"
            onClick={toggleTheme}
          >
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
          
          {/* Settings Button */}
          <button className="p-2 ml-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none" aria-label="Settings">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600 dark:text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <div className={`md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 ${isMobileMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
        <div className="px-2 py-3 space-y-1">
          {/* File Section */}
          <div className="px-3 py-2 font-semibold text-sm text-slate-500 dark:text-slate-400">File</div>
          <button 
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
            onClick={handleNewFile}
          >
            <i className="flex-none w-5 text-blue-500 dark:text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
            </i>
            <span>New File</span>
          </button>
          <button 
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
            onClick={handleSaveFile}
          >
            <i className="flex-none w-5 text-blue-500 dark:text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
            </i>
            <span>Save</span>
          </button>
          <button 
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
            onClick={handleLoadFile}
          >
            <i className="flex-none w-5 text-blue-500 dark:text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 19a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2 2h4a2 2 0 0 1 2 2v1" />
                <path d="M15 13h5v5h-5z" />
                <path d="M18 16v-3" />
                <path d="M15 16h5" />
              </svg>
            </i>
            <span>Load</span>
          </button>
          
          {/* Download Section */}
          <div className="px-3 py-2 font-semibold text-sm text-slate-500 dark:text-slate-400 mt-3">Download</div>
          <button 
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
            onClick={handleDownloadMd}
          >
            <i className="flex-none w-5 text-blue-500 dark:text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
                <path d="M9 9h1V7" />
                <path d="M14 9h1V7" />
                <path d="M9 13h6" />
                <path d="M9 17h6" />
              </svg>
            </i>
            <span>Download as .md</span>
          </button>
          <button 
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
            onClick={handleDownloadZip}
          >
            <i className="flex-none w-5 text-blue-500 dark:text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 8v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8" />
                <path d="M12 2v6.5l3-3" />
                <path d="M9 5.5l3 3" />
                <path d="M21 10H3" />
                <path d="M17 14h1" />
                <path d="M12 14h1" />
                <path d="M7 14h1" />
              </svg>
            </i>
            <span>Download as .zip</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
