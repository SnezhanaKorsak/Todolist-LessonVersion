import {Delete} from "@material-ui/icons";
import React, {ChangeEvent} from "react";
import {FilterType} from "../App";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, Checkbox, IconButton} from "@material-ui/core";

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
            <Button variant="contained" startIcon={<Delete/>} onClick={removeTodolistHandler}
                    style={{minWidth: '20px', height: '25px', background: 'lightgray', margin: '10px'}}>
                DELETE
            </Button>

        </h3>

        <AddItemForm callback={addTaskHandler}/>

        <div>
            {tasks.map(t => {
                return <div key={t.id} className={t.isDone ? 'isDone' : ''}>
                    <Checkbox
                        checked={t.isDone}
                        color="primary"
                        onChange={(e) => onChangeStatusHandler(t.id, e)}
                    />
                    <EditableSpan value={t.title} callback={(newTitle) => onChangeTitleHandler(newTitle, t.id)}/>
                    <IconButton aria-label="delete" size="small" onClick={() => removeTaskHandler(t.id)}>
                        <Delete fontSize="small"/>
                    </IconButton>

                </div>

            })}
        </div>
        <div>
            <Button variant={filter === 'All' ? 'outlined' : 'text'}
                    style={{minWidth: '20px', height: '30px', margin: '5px'}}
                    onClick={() => changeFilterHandler('All')}
                    color={'default'}>All
            </Button>
            <Button variant={filter === 'Active' ? 'outlined' : 'text'}
                    onClick={() => changeFilterHandler('Active')}
                    color={'primary'}>Active
            </Button>
            <Button variant={filter === 'Completed' ? 'outlined' : 'text'}
                    onClick={() => changeFilterHandler('Completed')}
                    color={'secondary'}>Completed
            </Button>
            {/*<button className={filter === 'All' ? 'activeFilter' : 'button'}
                    onClick={() => changeFilterHandler('All')}>All
            </button>
            <button className={filter === 'Active' ? 'activeFilter' : 'button'}
                    onClick={() => changeFilterHandler('Active')}>Active
            </button>
            <button className={filter === 'Completed' ? 'activeFilter' : 'button'}
                    onClick={() => changeFilterHandler('Completed')}>Completed
            </button>*/}
        </div>
    </div>
}