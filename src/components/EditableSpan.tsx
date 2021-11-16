import React, {ChangeEvent, useState} from "react";

type EditableSpanType = {
    value: string
    callback: (newTitle: string) => void
}

export const EditableSpan: React.FC<EditableSpanType> = ({value, callback}) => {
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
        ? <input value={title} onChange={onChangeHandler} onBlur={offEditMode} autoFocus/>
        : <span onDoubleClick={onEditMode}>{value}</span>
}