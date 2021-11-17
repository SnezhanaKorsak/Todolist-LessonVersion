import React from 'react';
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

    const dispatch = useDispatch()
    const todolists = useSelector<AppRootStateType, TodolistType[]>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)


    const removeTask = (id: string, todoId: string) => {
        dispatch(removeTaskAC(id, todoId))
    }
    const addTask = (taskTitle: string, todoId: string) => {
        dispatch(addTaskAC(taskTitle, todoId))
    }
    const changeStatus = (id: string, isDone: boolean, todoId: string) => {
        dispatch(changeTaskStatusAC(id, isDone, todoId))
    }
    const changeFilter = (todoId: string, value: FilterType) => {
        dispatch(changeTodolistFilterAC(todoId, value))
    }
    const removeTodolist = (todoId: string) => {
       dispatch(removeTodolistAC(todoId))
    }
    const addTodolist = (title: string) => {
       dispatch(addTodolistAC(title))
    }
    const changeTitleTask = (todoId: string, newTitle: string, taskId: string) => {
       dispatch(changeTaskTitleAC(taskId, newTitle, todoId))
    }
    const changeTitleTodolist = (todoId: string, newTitle: string) => {
       dispatch(changeTodolistTitleAC(todoId, newTitle))
    }

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
                        if (tl.filter === 'Active') taskForTodolist = taskForTodolist.filter(t => !t.isDone)
                        if (tl.filter === 'Completed') taskForTodolist = taskForTodolist.filter(t => t.isDone)

                        return <Grid item>
                            <Paper style={{padding: "10px"}}>
                                <Todolist key={tl.id}
                                          todoId={tl.id}
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
