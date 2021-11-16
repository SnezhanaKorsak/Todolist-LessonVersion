import React, {ChangeEvent, KeyboardEvent, useState} from "react";

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
        <input className={error ? 'error' : ''} value={title}
               onChange={onChangeHandler} onKeyPress={onKeyPressHandler}/>
        <button onClick={addItemHandler}>+</button>
        {error && <div className='errorMessage'>{error}</div>}
    </div>
}