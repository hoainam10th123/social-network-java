"use client"

import { IUser } from "@/app/lib/models/user";
import { createContext, useContext, useReducer } from "react";

interface UsersState {
    onlineUsers: IUser[];
    usersOnlineChatBox: IUser[];
}

export enum ActionType {
    SetOnlineUsers,
    AddChatBox,
    RemoveChatBox,
    AddUser,
    RemoveUser,
}

export interface SetOnlineUsers {
    type: ActionType.SetOnlineUsers;
    payload: IUser[];
}

export interface AddChatBox {
    type: ActionType.AddChatBox;
    payload: IUser;
}

export interface RemoveChatBox {
    type: ActionType.RemoveChatBox;
    payload: string;
}

export interface AddUser {
    type: ActionType.AddUser;
    payload: IUser;
}

export interface RemoveUser {
    type: ActionType.RemoveUser;
    payload: string;
}

type CourseActions = SetOnlineUsers | AddChatBox | RemoveChatBox | AddUser | RemoveUser;

interface CourseContextProps {
    usersState: UsersState;
    SetOnlineUsers: (data: IUser[]) => void;
    AddChatBox:  (data: IUser) => void;
    RemoveChatBox:  (data: string) => void;
    AddUser: (data: IUser) => void;
    RemoveUser: (data: string) => void;
}

const UsersContext = createContext<CourseContextProps | undefined>(undefined);

const courseReducer = (state: UsersState, action: CourseActions): UsersState => {
    switch (action.type) {
        case ActionType.SetOnlineUsers:
            const user1: any = JSON.parse(localStorage.getItem('user')!)
            let users: IUser[] = action.payload
            users = users.filter(x=>x.username !== user1.user.username)
            return {
                ...state,
                onlineUsers: users
            };

        case ActionType.AddChatBox: 
        const isExist = state.usersOnlineChatBox.some(x=>x.username === action.payload.username)
        if(!isExist) state.usersOnlineChatBox.push(action.payload)
            return {
                ...state
            };

        case ActionType.RemoveChatBox: 
        state.usersOnlineChatBox = state.usersOnlineChatBox.filter(x=>x.username !== action.payload)
            return {
                ...state
            };

        case ActionType.AddUser:
            const user: any = JSON.parse(localStorage.getItem('user')!)
            const daTonTai =  state.onlineUsers.some(x=>x.username === action.payload.username)            
            if(!daTonTai && user.user.username !== action.payload.username)
                state.onlineUsers.push(action.payload)
                return {
                    ...state
                };

        case ActionType.RemoveUser:
            state.onlineUsers = state.onlineUsers.filter(x=>x.username !== action.payload)            
                return {
                    ...state
                };
        default:
            return state;
    }
};

export const PresenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [usersState, dispatch] = useReducer(courseReducer, { onlineUsers: [], usersOnlineChatBox: [] });    

    const SetOnlineUsers = (data: IUser[]) => {
        dispatch({ type: ActionType.SetOnlineUsers, payload: data });
    };

    const AddChatBox = (data: IUser) => {
        dispatch({ type: ActionType.AddChatBox, payload: data });
    };

    const RemoveChatBox = (data: string) => {
        dispatch({ type: ActionType.RemoveChatBox, payload: data });
    };

    const AddUser = (data: IUser) => {
        dispatch({ type: ActionType.AddUser, payload: data });
    };

    const RemoveUser = (data: string) => {
        dispatch({ type: ActionType.RemoveUser, payload: data });
    };

    return (
        <UsersContext.Provider value={{ 
            usersState, 
            SetOnlineUsers, 
            AddChatBox, 
            RemoveChatBox, 
            AddUser, 
            RemoveUser
        }}>
            {children}
        </UsersContext.Provider>
    )
}

export const usePresenseUsers = () => {
    const context = useContext(UsersContext);
    if (!context) {
        throw new Error('usePresenseUsers must be used within a PresenseProvider');
    }
    return context;
};
