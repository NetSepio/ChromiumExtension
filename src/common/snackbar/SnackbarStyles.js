import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  success: {
    background: '#FCFFF5 0% 0% no-repeat padding-box !important',
    border: '1px solid #A8C599 !important',
    color: '#1E561F !important',
    '& button': {
      color: '#1E561F',
    },
    width:'100%'
  },    
  error: {
    background: '#FFF6F6 0% 0% no-repeat padding-box',
    border: '1px solid #973937',
    color: '#973937',
    '& button': {
      color: '#973937',
    },
  },
  warning: {
    background: '#FFFAF3 0% 0% no-repeat padding-box',
    border: '1px solid #CCBEA0',
    color: '#7A4D05',
    '& button': {
      color: '#7A4D05',
    },
  },
  info: {
    background: '#F8FFFF 0% 0% no-repeat padding-box',
    border: '1px solid #BEDFE6',
    color: '#0E566C',
    '& button': {
      color: '#0E566C',
    },
  },
}));
