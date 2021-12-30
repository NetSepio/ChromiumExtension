import { makeStyles } from '@mui/styles';
export default makeStyles((theme) => ({
  drawer: {
    width: 240,
    backgroundColor: `${theme.palette.primary.main}!important`,
  },
  toolbarMarginDrawer: {
    marginBottom: '4.7em',
  },
  drawerText: {
    fontFamily: 'Roboto',
    fontSize: '0.86rem',
    fontWeight: 500,
    textTransform: 'none',
    color: '#fff',
    opacity: 0.7,
  },
  drawerItemSelected: {
    opacity: 1,
  },
}));
