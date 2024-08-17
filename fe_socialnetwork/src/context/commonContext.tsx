"use client"


import { IError } from "@/app/lib/models/error";
import { createContext, useContext, useReducer } from "react";


interface CommonState {
    error: IError | null;
    showConfirmModal: boolean;
    showAddPostModal: boolean;
    postId: number;    
}

export enum ActionType {
    SetError,    
    ShowConfirmModal,
    SetPostIdWhenDelete,
    AddPostClick
}

export interface SetError {
    type: ActionType.SetError;
    payload: IError;
}

export interface ShowConfirmModal {
    type: ActionType.ShowConfirmModal;
    payload: boolean;
}

export interface YesModalClick {
    type: ActionType.SetPostIdWhenDelete;
    payload: number;
}

export interface AddPostClick {
    type: ActionType.AddPostClick;
    payload: boolean;
}


export type CommonActions = SetError | ShowConfirmModal | YesModalClick | AddPostClick;

interface CommonContextProps {
    commonState: CommonState;
    setError: (err: IError) => void;
    showConfirmModal: (data: boolean) => void;
    showAddPostModal: (data: boolean) => void;
    SetPostId: (postId: number) => void;
}

const CommonContext = createContext<CommonContextProps | undefined>(undefined);

const commonReducer = (state: CommonState, action: CommonActions): CommonState => {
    switch (action.type) {
        case ActionType.SetError:
            return {
                ...state,
                error: action.payload
            };

        case ActionType.ShowConfirmModal:
            return {
                ...state,
                showConfirmModal: action.payload
            };

        case ActionType.SetPostIdWhenDelete:
            return {
                ...state,
                postId: action.payload
            };

        case ActionType.AddPostClick:
            return {
                ...state,
                showAddPostModal: action.payload
            };
        default:
            return state;
    }
};

export const CommonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [commonState, dispatch] = useReducer(commonReducer, { 
        error: null,  
        showConfirmModal: false,
        showAddPostModal: false,
        postId: 0
    });

    const setError = (err: IError) => {
        dispatch({ type: ActionType.SetError, payload: err });
    };

    const showConfirmModal = (data: boolean) => {
        dispatch({ type: ActionType.ShowConfirmModal, payload: data });
    };

    const SetPostId = (data: number) => {
        dispatch({ type: ActionType.SetPostIdWhenDelete, payload: data });
    };

    const showAddPostModal = (data: boolean) => {
        dispatch({ type: ActionType.AddPostClick, payload: data });
    };

    return (
        <CommonContext.Provider value={{ commonState, setError, showConfirmModal, SetPostId, showAddPostModal }}>
            {children}
        </CommonContext.Provider>
    )
}

export const useCommon = () => {
    const context = useContext(CommonContext);
    if (!context) {
        throw new Error('useCommon must be used within a CommonProvider');
    }
    return context;
};
