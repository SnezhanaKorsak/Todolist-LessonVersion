import React, {useCallback, useEffect} from 'react';
import './App.css';
import {Todolist} from "./components/Todolist";
import {AddItemForm} from "./components/AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Typography} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import {Menu} from "@material-ui/icons";
import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC, fetchTodo,
    FilterType,
    removeTodolistAC, TodolistDomainType
} from "./state/todolist-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {addTaskTC, deleteTaskTC, updateTaskTitleTC, updateTaskStatusTC} from "./state/tasks-reducer";
import {TaskStatuses, TaskType} from './api/tasks-api';


export type TasksStateType = {
    [key: string]: TaskType[]
}

function App() {

    useEffect(() => {
        dispatch(fetchTodo())
    }, [])

    const dispatch = useDispatch()
    const todolists = useSelector<AppRootStateType, TodolistDomainType[]>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)


    const removeTask =useCallback((taskId: string, todoId: string) => {
        dispatch(deleteTaskTC(todoId, taskId))
    }, [dispatch])

    const addTask =useCallback((taskTitle: string, todoId: string) => {
        dispatch(addTaskTC(todoId, taskTitle))
    }, [dispatch])

    const changeStatus =useCallback( (taskId: string, status: TaskStatuses, todoId: string) => {
        dispatch(updateTaskStatusTC(todoId, taskId, status))
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

    const changeTitleTask =useCallback((todoId: string, newTitle: string, task: TaskType) => {
        dispatch(updateTaskTitleTC(todoId, task))
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

export default App;
