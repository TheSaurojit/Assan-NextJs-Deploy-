import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className=" rounded-full w-12 h-12 animate-spin" style={{ border: '4px solid #ccc' , borderTopColor : 'blue' }} 
/>
    </div>
  );
};


export default LoadingSpinner;
