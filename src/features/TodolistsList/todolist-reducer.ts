import {todolistAPI, TodolistType} from "../../api/todolists-api";
import {Dispatch} from "redux";
import {ThunkType} from "../../app/store";
import {setAppErrorAC, setAppStatusAC} from "../../app/app-reducer";


type initialStateType = TodolistDomainType[]

const initialState: initialStateType = []

export const todolistsReducer = (state = initialState, action: TodolistsActionsType): initialStateType => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return state.filter(f => f.id !== action.id)

        case "ADD-TODOLIST":
            const newTodolist: TodolistDomainType = {
                ...action.todolist,
                filter: "All"
            }
            return [newTodolist, ...state]

        case "CHANGE-TODOLIST-TITLE":
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)

        case "CHANGE-TODOLIST-FILTER":
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)

        case "SET-TODOLISTS":
            return action.todolists.map(tl =>  ({...tl, filter: "All"}))

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

// thunk
export const fetchTodo = (): ThunkType => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC('loading'))
        todolistAPI.getTodolists()
            .then(res => {
                dispatch(setAppStatusAC('succeeded'))
                dispatch(setTodolistsAC(res.data))
            })

    }
}

export const createTodolistTC = (title: string): ThunkType => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistAPI.createTodolist(title)
        .then(res => {
            dispatch(setAppStatusAC('succeeded'))
            if (res.data.resultCode === 0) {
                dispatch(addTodolistAC(res.data.data.item))
            } else {
                dispatch(setAppErrorAC(res.data.messages[0]))
            }
        })
}

export const deleteTodolistTC = (todolistId: string): ThunkType => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistAPI.deleteTodolists(todolistId)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setAppStatusAC('succeeded'))
                dispatch(removeTodolistAC(todolistId))
            }
        })
}

export const updateTitleTodolistTC = (todolistId: string, title: string): ThunkType => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistAPI.updateTodolist(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setAppStatusAC('succeeded'))
                dispatch(changeTodolistTitleAC(todolistId, title))
            }
        })
}

// types
export type FilterType = 'All' | 'Active' | 'Completed'
export type TodolistDomainType = TodolistType & {
    filter: FilterType
}
export type TodolistsActionsType = ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof setTodolistsAC>
