// .MuiLoadingButton-loading


import { makeStyles } from '@mui/styles';
export default makeStyles((theme) => ({
 loadingBtn:{
    "& .MuiLoadingButton-loading":{
        backgroundColor:`${theme.palette.primary.main} !important`,
        color:'#fff !important'
    }
 }
}));
