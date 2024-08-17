"use client";

import axios, { AxiosError, AxiosResponse } from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation'
import { useCommon } from '@/context/commonContext';
import { ResponseLogin } from '@/app/lib/models/responseLogin';

//const sleep = () => new Promise(resolve => setTimeout(resolve, 2000))

export const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_BASE_URL_AXIOS,
    //withCredentials: true
})

interface Props {
    children: React.ReactNode;
}

export default function AxiosInterceptor({ children }: Props) {
    const { setError } = useCommon();
    const { data: session, status } = useSession();
    const router = useRouter()

    useEffect(() => {
        const user = session?.user as ResponseLogin

        const requestInterceptor = instance.interceptors.request.use(config => {
            if (user) config.headers.Authorization = `Bearer ${user.token}`;
            return config;
        })

        const responseInterceptor = instance.interceptors.response.use(async response => {
            //if (process.env.NODE_ENV === 'development') await sleep();
            // const pagination = response.headers['pagination'];
            // if (pagination) {
            //     response.data = new PaginatedResponse(response.data, JSON.parse(pagination));
            //     return response;
            // }
            return response
        }, (error: AxiosError) => {
            const { status, data } = error.response as AxiosResponse;
            switch (status) {
                case 400:
                    if (data.errors) {
                        const modelStateErrors = [];
                        for (const key in data.errors) {
                            if (data.errors[key]) {
                                modelStateErrors.push(data.errors[key]);
                            }
                        }
                        throw modelStateErrors.flat();
                    } else
                        toast.error(data.message, { toastId: 20 });
                    break;
                case 401:
                    toast.error('401 Unauthorized', { toastId: 12 });
                    break;
                case 403:
                    toast.error('403 You are not allowed to do that!', { toastId: 403 });
                    break;
                case 404:
                    toast.error(data.message, { toastId: 10 });
                    break;
                case 500:
                    setError(data);
                    router.push('/errors/server-error');
                    break;
                default:
                    console.error(data)
                    toast.error('Have a error, see console log');
                    break;
            }

            return Promise.reject(error);
        })

        return () => {
            instance.interceptors.request.eject(requestInterceptor);
            instance.interceptors.response.eject(responseInterceptor);
        };

    }, [status, session])

    return children;
}