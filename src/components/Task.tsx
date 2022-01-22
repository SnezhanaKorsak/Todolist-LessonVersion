import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@material-ui/icons";
import {TaskStatuses, TaskType} from "../api/tasks-api";


type TaskPropsType = {
    task: TaskType
    todoId: string
    changeStatus: (id: string, status: TaskStatuses, todoId: string) => void
    changeTitle: (todoId: string, newTitle: string, task: TaskType) => void
    removeTask: (id: string, todoId: string) => void
}
export const Task: React.FC<TaskPropsType> = React.memo(({
                                                             task,
                                                             todoId,
                                                             changeStatus,
                                                             changeTitle,
                                                             removeTask,
                                                         }) => {
    const onChangeStatusHandler = useCallback(( e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.currentTarget.checked)
        changeStatus(task.id, e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New, todoId)
    }, [changeStatus, task.id, todoId])

    const onChangeTitleHandler = useCallback((newTitle: string, task: TaskType) => {
        changeTitle(todoId, newTitle, task)
    }, [changeTitle, task, todoId])

    const removeTaskHandler = useCallback((tId: string) => {
        removeTask(tId, todoId)
    }, [removeTask, todoId])


    return <div key={task.id} className={task.status === TaskStatuses.Completed ? 'isDone' : ''}>
        <Checkbox
            checked={task.status === TaskStatuses.Completed}
            color="primary"
            onChange={onChangeStatusHandler}
        />
        {/*<EditableSpan value={task.title} callback={(newTitle) => onChangeTitleHandler(newTitle, task.id)}/>*/}
        <EditableSpan value={task.title} callback={(newTitle) => onChangeTitleHandler(newTitle, task)}/>
        <IconButton aria-label="delete" size="small" onClick={() => removeTaskHandler(task.id)}>
            <Delete fontSize="small"/>
        </IconButton>

    </div>
})