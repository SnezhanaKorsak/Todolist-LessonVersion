import {setAppStatus} from "../../app/app-reducer";
import {authAPI, LoginParamsType} from "../../api/auth-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {AxiosError} from "axios";
import {ResponseStatusCodes} from "../TodolistsList/tasks-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTodolistData} from "../TodolistsList/todolist-reducer";
import {AppDispatch} from "../../app/store";

const initialState = {
    isLoggedIn: false
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setIsLoggedIn(state, action: PayloadAction<{value: boolean}>) {
            state.isLoggedIn = action.payload.value
        },
    },
})

export const authReducer = authSlice.reducer

// actions
export const {setIsLoggedIn} = authSlice.actions

// thunk
export const loginTC = (data: LoginParamsType) => (dispatch: AppDispatch) => {
    dispatch(setAppStatus( {status: 'loading'}))
    authAPI.login(data)
        .then(res => {
            if (res.data.resultCode === ResponseStatusCodes.success) {
                dispatch(setAppStatus({status: 'succeed'}))
                dispatch(setIsLoggedIn({value: true}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error: AxiosError) => {
            handleServerNetworkError(dispatch, error.message)
        })
}

export const logoutTC = () => (dispatch: AppDispatch) => {
    dispatch(setAppStatus({status: 'loading'}))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === ResponseStatusCodes.success) {
                dispatch(setAppStatus({status: 'succeed'}))
                dispatch(setIsLoggedIn({value: false}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error: AxiosError) => {
            handleServerNetworkError(dispatch, error.message)
        })
        .finally(() => {
            dispatch(clearTodolistData())
        })
}