import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-2 px-4 text-center text-sm text-gray-600 dark:text-gray-400">
      <div className="container mx-auto flex flex-wrap justify-center items-center">
        <p>
          Created by{' '}
          <a 
            href="https://github.com/christiandeo" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
          >
            Christian Deo Manlangit
          </a>
        </p>
        <span className="mx-2">•</span>
        <p>© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};

export default Footer;