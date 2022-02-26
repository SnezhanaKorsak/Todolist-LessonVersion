import {v1} from 'uuid';
import {
    removeTodolist,
    addTodolist,
    changeTodolistFilter,
    changeTodolistTitle,
    FilterType,
    TodolistDomainType,
    todolistsReducer
} from "./todolist-reducer";

let todolistId1: string
let todolistId2: string
let startState: Array<TodolistDomainType>

beforeEach(() => {
    todolistId1 = v1();
    todolistId2 = v1();
    startState = [
        {id: todolistId1, title: "What to learn", filter: "All", order: 0, addedDate: '', entityStatus: "idle"},
        {id: todolistId2, title: "What to buy", filter: "All", order: 0, addedDate: '', entityStatus: "idle"}
    ]
})

test('correct todolist should be removed', () => {

   //const endState = todolistsReducer(startState, {type: 'REMOVE-TODOLIST', id: todolistId1})
    const endState = todolistsReducer(startState, removeTodolist({todolistId: todolistId1}))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be added', () => {

    const endState = todolistsReducer(startState, addTodolist({todolist: {
            id: 'sdsscsc',
            order: 0,
            addedDate: '',
            title: "New Todolist"
        }} ))

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe("New Todolist");
});
test('correct todolist should change its name', () => {

    let newTodolistTitle = "New Todolist";

    const endState = todolistsReducer(startState, changeTodolistTitle({id: todolistId2, title: newTodolistTitle}));

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodolistTitle);
});

test('correct filter of todolist should be changed', () => {

    let newFilter: FilterType = "Completed";

    const endState = todolistsReducer(startState, changeTodolistFilter( {id: todolistId2, filter: newFilter}));

    expect(endState[0].filter).toBe("All");
    expect(endState[1].filter).toBe(newFilter);
});

