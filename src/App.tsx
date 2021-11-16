import React, {useState} from 'react';
import './App.css';
import {TaskType, Todolist} from "./components/Todolist";
import {v1} from "uuid";
import {AddItemForm} from "./components/AddItemForm";

export type FilterType = 'All' | 'Active' | 'Completed'
export type TodolistType = {
    id: string
    title: string
    filter: FilterType
}
export type TasksStateType = {
    [key: string]: TaskType[]
}

function App() {
    const todolistId1 = v1()
    const todolistId2 = v1()

    let [tasks, setTasks] = useState<TasksStateType>({
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
        }
    )
    let [todolists, setTodolist] = useState<TodolistType[]>([
        {id: todolistId1, title: 'What to learn', filter: 'All'},
        {id: todolistId2, title: 'What to byu', filter: 'All'},
    ])


    const removeTask = (id: string, todoId: string) => {
        setTasks({...tasks, [todoId]: tasks[todoId].filter(t => t.id !== id)})
    }
    const addTask = (taskTitle: string, todoId: string) => {
        setTasks({...tasks, [todoId]: [{id: v1(), title: taskTitle, isDone: false}, ...tasks[todoId]]})
    }
    const changeStatus = (id: string, isDone: boolean, todoId: string) => {
        setTasks({...tasks, [todoId]: tasks[todoId].map(t => t.id === id ? {...t, isDone: isDone} : t)})
    }
    const changeFilter = (todoId: string, value: FilterType) => {
        setTodolist(todolists.map(t => t.id === todoId ? {...t, filter: value} : t))
    }
    const removeTodolist = (todoId: string) => {
        setTodolist(todolists.filter(f => f.id !== todoId))
        delete tasks[todoId]
        setTasks({...tasks})
    }
    const addTodolist = (title: string) => {
        const todolistId = v1()
        setTodolist([{id: todolistId, title: title, filter: 'All'}, ...todolists])
        setTasks({...tasks, [todolistId]: []})
    }
    const changeTitle = (todoId: string, newTitle: string, taskId: string ) => {
        setTasks({...tasks, [todoId]: tasks[todoId].map(m => m.id === taskId
            ? {...m, title: newTitle} : m)})
    }
    const changeTitleTodolist = (todoId: string, newTitle: string) => {
        setTodolist(todolists.map(m => m.id === todoId ? {...m, title: newTitle} : m))
    }

    return (
        <div className="App">
            <AddItemForm callback={addTodolist}/>

            {todolists.map(tl => {
                let taskForTodolist = tasks[tl.id]
                if (tl.filter === 'Active') taskForTodolist = taskForTodolist.filter(t => !t.isDone)
                if (tl.filter === 'Completed') taskForTodolist = taskForTodolist.filter(t => t.isDone)

                return <Todolist key={tl.id}
                                 todoId={tl.id}
                                 title={tl.title}
                                 tasks={taskForTodolist}
                                 removeTask={removeTask}
                                 filter={tl.filter}
                                 changeFilter={changeFilter}
                                 addTask={addTask}
                                 changeStatus={changeStatus}
                                 removeTodolist={removeTodolist}
                                 changeTitle={changeTitle}
                                 changeTitleTodolist={changeTitleTodolist}
                />
            })}
        </div>
    );
}

export default App;
