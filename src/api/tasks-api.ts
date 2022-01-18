import axios from "axios";

type UpdateModelType = {
    title: string
    description: string
    completed: boolean
    status: number
    priority: number
    startDate: string
    deadline: string
}

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': 'c0caff3e-2af3-4ee5-bed5-c0d120d6cc75'
    }

})

export const taskAPI = {
    getTasks(todolistId: string) {
     return instance.get<GetTaskResponse>(`todo-lists/${todolistId}/tasks`)
    },
    createTask(todolistId: string, title: string) {
        return instance.post<ResponseType<TaskType>>(`todo-lists/${todolistId}/tasks`, {title})
    },
    updateTask(todolistId: string, taskId: string, model: UpdateModelType) {
        return instance.put<ResponseType<TaskType>>(`todo-lists/${todolistId}/${taskId}`, model)
    },
    deleteTask(todolistId: string,taskId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/${taskId}`)
    },
}

//types

type TodoDomainType = {
    addedDate: string
    id: string
    order: number
    title: string
}
type ResponseType<D = {}> = {
    data: D
    fieldsErrors: string[]
    messages: string[]
    resultCode: number
}
type TaskType = {
    description: string
    title: string
    completed: boolean
    status: number
    priority: number
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}
type GetTaskResponse = {
    items: TaskType[]
    totalCount: number
    error: string | null
}