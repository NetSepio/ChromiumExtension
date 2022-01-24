import React from 'react';
import TextAreaStyles from './TextAreaStyles';

const TextArea = ({ name, placeholder, label, rows, value, onChange,readOnly }) => {
  const styles = TextAreaStyles();
  return (
    <>
      <label>{label}</label>
      <textarea
        rows={parseInt(rows)}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={styles.textarea}
        style={{ resize: 'none' }}
        readOnly={readOnly}
      />
    </>
  );
};

export default TextArea;
