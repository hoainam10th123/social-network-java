"use client"

import { createContext, useContext, useEffect, useReducer } from "react";
import { Client } from '@stomp/stompjs';
import { useSession } from "next-auth/react";
import SockJS from 'sockjs-client';
import { usePresenseUsers } from "./presenseUserContext";
import { useMessages } from "./messageStompContext";
import { MessageCaller } from "@/app/lib/models/messageCaller";
import { toast } from "react-toastify";
import { IComment } from "@/app/lib/models/comment";
import { usePosts } from "./baiVietContext";

interface CommonState {
    stompClient: Client | null;
}

export enum ActionType {
    SetStompClient,
}

export interface SetStompClient {
    type: ActionType.SetStompClient;
    payload: Client;
}


export type CommonActions = SetStompClient;


interface CommonContextProps {
    stompState: CommonState;
    SetStompClient: (data: Client) => void;
}

const StompContext = createContext<CommonContextProps | undefined>(undefined);

const commonReducer = (state: CommonState, action: CommonActions): CommonState => {
    switch (action.type) {
        case ActionType.SetStompClient:
            return {
                ...state,
                stompClient: action.payload
            };
        default:
            return state;
    }
};

export const StompProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { AddComment } = usePosts()
    const { AddUser, RemoveUser, SetOnlineUsers, AddChatBox } = usePresenseUsers()
    const { SetMessages, AddMessage } = useMessages()
    const { data: session } = useSession()
    const [stompState, dispatch] = useReducer(commonReducer, {
        stompClient: null,
    });

    useEffect(() => {
        if (session) {
            localStorage.setItem('user', JSON.stringify(session.user))

            const socket = new SockJS(`http://localhost:8080/ws`);

            const stompClient = new Client({
                webSocketFactory: () => socket,
                connectHeaders: {
                    Authorization: `Bearer ${session.user.token}`,
                },
                debug: (str) => {
                    console.log(str);
                },
                onConnect: () => {
                    console.log('Connected');                    

                    stompClient.subscribe(`/user/${session?.user.user.username}/queue/online_users`, (message) => {
                        SetOnlineUsers(JSON.parse(message.body))
                    });

                    // tin nhan nhan do user khac gui den
                    stompClient.subscribe(`/user/${session?.user.user.username}/queue/messages`, (message) => {
                        const data = JSON.parse(message.body)
                        AddMessage(data.group, data.message)
                        //show chat box
                        AddChatBox(data.senderUser)
                    });

                    stompClient.subscribe('/topic/broadcast', (message) => {
                        const data = JSON.parse(message.body)
                        if (typeof (data) === 'string') {
                            //toast.info(`${data} offline`)
                            RemoveUser(data)
                        } else {
                            //toast.info(`${data.name} online`)
                            AddUser(data)
                        }
                    });

                    // tin nhan khi chat gui toi chinh caller
                    stompClient.subscribe(`/user/${session?.user.user.username}/topic/reply`, (message) => {
                        const data = JSON.parse(message.body)
                        AddMessage(data.group, data.message)                            
                    });

                    stompClient.subscribe(`/user/${session?.user.user.username}/topic/caller`, (message) => {
                        const data: MessageCaller = JSON.parse(message.body)
                        SetMessages(data.group, data.messages)
                    });

                    stompClient.subscribe(`/user/${session?.user.user.username}/topic/like`, (message) => {
                        const data: string = JSON.parse(message.body)
                        toast.info(data)
                    });

                    stompClient.subscribe('/topic/add_comment', (message) => {
                        const data: IComment = JSON.parse(message.body)      
                        AddComment(data)
                    });

                    if (stompClient && stompClient.connected) {
                        stompClient.publish({
                            destination: '/app/user.onConnected'
                        })
                    }
                },
                onStompError: (frame) => {
                    console.error('Broker reported error: ' + frame.headers['message']);
                    console.error('Additional details: ' + frame.body);
                },
                onWebSocketError: (error) => {
                    console.error('Error with websocket: ', error);
                }
            })

            stompClient.activate();

            SetStompClient(stompClient)
        }
    }, [session])

    const SetStompClient = (data: Client) => {
        dispatch({ type: ActionType.SetStompClient, payload: data });
    };

    return (
        <StompContext.Provider value={{ stompState, SetStompClient }}>
            {children}
        </StompContext.Provider>
    )
}

export const useStompClient = () => {
    const context = useContext(StompContext);
    if (!context) {
        throw new Error('useStompClient must be used within a StompProvider');
    }
    return context;
};
