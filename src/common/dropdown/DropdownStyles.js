import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  searchInput3: {
    width: '100%',
    background: '#181818 0% 0% no-repeat padding-box',
    // color:'#fff !important',
    border: '1px solid #DFDFDF',
    borderRadius: '5px',
    height: '35px',
    marginTop: '5px',
    marginBottom: 5,
    border: '1px solid #2f2f2f',
    outline:'none',

    '& .MuiInput-underline': {
      padding: '0 15px',
      '&::before': {
        borderBottom: 'unset !important',
      },
    },
    '& .MuiAutocomplete-inputRoot': {
      color: '#fff',
    },
    '&:hover': {
      '& .MuiAutocomplete-endAdornment': {
        backgroundColor: theme.palette.primary.main,
      },
    },
  },
  red: {
    color: '#E22626',
  },
}));
