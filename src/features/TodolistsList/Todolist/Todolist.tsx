import {Delete} from "@material-ui/icons";
import React, {useCallback, useEffect} from "react";
import {AddItemForm} from "../../../components/AddItemForm";
import {EditableSpan} from "../../../components/EditableSpan";
import {Button} from "@material-ui/core";
import {Task} from "./Task/Task";
import {TaskStatuses, TaskType} from "../../../api/tasks-api";
import {FilterType} from "../todolist-reducer";
import {useDispatch} from "react-redux";
import {fetchTasks} from "../tasks-reducer";
import {RequestStatusType} from "../../../app/app-reducer";


type TodolistPropsType = {
    todoId: string
    tasks: TaskType[]
    title: string
    filter: FilterType
    entityStatus: RequestStatusType
    removeTask: (id: string, todoId: string) => void
    changeFilter: (todoId: string, value: FilterType) => void
    addTask: (taskTitle: string, todoId: string) => void
    changeStatus: (id: string, status: TaskStatuses, todoId: string) => void
    removeTodolist: (todoId: string) => void
    changeTitle: (todoId: string, newTitle: string, task: TaskType) => void
    changeTitleTodolist: (todoId: string, newTitle: string) => void
}

export const Todolist: React.FC<TodolistPropsType> = React.memo(({
                                                                     tasks,
                                                                     todoId,
                                                                     title,
                                                                     filter,
                                                                     entityStatus,
                                                                     removeTask,
                                                                     changeFilter,
                                                                     addTask,
                                                                     changeStatus,
                                                                     removeTodolist,
                                                                     changeTitle,
                                                                     changeTitleTodolist,
                                                                 }) => {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchTasks(todoId))
    }, [])

    const addTaskHandler = useCallback((title: string) => {
        addTask(title, todoId)
    }, [addTask, todoId])


    const changeFilterHandler = useCallback((value: FilterType) => {
        changeFilter(todoId, value)
    }, [changeFilter, todoId])


    const removeTodolistHandler = useCallback(() => {
        removeTodolist(todoId)
    }, [removeTodolist, todoId])

    const changeTitleTodolistHandler = useCallback((newTitle: string) => {
        changeTitleTodolist(todoId, newTitle)
    }, [changeTitleTodolist, todoId])


    let taskForTodolist = tasks
    if (filter === 'Active') taskForTodolist = tasks.filter(t => t.status === TaskStatuses.New)
    if (filter === 'Completed') taskForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed)

    return <div>
        <h3><EditableSpan value={title} callback={changeTitleTodolistHandler}/>
            <Button variant="contained" startIcon={<Delete/>} onClick={removeTodolistHandler}
                    disabled={entityStatus === 'loading'}
                    style={{minWidth: '20px', height: '25px', background: 'skyblue', margin: '10px'}}>
                DELETE
            </Button>

        </h3>

        <AddItemForm callback={addTaskHandler} disabled={entityStatus === 'loading'}/>

        <div>
            {taskForTodolist.map(t => <Task key={t.id}
                                            task={t}
                                            todoId={todoId}
                                            changeStatus={changeStatus}
                                            changeTitle={changeTitle}
                                            removeTask={removeTask}/>
            )}
        </div>
        <div>
            <Button variant={filter === 'All' ? 'outlined' : 'text'}
                    style={{minWidth: '20px', height: '30px', margin: '5px'}}
                    onClick={() => changeFilterHandler('All')}
                    color={'success'}>All
            </Button>
            <Button variant={filter === 'Active' ? 'outlined' : 'text'}
                    onClick={() => changeFilterHandler('Active')}
                    color={'primary'}>Active
            </Button>
            <Button variant={filter === 'Completed' ? 'outlined' : 'text'}
                    onClick={() => changeFilterHandler('Completed')}
                    color={'secondary'}>Completed
            </Button>

        </div>
    </div>
})

