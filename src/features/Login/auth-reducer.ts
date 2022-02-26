import {Dispatch} from "redux";
import {ThunkType} from "../../app/store";
import {setAppStatusAC} from "../../app/app-reducer";
import {authAPI, LoginParamsType} from "../../api/auth-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {AxiosError} from "axios";
import {ResponseStatusCodes} from "../TodolistsList/tasks-reducer";

type initialStateType = {
    isLoggedIn: boolean
}

const initialState: initialStateType = {
    isLoggedIn: false
}

export const authReducer = (state = initialState, action: AuthActionsType): initialStateType => {
    switch (action.type) {

        case "login/SET-IS-LOGGED-IN":
            return {...state, isLoggedIn: action.value}

        default:
            return state
    }

}

// actions
export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)


// thunk
export const loginTC = (data: LoginParamsType): ThunkType => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.login(data)
        .then(res => {
            if (res.data.resultCode === ResponseStatusCodes.success) {
                dispatch(setAppStatusAC('succeed'))
                dispatch(setIsLoggedInAC(true))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error: AxiosError) => {
            handleServerNetworkError(dispatch, error.message)
        })
}

export const logoutTC = (): ThunkType => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === ResponseStatusCodes.success) {
                dispatch(setAppStatusAC('succeed'))
                dispatch(setIsLoggedInAC(false))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error: AxiosError) => {
            handleServerNetworkError(dispatch, error.message)
        })
}

// types
export type AuthActionsType = ReturnType<typeof setIsLoggedInAC>

