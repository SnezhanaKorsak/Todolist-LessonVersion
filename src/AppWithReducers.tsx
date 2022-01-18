import React, {useReducer} from 'react';
import './App.css';
import {Todolist} from "./components/Todolist";
import {v1} from "uuid";
import {AddItemForm} from "./components/AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Typography} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import {Menu} from "@material-ui/icons";
import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    todolistsReducer
} from "./state/todolist-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./state/tasks-reducer";

export type FilterType = 'All' | 'Active' | 'Completed'

export function AppWithReducers() {

    const todolistId1 = v1()
    const todolistId2 = v1()

    let [todolists, todolistDispatch] = useReducer(todolistsReducer, [
        {id: todolistId1, title: 'What to learn', filter: 'All'},
        {id: todolistId2, title: 'What to byu', filter: 'All'},
    ])
    let [tasks, tasksDispatch] = useReducer(tasksReducer, {
        [todolistId1]: [
            {id: v1(), title: 'HTML&CSS', isDone: true},
            {id: v1(), title: 'JS', isDone: true},
            {id: v1(), title: 'ReactJS', isDone: false},
            {id: v1(), title: 'Rest API', isDone: false},
            {id: v1(), title: 'GraphQL', isDone: false},
        ],
        [todolistId2]: [
            {id: v1(), title: 'Milk', isDone: true},
            {id: v1(), title: 'Bock', isDone: false},
            {id: v1(), title: 'Pen', isDone: false},
        ],
    })

    const removeTask = (id: string, todoId: string) => {
        tasksDispatch(removeTaskAC(id, todoId))
    }
    const addTask = (taskTitle: string, todoId: string) => {
        tasksDispatch(addTaskAC(taskTitle, todoId))
    }
    const changeStatus = (id: string, isDone: boolean, todoId: string) => {
        tasksDispatch(changeTaskStatusAC(id, isDone, todoId))
    }
    const changeFilter = (todoId: string, value: FilterType) => {
        todolistDispatch(changeTodolistFilterAC(todoId, value))
    }
    const removeTodolist = (todoId: string) => {
        let action = removeTodolistAC(todoId)
        todolistDispatch(action)
        tasksDispatch(action)
    }
    const addTodolist = (title: string) => {
        let action = addTodolistAC(title)
        todolistDispatch(action)
        tasksDispatch(action)
    }
    const changeTitleTask = (todoId: string, newTitle: string, taskId: string) => {
        tasksDispatch(changeTaskTitleAC(taskId, newTitle, todoId))
    }
    const changeTitleTodolist = (todoId: string, newTitle: string) => {
        todolistDispatch(changeTodolistTitleAC(todoId, newTitle))
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

