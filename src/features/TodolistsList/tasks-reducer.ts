import {addTodolist, clearTodolistData, removeTodolist, setTodolists} from "./todolist-reducer";
import {TasksStateType} from "../../app/App";
import {taskAPI, TaskType, UpdateTaskModelType} from "../../api/tasks-api";
import {AppDispatch, AppRootStateType} from "../../app/store";
import {setAppError, setAppStatus} from "../../app/app-reducer";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {TaskPriority, TaskStatuses} from "../../api/tasks-api";

export enum ResponseStatusCodes {
    success = 0,
    error = 1,
    //captcha = 10,
}

const initialState: TasksStateType = {}

const tasksSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        removeTask(state, action: PayloadAction<{ taskId: string, todolistId: string }>) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(f => f.id === action.payload.taskId)
            tasks.splice(index, 1)
        },
        addTask(state, action: PayloadAction<{ task: TaskType }>) {
            const tasks = state[action.payload.task.todoListId]
            tasks.unshift(action.payload.task)
        },
        updateTask(state, action: PayloadAction<{ taskId: string, model: UpdateDomainTaskModelType, todolistId: string }>) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(f => f.id === action.payload.taskId)
            tasks[index] = {...tasks[index], ...action.payload.model}
        },

        setTasks(state, action: PayloadAction<{ tasks: TaskType[], todolistId: string }>) {
            state[action.payload.todolistId] = action.payload.tasks
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addTodolist, (state, action) => {
            state[action.payload.todolist.id] = []
        });
        builder.addCase(removeTodolist, (state, action) => {
            delete state[action.payload.todolistId]
        });
        builder.addCase(setTodolists, (state, action) => {
            action.payload.todolists.forEach(tl => state[tl.id] = [])
        });
        builder.addCase(clearTodolistData, () => {
            return {}
        });

    }
})

export const tasksReducer = tasksSlice.reducer

// actions
export const {removeTask, addTask, updateTask, setTasks} = tasksSlice.actions

// thunk
export const fetchTasks = (todolistId: string) => (dispatch: AppDispatch) => {
    dispatch(setAppStatus({status: 'loading'}))
    taskAPI.getTasks(todolistId)
        .then(res => {
            dispatch(setTasks({tasks: res.data.items, todolistId}))
        })
        .catch((error: AxiosError) => {
            dispatch(setAppError({error: error.message}))
        })
        .finally(() => {
            dispatch(setAppStatus({status: 'idle'}))
        })
}

export const addTaskTC = (todolistId: string, title: string) => (dispatch: AppDispatch) => {
    dispatch(setAppStatus({status: 'loading'}))
    taskAPI.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === ResponseStatusCodes.success) {
                dispatch(setAppStatus({status: 'succeed'}))
                dispatch(addTask({task: res.data.data.item}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error: AxiosError) => {
            handleServerNetworkError(dispatch, error.message)
        })
}


export const deleteTaskTC = (todolistId: string, taskId: string) => (dispatch: AppDispatch) => {
    dispatch(setAppStatus({status: 'loading'}))
    taskAPI.deleteTask(todolistId, taskId)
        .then(res => {
            if (res.data.resultCode === ResponseStatusCodes.success) {
                dispatch(setAppStatus({status: 'succeed'}))
                dispatch(removeTask({taskId, todolistId}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error: AxiosError) => {
            handleServerNetworkError(dispatch, error.message)
        })
}

export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) =>
    (dispatch: AppDispatch, getState: () => AppRootStateType) => {
        dispatch(setAppStatus({status: 'loading'}))
        const appState = getState()
        const tasksApp = appState.tasks
        const tasksForCurrentTodolist = tasksApp[todolistId]
        const currentTask = tasksForCurrentTodolist.find(t => t.id === taskId)

        if (!currentTask) {
            console.warn('task not found in the state')
            return
        }

        const apiModel: UpdateTaskModelType = {
            deadline: currentTask.deadline,
            description: currentTask.description,
            priority: currentTask.priority,
            startDate: currentTask.startDate,
            title: currentTask.title,
            status: currentTask.status,
            ...domainModel
        }

        taskAPI.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                if (res.data.resultCode === ResponseStatusCodes.success) {
                    dispatch(setAppStatus({status: 'succeed'}))
                    dispatch(updateTask({taskId, model: domainModel, todolistId}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch((error: AxiosError) => {
                handleServerNetworkError(dispatch, error.message)
            })
    }

// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriority
    startDate?: string
    deadline?: string
}