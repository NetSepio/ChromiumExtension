import React from 'react'
import { TextField,MenuItem } from '@mui/material'

const Dropdown = (props) => {
    return (
        <TextField
        select
        fullWidth
        defaultValue=""
        // variant="outlined"
        size="small"
        disabled={props.disabled}
        value={props.value}
        onChange={props.onChange}
        InputProps={{
          style: {
            width: props.width,
            height: '38px',
            padding: '0px',
            background: '#F4F4F4 0% 0% no-repeat padding-box !important',
            color:'#fff',
            fontWeight:400,
            outline: 'none',
            border:'1px solid #4E44CE'
          },
        }}
        SelectProps={{
          MenuProps: {
            anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
            transformOrigin: { vertical: 'top', horizontal: 'center' },
            // getContentAnchorEl: null,
          },
        }}
      >
        {props.arr.map((option) => (
            <MenuItem key={option.value} value={option} sx={{}}>
              {option.value}
            </MenuItem>
          ))}
      </TextField>
    )
}

export default Dropdown
