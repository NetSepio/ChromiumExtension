import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  textarea: {
    fontFamily:'nunito',
    width: '100%',
    background: '#181818 0% 0% no-repeat padding-box',
    color: '#fff',
    border: '1px solid #2f2f2f',
    borderRadius: '5px',
    padding: '10px 15px',
    height: '6rem',
    marginTop: 2,
    boxSizing: 'border-box',
    marginTop: 10,
    fontSize: '1rem',
    outline: 'none',

    '&::before': {
      borderBottom: 'unset',
    },

    '& .MuiInput-underline::before': {
      borderBottom: 'unset',
    },
  },
}));
