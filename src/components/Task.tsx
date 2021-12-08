import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@material-ui/icons";
import {TaskType} from "./Todolist";

type TaskPropsType = {
    task: TaskType
    todoId: string
    changeStatus: (id: string, isDone: boolean, todoId: string) => void
    changeTitle: (todoId: string, newTitle: string, taskId: string) => void
    removeTask: (id: string, todoId: string) => void
}
export const Task: React.FC<TaskPropsType> = React.memo(({
                                                             task,
                                                             todoId,
                                                             changeStatus,
                                                             changeTitle,
                                                             removeTask,
                                                         }) => {
    const onChangeStatusHandler = useCallback((tId: string, e: ChangeEvent<HTMLInputElement>) => {
        changeStatus(tId, e.currentTarget.checked, todoId)
    }, [changeStatus, todoId])

    const onChangeTitleHandler = useCallback((newTitle: string, tId: string) => {
        changeTitle(todoId, newTitle, tId)
    }, [changeTitle, todoId])

    const removeTaskHandler = useCallback((tId: string) => {
        removeTask(tId, todoId)
    }, [removeTask, todoId])


    return <div key={task.id} className={task.isDone ? 'isDone' : ''}>
        <Checkbox
            checked={task.isDone}
            color="primary"
            onChange={(e) => onChangeStatusHandler(task.id, e)}
        />
        <EditableSpan value={task.title} callback={(newTitle) => onChangeTitleHandler(newTitle, task.id)}/>
        <IconButton aria-label="delete" size="small" onClick={() => removeTaskHandler(task.id)}>
            <Delete fontSize="small"/>
        </IconButton>

    </div>
})