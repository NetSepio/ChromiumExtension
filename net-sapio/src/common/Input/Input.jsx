import React from 'react';
import inputStyles from './InputStyles';

const Input = ({
  name,
  label,
  value,
  onChange,
  disabled,
  placeholder,
  style,
  type,
}) => {
  const styles = inputStyles();
  return (
    <div>
      <label className={styles.label}>{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        autoComplete="off"
        className={styles.input}
        disabled={disabled}
        placeholder={placeholder}
        type={type}
        style={style}
      />
    </div>
  );
};

export default Input;
