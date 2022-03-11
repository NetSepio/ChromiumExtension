import { makeStyles } from '@mui/styles';
export default makeStyles((theme) => ({
  item: {
    marginBottom: '1rem',
  },
  rootField: {
    [`& fieldset`]: {
      borderRadius: 15,
      background: '#181818 0% 0% no-repeat padding-box',
      color:'#fff !important'
    },
  },
}));
