import React from 'react';

function Button({ type, children, className = '' }) {
  return (
    <button type={type} className={`btn ${className}`}>
      {children}
    </button>
  );
}

export default Button;
