import React, {useState} from 'react';
import './App.css';
import {Todolist} from './Todolist';
import {v1} from 'uuid';

export type FilterValuesType = "all" | "active" | "completed";
type TodolistPropsType = {
    id: string
    title: string
    filter: FilterValuesType
}

function App() {

    const todolistId1 = v1();
    const todolistId2 = v1();

    const [todolists, setTodolists] = useState<Array<TodolistPropsType>>([
            {
                id: todolistId1,
                title: "What to learn",
                filter: "all"
            },
            {
                id: todolistId2,
                title: "What to buy",
                filter: "all"
            },
        ]
    )

    let [tasks, setTasks] = useState({
        [todolistId1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "ReactJS", isDone: false},
            {id: v1(), title: "Rest API", isDone: false},
            {id: v1(), title: "GraphQL", isDone: false},
        ],
        [todolistId2]: [
            {id: v1(), title: "Book", isDone: true},
            {id: v1(), title: "Note", isDone: true},
            {id: v1(), title: "Pen", isDone: false},

        ]
    });

    function removeTask(id: string, todolistId: string) {
        let task = tasks[todolistId]
        tasks[todolistId] = task.filter(t => t.id != id);
        setTasks({...tasks});
    }

    function addTask(title: string, todolistId: string) {
        let taskTodolist = tasks[todolistId]
        let task = {id: v1(), title: title, isDone: false};
        tasks[todolistId] = [task, ...taskTodolist];
        setTasks({...tasks});
    }

    function changeStatus(taskId: string, isDone: boolean, todolistId: string) {
        let taskTodolist = tasks[todolistId]
        let task = taskTodolist.find(t => t.id === taskId);
        if (task) {
            task.isDone = isDone;
        }

        setTasks({...tasks});
    }


    function changeFilter(value: FilterValuesType, todolistId: string) {
        let todolist = todolists.find(tl => tl.id === todolistId)
        if (todolist) {
            todolist.filter = value
            setTodolists([...todolists])
        }

    }
    function removeTodolist (todolistId: string) {
        setTodolists( todolists.filter (tl => tl.id != todolistId) )
        delete tasks[todolistId]
        setTasks({...tasks})

    }

    return (
        <div className="App">
            {todolists.map(tl => {
                let tasksForTodolist = tasks[tl.id];

                if (tl.filter === "active") {
                    tasksForTodolist = tasksForTodolist.filter(t => t.isDone === false);
                }
                if (tl.filter === "completed") {
                    tasksForTodolist = tasksForTodolist.filter(t => t.isDone === true);
                }
                return <Todolist
                    key={tl.id}
                    id={tl.id}
                    title={tl.title}
                    tasks={tasksForTodolist}
                    removeTask={removeTask}
                    changeFilter={changeFilter}
                    addTask={addTask}
                    changeTaskStatus={changeStatus}
                    filter={tl.filter}
                    removeTodolist={removeTodolist}
                />
            })}

        </div>
    );
}

export default App;
