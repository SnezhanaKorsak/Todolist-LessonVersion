import {TasksActionsType, tasksReducer} from "../features/TodolistsList/tasks-reducer";
import {TodolistsActionsType, todolistsReducer} from "../features/TodolistsList/todolist-reducer";
import {applyMiddleware, combineReducers, createStore} from "redux";
import thunk, {ThunkAction} from "redux-thunk";
import {AppActionsType, appReducer} from "./app-reducer";
import {TypedUseSelectorHook, useSelector} from "react-redux";
import {AuthActionsType, authReducer} from "../features/Login/auth-reducer";

export const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppActionType =  TodolistsActionsType | TasksActionsType | AppActionsType | AuthActionsType
export type ThunkType = ThunkAction<void, AppRootStateType, unknown, AppActionType>

export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

export const store = createStore(rootReducer, applyMiddleware(thunk))

//@ts-ignore
window.store = store