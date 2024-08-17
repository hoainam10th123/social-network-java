"use client"

import { IMessage } from "@/app/lib/models/message";
import { createContext, useContext, useReducer } from "react";


interface MessageState {
    recievedMessages: Map<string, IMessage[]>;
}

export enum ActionType {
    SetMessages,
    AddMessage,
}

export interface SetMessages {
    type: ActionType.SetMessages;
    payload: {group: string; messages: IMessage[]};
}

export interface AddMessage {
    type: ActionType.AddMessage;
    payload: {group: string, data:IMessage};
}

export type CommonActions = SetMessages | AddMessage;


interface CommonContextProps {
    messageState: MessageState;
    SetMessages: (group: string, data: IMessage[]) => void;
    AddMessage: (group: string, data: IMessage) => void;
}

const MessagesContext = createContext<CommonContextProps | undefined>(undefined);


const commonReducer = (state: MessageState, action: CommonActions): MessageState => {
    switch (action.type) {
        case ActionType.AddMessage:
            const messages = state.recievedMessages.get(action.payload.group);
            if(messages){
                const tonTai = messages.some(x=>x.id === action.payload.data.id)
                if(!tonTai)
                    state.recievedMessages.set(action.payload.group, [...messages, action.payload.data]);
            }else{
                state.recievedMessages.set(action.payload.group, [action.payload.data]);
            }            
            return {
                ...state,                
            };

        case ActionType.SetMessages:
            state.recievedMessages.set(action.payload.group, action.payload.messages)
                return {
                    ...state,                    
                };
        
        default:
            return state;
    }
};

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [messageState, dispatch] = useReducer(commonReducer, { 
        recievedMessages: new Map<string, IMessage[]>()
    });

    const SetMessages = (username: string, data: IMessage[]) => {
        dispatch({ type: ActionType.SetMessages, payload: {group: username, messages: data} });
    };

    const AddMessage = (group: string, data: IMessage) => {
        dispatch({ type: ActionType.AddMessage, payload: {group, data} });
    };

    return (
        <MessagesContext.Provider value={{ messageState, SetMessages, AddMessage }}>
            {children}
        </MessagesContext.Provider>
    )
}

export const useMessages = () => {
    const context = useContext(MessagesContext);
    if (!context) {
        throw new Error('useMessages must be used within a MessageProvider');
    }
    return context;
};
