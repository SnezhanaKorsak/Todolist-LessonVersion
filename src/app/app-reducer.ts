export type RequestStatusType = 'idle' | 'loading' | 'succeed' | 'failed'

type initialStateType = typeof initialState

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null
}

export const appReducer = (state = initialState, action: AppActionsType): initialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}

        case "APP/SET-ERROR":
            return {...state, error: action.error}

        default:
            return state
    }

}
// actions
export const setAppStatusAC = (status: RequestStatusType) =>
    ({type: 'APP/SET-STATUS', status} as const)

export const setAppErrorAC = (error: string | null) =>
    ({type: 'APP/SET-ERROR', error} as const)

// thunk
/*export const fetchTasks = (todolistId: string): ThunkType => (dispatch: Dispatch) => {
    taskAPI.getTasks(todolistId)
        .then(res => {
            dispatch(setTasksAC(res.data.items, todolistId))
        })
}*/


// types
export type AppActionsType = ReturnType<typeof setAppStatusAC> | ReturnType<typeof setAppErrorAC>

