import {TodolistType} from "../App";
import {v1} from "uuid";


type ActionsType = ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>


export const todolistsReducer = (state: TodolistType[], action: ActionsType) => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return state.filter(f => f.id !== action.id)

        case "ADD-TODOLIST":
            return [...state, {id: action.todolistId, title: action.title, filter: "All"}]

        case "CHANGE-TODOLIST-TITLE":
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)

        case "CHANGE-TODOLIST-FILTER":
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)

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
export const changeTodolistFilterAC = (id: string, filter: string) => {
    return {
        type: 'CHANGE-TODOLIST-FILTER',
        id, filter
    } as const
}