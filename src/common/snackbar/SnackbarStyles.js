import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  success: {
    background: '#FCFFF5 0% 0% no-repeat padding-box !important',
    border: '1px solid #A8C599 !important',
    color: '#1E561F !important',
    '& button': {
      color: '#1E561F !important',
    },
    width:'100%'
  },    
  error: {
    background: '#FFF6F6 0% 0% no-repeat padding-box !important',
    border: '1px solid #973937 !important',
    color: '#973937 !important',
    '& button': {
      color: '#973937 !important',
    },
  },
  warning: {
    background: '#FFFAF3 0% 0% no-repeat padding-box !important',
    border: '1px solid #CCBEA0 !important',
    color: '#7A4D05 !important',
    '& button': {
      color: '#7A4D05 !important',
    },
  },
  info: {
    background: '#F8FFFF 0% 0% no-repeat padding-box !important',
    border: '1px solid #BEDFE6 !important',
    color: '#0E566C !important',
    '& button': {
      color: '#0E566C !important',
    },
  },
}));
