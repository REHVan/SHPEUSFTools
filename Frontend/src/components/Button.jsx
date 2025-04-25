import React from 'react';

function Button({ type, label, className = '' }) {
  return (
    <button type={type} className={`btn ${className}`}>
      {label}
    </button>
  );
}

//Please deploy

export default Button;
