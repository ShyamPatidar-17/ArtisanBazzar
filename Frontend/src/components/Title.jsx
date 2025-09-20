import React from 'react';

const Title = ({ text1, text2 }) => {
  return (
    <div className="flex items-center gap-3 mb-4">
      <p className="text-amber-900 text-lg sm:text-xl font-bold tracking-wide drop-shadow-sm">
        {text1}{' '}
        <span className="text-red-700 font-extrabold">{text2}</span>
      </p>
      {/* Gradient underline representing vibrant marketplace colors */}
      <span className="flex-1 h-1 sm:h-2 rounded-full bg-gradient-to-r from-yellow-400 via-red-500 to-green-600 shadow-md animate-pulse"></span>
      {/* Decorative artisan dot */}
      <span className="w-2 h-2 rounded-full bg-red-600 hidden sm:inline-block animate-bounce"></span>
    </div>
  );
};

export default Title;
