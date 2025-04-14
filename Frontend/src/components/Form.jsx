import React from 'react';

function Form({ action, method, children, className }) {
  return (
    <form 
      action={action} 
      method={method} 
      className={`max-w-md mx-auto p-6 border border-gray-300 rounded-lg bg-white shadow-md ${className}`}
    >
      {children}
    </form>
  );
}

export default Form;
