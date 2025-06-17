import React from 'react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-gray-600 rounded-full animate-spin animation-delay-150"></div>
      </div>
    </div>
  );
};

export default Loader;