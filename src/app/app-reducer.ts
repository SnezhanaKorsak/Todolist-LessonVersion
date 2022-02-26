import {Dispatch} from "redux";
import {authAPI} from "../api/auth-api";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {AxiosError} from "axios";

export type RequestStatusType = 'idle' | 'loading' | 'succeed' | 'failed'

type initialStateType = typeof initialState

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
    isInitialized: false
}

export const appReducer = (state = initialState, action: AppActionsType): initialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}

        case "APP/SET-ERROR":
            return {...state, error: action.error}

        case "APP/SET-IS-INITIALIZED":
            return {...state, isInitialized: action.value}

        default:
            return state
    }

}
// actions
export const setAppStatusAC = (status: RequestStatusType) =>
    ({type: 'APP/SET-STATUS', status} as const)

export const setAppErrorAC = (error: string | null) =>
    ({type: 'APP/SET-ERROR', error} as const)

export const setIsInitializedAC = (value: boolean) =>
    ({type: 'APP/SET-IS-INITIALIZED', value} as const)

//thunk
export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true));
        } else {
            handleServerAppError(res.data, dispatch)
        }
    })
        .catch((error: AxiosError) => {
            handleServerNetworkError(dispatch, error.message)
        })
        .finally(() => {
            dispatch(setIsInitializedAC(true))
        })
}


// types
export type AppActionsType = ReturnType<typeof setAppStatusAC>
    | ReturnType<typeof setAppErrorAC>
    | ReturnType<typeof setIsInitializedAC>

