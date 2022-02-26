import {authAPI} from "../api/auth-api";
import {setIsLoggedIn} from "../features/Login/auth-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {AxiosError} from "axios";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppDispatch} from "./store";

export type RequestStatusType = 'idle' | 'loading' | 'succeed' | 'failed'

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
    isInitialized: false
}

const appSlice = createSlice({
    name: "app",
    initialState: initialState,
    reducers: {
        setAppStatus(state, action: PayloadAction<{status: RequestStatusType}>) {
            state.status = action.payload.status
        },
        setAppError(state, action: PayloadAction<{error: string | null}>) {
            state.error = action.payload.error
        },
        setIsInitialized(state, action: PayloadAction<{value: boolean}>) {
            state.isInitialized = action.payload.value
        },
    }
})

export const appReducer = appSlice.reducer

export const {setAppStatus, setAppError, setIsInitialized} = appSlice.actions

//thunk
export const initializeAppTC = () => (dispatch: AppDispatch) => {
    authAPI.me().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedIn({value: true}));
        } else {
            handleServerAppError(res.data, dispatch)
        }
    })
        .catch((error: AxiosError) => {
            handleServerNetworkError(dispatch, error.message)
        })
        .finally(() => {
            dispatch(setIsInitialized({value: true}))
        })
}

