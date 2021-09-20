import React, {ChangeEvent, KeyboardEvent, useState} from "react";

type EditableSpanType = {
    title: string
    onChangeValue: (newValue: string) => void
}

export function EditableSpan(props: EditableSpanType) {
    let [editMode, setEditMode] = useState(false)
    let [newTitle, setNewTitle] = useState('')


    const activateSetEditMode = () => {
        setEditMode(true)
        setNewTitle(props.title)
    }
    const activateViewEditMode = () => {
        setEditMode(false)
        props.onChangeValue(newTitle)
    }
    const onChangeTitleHandler = (e: ChangeEvent<HTMLInputElement> ) => setNewTitle(e.currentTarget.value)

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.charCode === 13) {
            setEditMode(false)
            props.onChangeValue(newTitle)
        }
    }

    return editMode ?
        <input value={newTitle}
               onBlur={activateViewEditMode}
               onChange={onChangeTitleHandler}
               onKeyPress={onKeyPressHandler}
               autoFocus/>
        : <span onDoubleClick={activateSetEditMode} >{props.title}</span>

}