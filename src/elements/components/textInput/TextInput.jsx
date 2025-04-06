import React from 'react';

// Component for the text inputs
const TextInput = ({ 
  id, 
  label, 
  type = 'text', 
  value, 
  onChange, 
  required = false, 
  placeholder = '',
  error = null
}) => {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
      />
      {error && <div className="input-error">{error}</div>}
    </div>
  );
};

export default TextInput;