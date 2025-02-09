import React from 'react';

const LoadingBar = ({ fullScreen }) => {
  return (
    <div className={`${fullScreen ? 'fixed inset-0' : 'relative'} flex items-center justify-center bg-gray-900`}>
      <div className="flex flex-col items-center">
        <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-loading-bar"/>
        </div>
        <div className="mt-4 text-gray-400 text-sm font-medium">Loading...</div>
      </div>
    </div>
  );
};

export default LoadingBar;
