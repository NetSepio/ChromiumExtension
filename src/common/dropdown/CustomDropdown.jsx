import React from 'react';
import DropdownStyles from './DropdownStyles';
import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

const CustomDropdown = ({ label, options,name, value, handleChangeService,placeHolder }) => {
  const styles = DropdownStyles();
  return (
    <>
      <label htmlFor="" className={styles.fieldHeading}>
        {label} {<span className={styles.red}>*</span>}
      </label>
      <Autocomplete
        name={name}
        options={options}
        getOptionLabel={(option) => option?.value}
        value={value}
        className={`${styles.searchInput3}`}
        onChange={(event, newVal) => handleChangeService(event,newVal)}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            placeholder={placeHolder}
          />
        )}
      />
    </>
  );
};

export default CustomDropdown;
