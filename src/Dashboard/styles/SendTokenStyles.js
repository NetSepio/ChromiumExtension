import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  item:{
      marginBottom:'0.5rem !important',
  },
  subContainer:{
      minWidth:'50%',
      [theme.breakpoints.down("sm")]:{
          minWidth:'100%'
      }
  }
}));
