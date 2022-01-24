import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  input: {
    width: '100%',
    background: '#181818 0% 0% no-repeat padding-box',
    border: '1px solid #DFDFDF',
    borderRadius: '5px',
    padding: '5px 0px 0px 10px',
    height: '40px',
    marginTop: 5,
    color:'#fff',
    fontSize:'1rem',
    outline:'transparent none 0px !important',
    borderStyle:'solid',
    borderColor:'#2f2f2f',

    '&::before': {
      borderBottom: 'unset',
    },

    '& .MuiInput-underline::before': {
      borderBottom: 'unset',
    },
  },
  label:{
      color:'#fff'
  }
}));
