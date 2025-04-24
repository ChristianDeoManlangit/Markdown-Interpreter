import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 py-3 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="container mx-auto px-4 flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
        <p>
          Created by{' '}
          <a 
            href="https://github.com/christiandeodutt" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline font-medium"
          >
            Christian Deo Manlangit
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;