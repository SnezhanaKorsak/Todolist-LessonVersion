import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {
    changeTodolistFilter,
    createTodolistTC,
    deleteTodolistTC,
    fetchTodo,
    FilterType,
    TodolistDomainType,
    updateTitleTodolistTC
} from "./todolist-reducer";
import React, {useCallback, useEffect} from "react";
import {addTaskTC, deleteTaskTC, updateTaskTC} from "./tasks-reducer";
import {TaskStatuses, TaskType} from "../../api/tasks-api";
import {Grid, Paper} from "@material-ui/core";
import {AddItemForm} from "../../components/AddItemForm";
import {Todolist} from "./Todolist/Todolist";
import {TasksStateType} from "../../app/App";
import {Navigate} from "react-router-dom";

export const TodolistsList = () => {

    const dispatch = useDispatch()
    const todolists = useSelector<AppRootStateType, TodolistDomainType[]>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)

    useEffect(() => {
        if(!isLoggedIn) return
        dispatch(fetchTodo())
    }, [])

    const removeTask = useCallback((taskId: string, todoId: string) => {
        dispatch(deleteTaskTC(todoId, taskId))
    }, [dispatch])

    const addTask = useCallback((taskTitle: string, todoId: string) => {
        dispatch(addTaskTC(todoId, taskTitle))
    }, [dispatch])

    const changeStatus = useCallback((taskId: string, status: TaskStatuses, todoId: string) => {
        dispatch(updateTaskTC(todoId, taskId, {status}))
    }, [dispatch])

    const changeFilter = useCallback((todoId: string, value: FilterType) => {
        dispatch(changeTodolistFilter({id: todoId, filter: value}))
    }, [dispatch])

    const removeTodolist = useCallback((todoId: string) => {
        dispatch(deleteTodolistTC(todoId))
    }, [dispatch])

    const addTodolist = useCallback((title: string) => {
        dispatch(createTodolistTC(title))
    }, [dispatch])

    const changeTitleTask = useCallback((todoId: string, newTitle: string, task: TaskType) => {
        dispatch(updateTaskTC(todoId, task.id, {title: newTitle}))
    }, [dispatch])

    const changeTitleTodolist = useCallback((todoId: string, newTitle: string) => {
        dispatch(updateTitleTodolistTC(todoId, newTitle))
    }, [dispatch])

    if(!isLoggedIn) {
        return <Navigate to="login"/>
    }

    return <>
        <Grid container style={{padding: "20px"}}>
            <AddItemForm callback={addTodolist}/>
        </Grid>

        <Grid container spacing={3}>
            {todolists.map(tl => {
                let taskForTodolist = tasks[tl.id]

                return <Grid item key={tl.id}>
                    <Paper style={{padding: "10px"}}>
                        <Todolist todoId={tl.id}
                                  title={tl.title}
                                  tasks={taskForTodolist}
                                  removeTask={removeTask}
                                  filter={tl.filter}
                                  entityStatus={tl.entityStatus}
                                  changeFilter={changeFilter}
                                  addTask={addTask}
                                  changeStatus={changeStatus}
                                  removeTodolist={removeTodolist}
                                  changeTitle={changeTitleTask}
                                  changeTitleTodolist={changeTitleTodolist}
                        /></Paper>
                </Grid>
            })}
        </Grid>
    </>
}