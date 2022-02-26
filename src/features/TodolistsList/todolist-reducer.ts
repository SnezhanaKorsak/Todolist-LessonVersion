import {todolistAPI, TodolistType} from "../../api/todolists-api";
import {RequestStatusType, setAppStatus} from "../../app/app-reducer";
import {AxiosError} from "axios";
import {fetchTasks, ResponseStatusCodes} from "./tasks-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppDispatch} from "../../app/store";


const initialState: TodolistDomainType[] = []

const todolistSlice = createSlice({
    name: "todolist",
    initialState: initialState,
    reducers: {
        removeTodolist(state, action: PayloadAction<{ todolistId: string }>) {
            const index = state.findIndex(f => f.id === action.payload.todolistId)
            state.splice(index, 1)
        },
        addTodolist(state, action: PayloadAction<{ todolist: TodolistType }>) {
            const newTodolist: TodolistDomainType = {
                ...action.payload.todolist,
                filter: "All",
                entityStatus: "idle",
            }
            state.unshift(newTodolist)
        },
        changeTodolistTitle(state, action: PayloadAction<{ id: string, title: string }>) {
            const index = state.findIndex(f => f.id === action.payload.id)
            state[index].title = action.payload.title
        },
        changeTodolistFilter(state, action: PayloadAction<{ id: string, filter: FilterType }>) {
            const index = state.findIndex(f => f.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        setTodolists(state, action: PayloadAction<{ todolists: TodolistType[] }>) {
            return action.payload.todolists.map(tl => ({...tl, filter: "All", entityStatus: "idle"}))
        },
        changeTodolistEntityStatus(state, action: PayloadAction<{ entityStatus: RequestStatusType, id: string }>) {
            const index = state.findIndex(f => f.id === action.payload.id)
            state[index].entityStatus = action.payload.entityStatus
        },
        clearTodolistData() {
            return []
        },

    }
})

export const todolistsReducer = todolistSlice.reducer

// actions
export const {
    setTodolists, addTodolist, changeTodolistEntityStatus,
    changeTodolistFilter, changeTodolistTitle, clearTodolistData, removeTodolist
} = todolistSlice.actions

// thunk
export const fetchTodo = () => {
    return (dispatch: AppDispatch) => {
        dispatch(setAppStatus({status: 'loading'}))
        todolistAPI.getTodolists()
            .then(res => {
                dispatch(setTodolists({todolists: res.data}))
                dispatch(setAppStatus({status: 'succeed'}))
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

export const createTodolistTC = (title: string) => (dispatch: AppDispatch) => {
    dispatch(setAppStatus({status: 'loading'}))
    todolistAPI.createTodolist(title)
        .then(res => {
            if (res.data.resultCode === ResponseStatusCodes.success) {
                dispatch(addTodolist({todolist: res.data.data.item}))
                dispatch(setAppStatus({status: 'succeed'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error: AxiosError) => {
            handleServerNetworkError(dispatch, error.message)
        })
}

export const deleteTodolistTC = (todolistId: string) => (dispatch: AppDispatch) => {
    dispatch(setAppStatus({status: 'loading'}))
    dispatch(changeTodolistEntityStatus({id: todolistId, entityStatus: "loading"}))
    todolistAPI.deleteTodolists(todolistId)
        .then(res => {
            if (res.data.resultCode === ResponseStatusCodes.success) {
                dispatch(removeTodolist({todolistId: todolistId}))
                dispatch(setAppStatus({status: 'succeed'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error: AxiosError) => {
            handleServerNetworkError(dispatch, error.message)
        })
}

export const updateTitleTodolistTC = (todolistId: string, title: string) => (dispatch: AppDispatch) => {
    dispatch(setAppStatus({status: 'loading'}))
    todolistAPI.updateTodolist(todolistId, title)
        .then(res => {
            if (res.data.resultCode === ResponseStatusCodes.success) {
                dispatch(setAppStatus({status: 'succeed'}))
                dispatch(changeTodolistTitle({id: todolistId, title}))
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
