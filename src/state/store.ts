import {TasksActionsType, tasksReducer} from "./tasks-reducer";
import {TodolistsActionsType, todolistsReducer} from "./todolist-reducer";
import {applyMiddleware, combineReducers, createStore} from "redux";
import thunk, {ThunkAction} from "redux-thunk";

export const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})

export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppActionType =  TodolistsActionsType | TasksActionsType
export type ThunkType = ThunkAction<void, AppRootStateType, unknown, AppActionType>

export const store = createStore(rootReducer, applyMiddleware(thunk))

//@ts-ignore
window.store = store