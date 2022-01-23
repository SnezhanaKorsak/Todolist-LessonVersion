import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from './tasks-reducer';
import {TasksStateType} from '../App';
import {addTodolistAC, removeTodolistAC} from './todolist-reducer';
import {TaskPriority, TaskStatuses} from "../api/tasks-api";

let startState: TasksStateType

beforeEach(() => {
    startState = {
        "todolistId1": [
            {
                id: "1", title: "CSS", status: TaskStatuses.New,
                priority: TaskPriority.Middle, order: 0, startDate: '', deadline: '',
                todoListId: "todolistId1", addedDate: '', description: ''
            },
            {
                id: "2", title: "JS", status: TaskStatuses.Completed,
                priority: TaskPriority.Middle, order: 0, startDate: '', deadline: '',
                todoListId: "todolistId1", addedDate: '', description: ''
            },
            {
                id: "3", title: "React", status: TaskStatuses.New,
                priority: TaskPriority.Middle, order: 0, startDate: '', deadline: '',
                todoListId: "todolistId1", addedDate: '', description: ''
            }
        ],
        "todolistId2": [
            {
                id: "1", title: "bread", status: TaskStatuses.New,
                priority: TaskPriority.Middle, order: 0, startDate: '', deadline: '',
                todoListId: "todolistId2", addedDate: '', description: ''
            },
            {
                id: "2", title: "milk", status: TaskStatuses.Completed,
                priority: TaskPriority.Middle, order: 0, startDate: '', deadline: '',
                todoListId: "todolistId2", addedDate: '', description: ''
            },
            {
                id: "3", title: "tea", status: TaskStatuses.New,
                priority: TaskPriority.Middle, order: 0, startDate: '', deadline: '',
                todoListId: "todolistId2", addedDate: '', description: ''
            }
        ]
    };
})

test('correct task should be deleted from correct array', () => {

    const action = removeTaskAC("2", "todolistId2");
    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
        "todolistId1": [
            {
                id: "1", title: "CSS", status: TaskStatuses.New,
                priority: TaskPriority.Middle, order: 0, startDate: '', deadline: '',
                todoListId: "todolistId1", addedDate: '', description: ''
            },
            {
                id: "2", title: "JS", status: TaskStatuses.Completed,
                priority: TaskPriority.Middle, order: 0, startDate: '', deadline: '',
                todoListId: "todolistId1", addedDate: '', description: ''
            },
            {
                id: "3", title: "React", status: TaskStatuses.New,
                priority: TaskPriority.Middle, order: 0, startDate: '', deadline: '',
                todoListId: "todolistId1", addedDate: '', description: ''
            }
        ],
        "todolistId2": [
            {
                id: "1", title: "bread", status: TaskStatuses.New,
                priority: TaskPriority.Middle, order: 0, startDate: '', deadline: '',
                todoListId: "todolistId2", addedDate: '', description: ''
            },
            {
                id: "3", title: "tea", status: TaskStatuses.New,
                priority: TaskPriority.Middle, order: 0, startDate: '', deadline: '',
                todoListId: "todolistId2", addedDate: '', description: ''
            }
        ]
    });

});
test('correct task should be added to correct array', () => {
//"juce", "todolistId2"
    const action = addTaskAC( {
        id: 'ddfdd',
        startDate: '',
        priority: TaskPriority.Middle,
        description: '',
        deadline: '',
        title: "juce",
        status: TaskStatuses.New,
        todoListId: "todolistId2",
        addedDate: '',
        order: 0
    });
    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(4);
    expect(endState["todolistId2"][0].id).toBeDefined();
    expect(endState["todolistId2"][0].title).toBe("juce");
    expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
})
test('status of specified task should be changed', () => {

    const action = changeTaskStatusAC("2", TaskStatuses.New, "todolistId2");
    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"].length).toBe(3);
    expect(endState["todolistId2"][1].title).toBe("milk")
    expect(endState["todolistId2"][1].status).toBe(TaskStatuses.New);
});
test('title of specified task should be changed', () => {

    const action = changeTaskTitleAC("3", "coffee", "todolistId2");
    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"].length).toBe(3);
    expect(endState["todolistId2"][2].title).toBe("coffee")
    expect(endState["todolistId2"][2].status).toBe(TaskStatuses.New);
});
test('new array should be added when new todolist is added', () => {

    const action = addTodolistAC({
        id: 'sdsscsc',
        order: 0,
        addedDate: '',
        title: "new todolist"
    });
    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState);
    const newKey = keys.find(k => k != "todolistId1" && k != "todolistId2");
    if (!newKey) {
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});

test('property with todolistId should be deleted', () => {

    const action = removeTodolistAC("todolistId2");
    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).not.toBeDefined();
});