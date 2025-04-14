import React from 'react';

function FormInputDisplay({ label, id, type, name, value, onChange, checked, required = false}) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input type={type} id={id}  name={name} value={value} onChange={onChange} checked={checked} required={required} />
      <br />
    </div>
  );
}

export default FormInputDisplay;
