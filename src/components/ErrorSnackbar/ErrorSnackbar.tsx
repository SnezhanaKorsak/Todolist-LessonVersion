import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, {AlertProps} from '@mui/material/Alert';
import {SnackbarOrigin} from "@mui/material/Snackbar/Snackbar";
import {useAppSelector} from "../../app/store";
import {useDispatch} from "react-redux";
import {setAppErrorAC} from "../../app/app-reducer";


const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const anchorOrigin: SnackbarOrigin = {
    horizontal: 'center',
    vertical: 'top'
}

export function ErrorSnackbar() {
    const dispatch = useDispatch()
    const error = useAppSelector<string | null>(state => state.app.error)

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(setAppErrorAC(null))
    };

    return (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose}
                  anchorOrigin={anchorOrigin}>
            <Alert onClose={handleClose} severity="error" sx={{width: '100%'}}>
                Error: {error}
            </Alert>
        </Snackbar>
    );
}
