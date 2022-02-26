import {todolistAPI, TodolistType} from "../../api/todolists-api";
import {Dispatch} from "redux";
import {AppActionType, ThunkType} from "../../app/store";
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import {AxiosError} from "axios";
import {fetchTasks, ResponseStatusCodes} from "./tasks-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";


type initialStateType = TodolistDomainType[]

const initialState: initialStateType = []

export const todolistsReducer = (state = initialState, action: TodolistsActionsType): initialStateType => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return state.filter(f => f.id !== action.id)

        case "ADD-TODOLIST":
            const newTodolist: TodolistDomainType = {
                ...action.todolist,
                filter: "All",
                entityStatus: "idle",
            }
            return [newTodolist, ...state]

        case "CHANGE-TODOLIST-TITLE":
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)

        case "CHANGE-TODOLIST-FILTER":
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)

        case "SET-TODOLISTS":
            return action.todolists.map(tl => ({...tl, filter: "All", entityStatus: "idle"}))

        case "CHANGE-TODOLISTS-ENTITY-STATUS":
            return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.entityStatus} : tl)

        case "CLEAR-TODOLISTS-DATA":
            return []

        default:
            return state
    }

}

// actions
export const removeTodolistAC = (todolistId: string) =>
    ({type: 'REMOVE-TODOLIST', id: todolistId} as const)

export const addTodolistAC = (todolist: TodolistType) =>
    ({type: 'ADD-TODOLIST', todolist} as const)

export const changeTodolistTitleAC = (id: string, title: string) =>
    ({type: 'CHANGE-TODOLIST-TITLE', id, title} as const)

export const changeTodolistFilterAC = (id: string, filter: FilterType) =>
    ({type: 'CHANGE-TODOLIST-FILTER', id, filter} as const)

export const setTodolistsAC = (todolists: TodolistType[]) =>
    ({type: 'SET-TODOLISTS', todolists} as const)

export const changeTodolistEntityStatusAC = (entityStatus: RequestStatusType, id: string) =>
    ({type: 'CHANGE-TODOLISTS-ENTITY-STATUS', entityStatus, id} as const)

export const clearTodolistDataAC = () =>
    ({type: 'CLEAR-TODOLISTS-DATA'} as const)

// thunk
export const fetchTodo = (): ThunkType => {
    return (dispatch) => {
        dispatch(setAppStatusAC('loading'))
        todolistAPI.getTodolists()
            .then(res => {
                dispatch(setTodolistsAC(res.data))
                dispatch(setAppStatusAC('succeed'))
                return res.data
            })
            .then((todolists) => {
                    todolists.forEach(tl => {
                        dispatch(fetchTasks(tl.id))
                    })
            })
            .catch((error: AxiosError) => {
                handleServerNetworkError(dispatch, error.message)
            })
    }
}

export const createTodolistTC = (title: string): ThunkType => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistAPI.createTodolist(title)
        .then(res => {
            if (res.data.resultCode === ResponseStatusCodes.success) {
                dispatch(addTodolistAC(res.data.data.item))
                dispatch(setAppStatusAC('succeed'))
            }  else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error: AxiosError) => {
            handleServerNetworkError(dispatch, error.message)
        })
}

export const deleteTodolistTC = (todolistId: string): ThunkType => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTodolistEntityStatusAC("loading", todolistId))
    todolistAPI.deleteTodolists(todolistId)
        .then(res => {
            if (res.data.resultCode === ResponseStatusCodes.success) {
                dispatch(removeTodolistAC(todolistId))
                dispatch(setAppStatusAC('succeed'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error: AxiosError) => {
            handleServerNetworkError(dispatch, error.message)
        })
}

export const updateTitleTodolistTC = (todolistId: string, title: string): ThunkType => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistAPI.updateTodolist(todolistId, title)
        .then(res => {
            if (res.data.resultCode === ResponseStatusCodes.success) {
                dispatch(changeTodolistTitleAC(todolistId, title))
                dispatch(setAppStatusAC('succeed'))
                dispatch(clearTodolistDataAC())
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error: AxiosError) => {
            handleServerNetworkError(dispatch, error.message)
        })
}

// types
export type FilterType = 'All' | 'Active' | 'Completed'
export type TodolistDomainType = TodolistType & {
    filter: FilterType,
    entityStatus: RequestStatusType
}
export type TodolistsActionsType = ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof setTodolistsAC>
    | ReturnType<typeof changeTodolistEntityStatusAC>
    | ReturnType<typeof clearTodolistDataAC>
