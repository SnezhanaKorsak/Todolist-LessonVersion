import React, {useState} from 'react';
import './App.css';

import {v1} from "uuid";
import {TodoList} from "./TodoList";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

export type FilterValuesType = "all" | "active" | "completed"

type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}
type TaskStateType = {
    [key: string]: Array<TaskType>
}

function App() {

    const todolistId1 = v1()
    const todolistId2 = v1()

    let [todolists, setTodolist] = useState<Array<TodolistType>>([
        {id: todolistId1, title: "What to learn", filter: "all"},
        {id: todolistId2, title: "What to buy", filter: "all"}
    ])

    const [tasks, setTasks] = useState<TaskStateType>({
        [todolistId1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "React", isDone: false},
            {id: v1(), title: "Redux", isDone: false},
            {id: v1(), title: "GraphQL", isDone: false}
        ],
        [todolistId2]: [
            {id: v1(), title: "Milk", isDone: false},
            {id: v1(), title: "Bread", isDone: false},
            {id: v1(), title: "Meat", isDone: true}
        ]
    })

    //BLL:


    const removeTask = (taskID: string, todolistId: string) => {
        tasks[todolistId] = tasks[todolistId].filter(t => t.id !== taskID)
        setTasks({...tasks})
    }
    const addTask = (title: string, todolistId: string) => {
        const newTask: TaskType = {
            id: v1(),
            title: title,
            isDone: false
        }
        tasks[todolistId] = [newTask, ...tasks[todolistId]]
        setTasks({...tasks})
    }
    const changeTaskStatus = (taskID: string, isDone: boolean, todolistId: string) => {
        // const  updatedTasks: Array<TaskType> = tasks
        //      .map(t => t.id === taskID ? {...t, isDone: isDone} : t)
        // setTasks(updatedTasks)
        tasks[todolistId] = tasks[todolistId].map(t => t.id === taskID ? {...t, isDone} : t)
        setTasks({...tasks})
    }

    const removeTodolist = (todolistId: string) => {
        setTodolist (todolists.filter(tl => tl.id !== todolistId) )
        delete tasks[todolistId]
    }

    //UI:
    const changeTodoListFilter = (value: FilterValuesType, todolistId: string) => {
        let todolist = todolists.find(tl => tl.id === todolistId);
        if (todolist) {
            todolist.filter = value;
            setTodolist([...todolists])
        }
    }

    return (
        <div className="App">
            {todolists.map(tl => {

                let tasksForRender = tasks[tl.id]
                if (tl.filter === "active") {
                    tasksForRender = tasksForRender.filter(t => t.isDone === false)
                }
                if (tl.filter === "completed") {
                    tasksForRender = tasksForRender.filter(t => t.isDone === true)
                }

                return <TodoList key={tl.id}
                                 id={tl.id}
                                 title={tl.title}
                                 tasks={tasksForRender}
                                 filter={tl.filter}
                                 removeTask={removeTask}
                                 addTask={addTask}
                                 changeTaskStatus={changeTaskStatus}
                                 changeTodoListFilter={changeTodoListFilter}
                                 removeTodolist={removeTodolist}
                />
            })
            }
        </div>
    );
}

export default App;
