import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  img:{
      borderRadius:'50%',
      height:'15rem',
      width:'15rem',
      [theme.breakpoints.down('sm')]:{
        height:'8rem',
        width:'8rem'
      }
  }
}));
