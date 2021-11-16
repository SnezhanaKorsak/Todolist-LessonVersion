import React, {ChangeEvent} from "react";
import {FilterType} from "../App";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}
type TodolistPropsType = {
    todoId: string
    tasks: TaskType[]
    title: string
    filter: FilterType
    removeTask: (id: string, todoId: string) => void
    changeFilter: (todoId: string, value: FilterType) => void
    addTask: (taskTitle: string, todoId: string) => void
    changeStatus: (id: string, isDone: boolean, todoId: string) => void
    removeTodolist: (todoId: string) => void
    changeTitle: (todoId: string, newTitle: string, taskId: string) => void
    changeTitleTodolist: (todoId: string, newTitle: string) => void
}

export const Todolist: React.FC<TodolistPropsType> = ({
                                                          tasks,
                                                          todoId,
                                                          title,
                                                          filter,
                                                          removeTask,
                                                          changeFilter,
                                                          addTask,
                                                          changeStatus,
                                                          removeTodolist,
                                                          changeTitle,
                                                          ...restProps
                                                      }) => {
    const addTaskHandler = (title: string) => {
        addTask(title, todoId)
    }

    const removeTaskHandler = (tId: string) => {
        removeTask(tId, todoId)
    }

    const changeFilterHandler = (value: FilterType) => {
        changeFilter(todoId, value)
    }

    const onChangeStatusHandler = (tId: string, e: ChangeEvent<HTMLInputElement>) => {
        changeStatus(tId, e.currentTarget.checked, todoId)
    }
    const removeTodolistHandler = () => {
        removeTodolist(todoId)
    }
    const changeTitleTodolistHandler = (newTitle: string) => {
        restProps.changeTitleTodolist(todoId, newTitle)
    }
    const onChangeTitleHandler = (newTitle: string, tId: string) => {
        changeTitle(todoId, newTitle, tId)
    }


    return <div>
        <h3><EditableSpan value={title} callback={changeTitleTodolistHandler}/>
            <button onClick={removeTodolistHandler}>x</button>
        </h3>

        <AddItemForm callback={addTaskHandler}/>

        <ul>
            {tasks.map(t => {
                return <li key={t.id} className={t.isDone ? 'isDone' : ''}>
                    <input type="checkbox" checked={t.isDone} onChange={(e) => onChangeStatusHandler(t.id, e)}/>
                    <EditableSpan value={t.title} callback={(newTitle)=>onChangeTitleHandler(newTitle, t.id)}/>
                    <button onClick={() => removeTaskHandler(t.id)}>x</button>
                </li>

            })}
        </ul>
        <div>
            <button className={filter === 'All' ? 'activeFilter' : 'button'}
                    onClick={() => changeFilterHandler('All')}>All
            </button>
            <button className={filter === 'Active' ? 'activeFilter' : 'button'}
                    onClick={() => changeFilterHandler('Active')}>Active
            </button>
            <button className={filter === 'Completed' ? 'activeFilter' : 'button'}
                    onClick={() => changeFilterHandler('Completed')}>Completed
            </button>
        </div>
    </div>
}