import React, {useCallback, useEffect} from 'react';
import './App.css';
import {TaskType, Todolist} from "./components/Todolist";
import {AddItemForm} from "./components/AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Typography} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import {Menu} from "@material-ui/icons";
import {addTodolistAC, changeTodolistFilterAC, changeTodolistTitleAC, removeTodolistAC} from "./state/todolist-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";
import {todolistAPI} from "./api/todolists-api";


export type FilterType = 'All' | 'Active' | 'Completed'

export type TodolistType = {
    id: string
    title: string
    filter: FilterType
}
export type TasksStateType = {
    [key: string]: TaskType[]
}

function AppWithRedux() {
    console.log('App working')
    useEffect(() => {
        todolistAPI.getTodolists().then(res => console.log(res.data))
        //todolistAPI.deleteTodolists('d888ea8c-0932-4ea6-b9eb-a9f2b939c21f').then(res => console.log(res.data))
    }, [])

    const dispatch = useDispatch()
    const todolists = useSelector<AppRootStateType, TodolistType[]>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)


    const removeTask =useCallback((id: string, todoId: string) => {
        dispatch(removeTaskAC(id, todoId))
    }, [dispatch])

    const addTask =useCallback((taskTitle: string, todoId: string) => {
        dispatch(addTaskAC(taskTitle, todoId))
    }, [dispatch])
    const changeStatus =useCallback( (id: string, isDone: boolean, todoId: string) => {
        dispatch(changeTaskStatusAC(id, isDone, todoId))
    }, [dispatch])
    const changeFilter =useCallback((todoId: string, value: FilterType) => {
        dispatch(changeTodolistFilterAC(todoId, value))
    }, [dispatch])
    const removeTodolist =useCallback((todoId: string) => {
        dispatch(removeTodolistAC(todoId))
    }, [dispatch])
    const addTodolist =useCallback((title: string) => {
        dispatch(addTodolistAC(title))
    }, [dispatch])
    const changeTitleTask =useCallback((todoId: string, newTitle: string, taskId: string) => {
        dispatch(changeTaskTitleAC(taskId, newTitle, todoId))
    }, [dispatch])
    const changeTitleTodolist =useCallback((todoId: string, newTitle: string) => {
        dispatch(changeTodolistTitleAC(todoId, newTitle))
    }, [dispatch])

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
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
            </Container>
        </div>
    );
}

export default AppWithRedux;
