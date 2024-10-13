import React from 'react';

function FormInputDDLDisplay({ label, id, name, options, value, onChange, onBlur }) {
  const handleBlur = (e) => {
    // Call onBlur only if it exists
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <div>
      <label htmlFor={id} className="block text-lg font-medium mb-2">{label}</label>
      <select 
        name={name} 
        id={id} 
        value={value} 
        onChange={onChange ? onChange : () => {}} // Provide default no-op function for onChange
        onBlur={onBlur ? handleBlur : () => {}}  // Provide default no-op function for onBlur
        className="p-2 border border-gray-300 rounded-md"
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <br />
    </div>
  );
}

export default FormInputDDLDisplay;
