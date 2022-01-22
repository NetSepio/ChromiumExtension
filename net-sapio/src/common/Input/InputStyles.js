import { makeStyles } from "@mui/styles";

export default makeStyles((theme) => ({
  input: {
    // fontFamily:'nunito',
    width: '100% !important',
    background: '#181818 0% 0% no-repeat padding-box',
    border: '1px solid #2f2f2f',
    borderRadius: '6px',
    padding: '16px',
    height: '40px',
    marginTop: 5,
    boxSizing:'border-box',
    color:'#fff',
    lineHeight:'19px',
    fontSize:'1rem',
    outline:'none',


    '&::before': {
      borderBottom: 'unset',
    },

    '& .MuiInput-underline::before': {
      borderBottom: 'unset',
    },
  },
  label:{
    fontFamily:'nunito',
  }
}));
