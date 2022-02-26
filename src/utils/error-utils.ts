import {setAppError, setAppStatus} from "../app/app-reducer";
import {ResponseType} from '../api/todolists-api';
import {AppDispatch} from "../app/store";

export const handleServerNetworkError = (dispatch: AppDispatch, message: string) => {
    dispatch(setAppError({error: message}))
    dispatch(setAppStatus({status: 'idle'}))
}
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: AppDispatch) => {
    if (data.messages.length) {
        dispatch(setAppError({error: data.messages[0]}))
    } else {
        dispatch(setAppError({error:  'Some error occurred'}))
    }
    dispatch(setAppStatus({status: 'failed'}))
}
