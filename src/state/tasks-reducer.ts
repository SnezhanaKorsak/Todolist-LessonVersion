import {addTodolistAC, removeTodolistAC, setTodolistsAC} from "./todolist-reducer";
import {TasksStateType} from "../App";
import {taskAPI, TaskStatuses, TaskType, UpdateModelType} from "../api/tasks-api";
import {Dispatch} from "redux";
import {AppRootStateType, ThunkType} from "./store";


export type TasksActionsType = ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof changeTaskStatusAC>
    | ReturnType<typeof changeTaskTitleAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof setTodolistsAC>


type initialStateType = TasksStateType

const initialState: initialStateType = {}

export const tasksReducer = (state = initialState, action: TasksActionsType): initialStateType => {
    switch (action.type) {
        case "REMOVE-TASK":
            return {
                ...state, [action.todolistId]:
                    state[action.todolistId].filter(f => f.id !== action.taskId)
            }
        case "ADD-TASK":
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}

        case "CHANGE-TASK-STATUS":
            return {
                ...state, [action.todolistId]:
                    state[action.todolistId].map(m => m.id === action.taskId ? {...m, status: action.status} : m)
            }
        case "CHANGE-TASK-TITLE":
            return {
                ...state, [action.todolistId]:
                    state[action.todolistId].map(m => m.id === action.taskId ? {...m, title: action.title} : m)
            }
        case "ADD-TODOLIST":
            return {...state, [action.todolist.id]: []}

        case "REMOVE-TODOLIST":
            let copyState = {...state}
            delete copyState[action.id]
            return copyState;

        case "SET-TODOLISTS":
            let copy = {...state}
            action.todolists.forEach(tl => copy[tl.id] = [])
            return copy;

        case "SET-TASKS":
            let copyStateTasks = {...state}
            copyStateTasks[action.todolistId] = action.tasks
            return copyStateTasks;

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
export const addTaskAC = (task: TaskType) => {
    return {
        type: 'ADD-TASK',
        task
    } as const
}

export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string) => {
    return {
        type: 'CHANGE-TASK-STATUS',
        taskId, status, todolistId
    } as const
}

export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) => {
    return {
        type: 'CHANGE-TASK-TITLE',
        taskId, title, todolistId
    } as const
}

export const setTasksAC = (tasks: TaskType[], todolistId: string,) => {
    return {
        type: 'SET-TASKS',
        todolistId, tasks
    } as const
}

//thunk

export const fetchTasks = (todolistId: string): ThunkType => {
    return (dispatch: Dispatch) => {
        taskAPI.getTasks(todolistId)
            .then(res => {
                dispatch(setTasksAC(res.data.items, todolistId))
            })
    }
}

export const addTaskTC = (todolistId: string, title: string): ThunkType => {
    return (dispatch: Dispatch) => {
        taskAPI.createTask(todolistId, title)
            .then(res => {
                // console.log(res)
                dispatch(addTaskAC(res.data.data.item))
            })
    }
}

export const deleteTaskTC = (todolistId: string, taskId: string): ThunkType => {
    return (dispatch: Dispatch) => {
        taskAPI.deleteTask(todolistId, taskId)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(removeTaskAC(taskId, todolistId))
                }
            })
    }
}

export const updateTaskTitleTC = (todolistId: string, task: TaskType): ThunkType => {
    const model: UpdateModelType = {
        status: task.status,
        startDate: task.startDate,
        priority: task.priority,
        description: task.description,
        deadline: task.deadline,
        title: task.title
    }

    return (dispatch: Dispatch) => {
        taskAPI.updateTask(todolistId, task.id, model)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(changeTaskTitleAC(task.id, model.title, todolistId))
                }
            })
    }
}

export const updateTaskStatusTC = (todolistId: string, taskId: string, status: TaskStatuses): ThunkType => {
    return (dispatch: Dispatch, getState: () => AppRootStateType) => {

        const appState = getState()
        const tasksApp = appState.tasks
        const tasksForCurrentTodolist = tasksApp[todolistId]
        const currentTask = tasksForCurrentTodolist.find(t => t.id === taskId)

        if (currentTask) {
            const model: UpdateModelType = {
                status: status,
                title: currentTask.title,
                deadline: currentTask.deadline,
                description: currentTask.description,
                priority: currentTask.priority,
                startDate: currentTask.startDate
            }

            taskAPI.updateTask(todolistId, taskId, model)
                .then(res => {
                    if (res.data.resultCode === 0) {
                        dispatch(changeTaskStatusAC(taskId, model.status, todolistId))
                    }
                })
        }
    }
}