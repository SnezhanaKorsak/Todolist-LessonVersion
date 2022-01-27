import {Dispatch} from "redux";


export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

type initialStateType = typeof initialState

const initialState = { status: 'idle' as RequestStatusType}

export const appReducer = (state = initialState, action: AppActionsType): initialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}

        default:
            return state
    }

}
// actions
export const setAppStatusAC = (status: RequestStatusType) =>
    ({type: 'APP/SET-STATUS', status} as const)


// thunk
/*export const fetchTasks = (todolistId: string): ThunkType => (dispatch: Dispatch) => {
    taskAPI.getTasks(todolistId)
        .then(res => {
            dispatch(setTasksAC(res.data.items, todolistId))
        })
}*/


// types
export type AppActionsType = ReturnType<typeof setAppStatusAC>

