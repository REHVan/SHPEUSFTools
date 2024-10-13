import React from 'react';

function Button({ type, label }) {
  return (
    <button type={type}>
      {label}
    </button>
  );
}

export default Button;
