import React from 'react';
import { makeStyles } from '@mui/styles';
import { CircularProgress } from '@mui/material';
import { Backdrop } from '@mui/material';


const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

export default function Loader() {
    const classes = useStyles();
    return (
        <Backdrop open={true} className={classes.backdrop}>
            <CircularProgress color="primary" />
        </Backdrop>
    );
}