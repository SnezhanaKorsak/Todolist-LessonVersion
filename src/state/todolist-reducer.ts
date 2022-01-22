import {v1} from "uuid";
import {todolistAPI, TodolistType} from "../api/todolists-api";
import {Dispatch} from "redux";
import {ThunkType} from "./store";


export const todolistId1 = v1()
export const todolistId2 = v1()

export type FilterType = 'All' | 'Active' | 'Completed'
export type TodolistDomainType = TodolistType & {
    filter: FilterType
}

type initialStateType = TodolistDomainType[]

export type TodolistsActionsType = ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof setTodolistsAC>

const initialState: initialStateType = []


export const todolistsReducer = (state = initialState, action: TodolistsActionsType): initialStateType => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return state.filter(f => f.id !== action.id)

        case "ADD-TODOLIST":
            return [{
                id: action.todolistId,
                title: action.title,
                filter: "All",
                order: 0,
                addedDate: ''
            },
                ...state]

        case "CHANGE-TODOLIST-TITLE":
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)

        case "CHANGE-TODOLIST-FILTER":
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)

        case "SET-TODOLISTS":
            return action.todolists.map(tl => {
                return {...tl, filter: "All"}
            })

        default:
            return state
    }

}

export const removeTodolistAC = (todolistId: string) => {
    return {
        type: 'REMOVE-TODOLIST',
        id: todolistId
    } as const
}
export const addTodolistAC = (title: string) => {
    return {
        type: 'ADD-TODOLIST',
        todolistId: v1(),
        title
    } as const
}
export const changeTodolistTitleAC = (id: string, title: string) => {
    return {
        type: 'CHANGE-TODOLIST-TITLE',
        id, title
    } as const
}
export const changeTodolistFilterAC = (id: string, filter: FilterType) => {
    return {
        type: 'CHANGE-TODOLIST-FILTER',
        id, filter
    } as const
}

export const setTodolistsAC = (todolists: TodolistType[]) => {
    return {
        type: 'SET-TODOLISTS',
        todolists
    } as const
}

//thunk
export const fetchTodo = (): ThunkType => {
    return (dispatch: Dispatch) => {
        todolistAPI.getTodolists()
            .then(res => dispatch(setTodolistsAC(res.data)))
    }
}