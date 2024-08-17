import { instance } from "@/providers/AxiosInterceptor";
import { AxiosResponse } from "axios";
import { ResponseLogin } from "../models/responseLogin";
import { IPagination } from "../models/pagination";
import { IPost } from "../models/post";
import { IComment } from "../models/comment";


const responseBody = <T>(response: AxiosResponse<T>) => response.data;


const requests = {
    get: <T>(url: string, token?: string, params?: URLSearchParams) => instance.get<T>(url, {params, headers:{"Authorization" : `Bearer ${token}`}}).then(responseBody),
    post: <T>(url: string, body: {}) => instance.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => instance.put<T>(url, body).then(responseBody),
    delete: <T>(url: string) => instance.delete<T>(url).then(responseBody),
}

const Error = {
    badRequest: () => requests.get<any>('errors/bad-request'),
    notfound: () => requests.get<any>('errors/not-found'),
    authorized: () => requests.get<any>('errors/unauthorized'),
    forbidden: () => requests.get<any>('errors/forbidden'),
    serverError: () => requests.get<any>('errors/server-error'),
    validationError: () => requests.post<any>('errors/validation', {}),
}

const Account = {
    login: (data: any) => requests.post<ResponseLogin>('account/login', data),
}

const Posts = {
    getAll: (token: string, pageNumber: number, pageSize: number) => requests.get<IPagination<IPost>>(`posts?pageNumber=${pageNumber}&pageSize=${pageSize}`, token),
    deletePost: (id: number) => requests.delete<any>(`posts/${id}`),
    addPost: (content: string | undefined) => requests.post<IPost>(`posts`, {content}),
    like: (postId: number) => requests.put<any>(`posts/like/${postId}`, {}),    
}

const Comment = {
    update: (id: string, data: any) => requests.put<IComment>(`comments/${id}`, data),
}


const agent = {
    Error,
    Account,
    Posts,
    Comment
}

export default agent;