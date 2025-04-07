import React from 'react';
import styles from '../../styles/components/TextInput.module.css';

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
    <div className={styles.formGroup}>
      <label htmlFor={id} className={styles.label}>{label}</label>
      <input
        type={type}
        id={id}
        className={`${styles.input} ${error ? styles.inputErrorState : ''}`}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
      />
      {error && <div className={styles.inputError}>{error}</div>}
    </div>
  );
};

export default TextInput;