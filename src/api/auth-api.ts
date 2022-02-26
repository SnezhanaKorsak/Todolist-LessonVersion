import axios from "axios";
import {ResponseType} from "./todolists-api"

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': 'c0caff3e-2af3-4ee5-bed5-c0d120d6cc75'
    }

})
// api
export const authAPI = {
    me() {
        return instance.get<ResponseType<{data: UserDataType}>>('auth/me')
    },
    login(data: LoginParamsType) {
        return instance.post<ResponseType<{userId: number}>>('auth/login', data)
    },
    logout() {
        return instance.delete<ResponseType>("/auth/login")
    }

}

//types
export type LoginParamsType = {
    email: string
    password: string
    rememberMe?: boolean
    captcha?: string
}
export type UserDataType = {
    id: number
    login: string
    email: string
}