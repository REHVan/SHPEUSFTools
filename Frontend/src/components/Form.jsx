import React from 'react';

function Form({ onSubmit, children, className }) {
  return (
    <form 
      onSubmit={onSubmit} 
      className={`max-w-md mx-auto p-6 border border-gray-300 rounded-lg bg-white shadow-md ${className}`}
    >
      {children}
    </form>
  );
}

export default Form;
