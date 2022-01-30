import { makeStyles } from '@mui/styles';
export default makeStyles((theme) => ({
  mainContainer: {
    minWidth: '100%',
    minHeight: '90vh',
    height: '100%',
    [theme.breakpoints.down('sm')]: {
      minHeight: '36rem',
      maxHeight: '36rem',
      minWidth: '24rem',
    },
  },
  tab: {
    minWidth: '33.3% !important',
  },
  typoTitle: {
    minWidth: '10rem',
    border: '1px solid grey',
    padding: 10,
    borderRadius: 10,
  },
  accordionContainer: {
    minWidth: '30rem',
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#181818 !important',
    color: '#FFFEF7 !important',
    // boxShadow: '0px 0px 2px 2px #181818',
    [theme.breakpoints.down('sm')]: {
      minWidth: '100%',
    },
  },
  btnContainer: {
    minWidth: '30rem',
    [theme.breakpoints.down('sm')]: {
      minWidth: '100%',
    },
  },
  settingsContainer: {
    '&::-webkit-scrollbar': {
      width: '0.1em',
    },
  },
  // recovery
  warningContainer: {
    minHeight: '5rem',
    padding: 10,
    borderRadius: 10,
    boxShadow: '0px 0px 2px 2px #D3D3D3',
    [theme.breakpoints.down('sm')]: {
      minWidth: '100%',
    },
  },
  showMnemContainer: {
    padding: 10,
    minWidth: '50%',
    [theme.breakpoints.down('sm')]: {
      minWidth: '100%',
    },
  },
  // review
  mainReviewContainer: {
    maxHeight: '75vh',
    overflowX: 'hidden',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '0.4em',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)',
      outline: '1px solid slategrey',
    },
  },
  commonItem:{
    marginBottom:'1rem !important'
  },
  reviewContainer: {
    minWidth: '30rem',
    padding: 10,
    // backgroundColor:'#222222 !important',
    [theme.breakpoints.down('sm')]: {
      minWidth: '100%',
    },
  },
  commonFont: {
    fontFamily: 'nunito !important',
  },
}));
