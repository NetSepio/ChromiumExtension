import React from 'react';
import InputStyles from './InputStyles';

const Input = ({ name, label, value, onChange,type, disabled }) => {
  const styles = InputStyles();
  return (
    <div>
      <label className={styles.label}>{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        autoComplete='off'
        className={styles.input}
        disabled={disabled}
        type={type}
      />
    </div>
  );
};

export default Input;