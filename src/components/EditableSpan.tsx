import React, {ChangeEvent, useState} from "react";
import {TextField} from "@material-ui/core";

type EditableSpanType = {
    value: string
    callback: (newTitle: string) => void
}

export const EditableSpan: React.FC<EditableSpanType> = React.memo(({value, callback}) => {
    console.log('EditableSpan working')
    let [editMode, setEditMode] = useState(false)
    let [title, setTitle] = useState(value)

    const onEditMode = () => {
        setEditMode(true)
    }
    const offEditMode = () => {
        setEditMode(false)
        callback(title)
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    return editMode
        ? <TextField variant="outlined"
                     value={title} onChange={onChangeHandler} autoFocus onBlur={offEditMode}
                     size='small'/>

        : <span onDoubleClick={onEditMode}>{value}</span>
})