import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {Button, TextField} from "@material-ui/core";



type AddItemFormType = {
    callback: (title: string) => void
}

export const AddItemForm: React.FC<AddItemFormType> = ({callback}) => {
    let [title, setTitle] = useState('')
    let [error, setError] = useState<string>('')

    const addItemHandler = () => {
        if (title.trim() !== '') {
            callback(title)
            setTitle('')
        } else {
            setError('Title is required')
        }
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
        setError('')
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            addItemHandler()
        }
    }

    return <div>
        <TextField variant="outlined"
                   error={!!error}
                   value={title}
                   onChange={onChangeHandler}
                   onKeyPress={onKeyPressHandler}
                   label="Title"
                   helperText={error}
                   size='small'
        />

        <Button variant="contained"
                style={{minWidth: '20px', height:'40px', background: 'skyblue', margin: '0 0 5px 5px'}}
                onClick={addItemHandler}>+</Button>
    </div>
}