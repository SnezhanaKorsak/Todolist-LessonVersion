import {v1} from "uuid";
import {addTodolistAC, removeTodolistAC} from "./todolist-reducer";
import {TasksStateType} from "../AppWithRedux";


type ActionsType = ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof changeTaskStatusAC>
    | ReturnType<typeof changeTaskTitleAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof removeTodolistAC>


type initialStateType = TasksStateType

const initialState: initialStateType = {}

export const tasksReducer = (state = initialState, action: ActionsType): initialStateType => {
    switch (action.type) {
        case "REMOVE-TASK":
            return {
                ...state, [action.todolistId]:
                    state[action.todolistId].filter(f => f.id !== action.taskId)
            }
        case "ADD-TASK":
            return {
                ...state, [action.todolistId]:
                    [{id: v1(), title: action.title, isDone: false}, ...state[action.todolistId]]
            }
        case "CHANGE-TASK-STATUS":
            return {
                ...state, [action.todolistId]:
                    state[action.todolistId].map(m => m.id === action.taskId ? {...m, isDone: action.isDone} : m)
            }
        case "CHANGE-TASK-TITLE":
            return {
                ...state, [action.todolistId]:
                    state[action.todolistId].map(m => m.id === action.taskId ? {...m, title: action.title} : m)
            }
        case "ADD-TODOLIST":
            return {...state, [action.todolistId]: []}

        case "REMOVE-TODOLIST":
            let copyState = {...state}
            delete copyState[action.id]
            return copyState

        default:
            return state
    }

}

export const removeTaskAC = (taskId: string, todolistId: string) => {
    return {
        type: 'REMOVE-TASK',
        taskId, todolistId
    } as const
}
export const addTaskAC = (title: string, todolistId: string) => {
    return {
        type: 'ADD-TASK',
        title, todolistId
    } as const
}

export const changeTaskStatusAC = (taskId: string, isDone: boolean, todolistId: string) => {
    return {
        type: 'CHANGE-TASK-STATUS',
        taskId, isDone, todolistId
    } as const
}

export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) => {
    return {
        type: 'CHANGE-TASK-TITLE',
        taskId, title, todolistId
    } as const
}