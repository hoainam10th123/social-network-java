"use client"

import { IComment } from "@/app/lib/models/comment";
import { IPost } from "@/app/lib/models/post";
import { createContext, useContext, useReducer } from "react";


interface CommonState {
    posts: IPost[]   
}

export enum ActionType {
    SetPosts, AddPost, RemovePost, AddComment
}

export interface SetPosts {
    type: ActionType.SetPosts;
    payload: IPost[];
}

export interface AddPost {
    type: ActionType.AddPost;
    payload: IPost;
}

export interface RemovePost {
    type: ActionType.RemovePost;
    payload: number;
}

export interface AddComment {
    type: ActionType.AddComment;
    payload: IComment;
}


export type CommonActions = SetPosts | AddPost | RemovePost | AddComment;

interface CommonContextProps {
    commonState: CommonState;
    SetPosts: (data: IPost[]) => void;
    AddPost: (data: IPost) => void;
    RemovePost: (data: number) => void;
    AddComment: (data: IComment) => void;
}

const PostContext = createContext<CommonContextProps | undefined>(undefined);

const commonReducer = (state: CommonState, action: CommonActions): CommonState => {
    switch (action.type) {
        case ActionType.SetPosts:
            return {
                ...state,
                posts: action.payload
            };

        case ActionType.AddPost:
            const tonTai = state.posts.some(x=>x.id === action.payload.id)
            if(!tonTai) state.posts.unshift(action.payload)
            return {
                ...state
            };

        case ActionType.RemovePost:
            state.posts = state.posts.filter(x=>x.id !== action.payload)
            return {
                ...state
            };

        case ActionType.AddComment:
            const post = state.posts.find(x=>x.id === action.payload.apostId)
            if(post){
                const tontaiCmt = post.comments.some(x=>x.id === action.payload.id)
                if(!tontaiCmt)
                    post.comments.push(action.payload)
            }
            return {
                ...state
            };
        default:
            return state;
    }
};

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [commonState, dispatch] = useReducer(commonReducer, { 
        posts: []
    });

    const SetPosts = (data: IPost[]) => {
        dispatch({ type: ActionType.SetPosts, payload: data });
    };

    const AddPost = (data: IPost) => {
        dispatch({ type: ActionType.AddPost, payload: data });
    };

    const RemovePost = (data: number) => {
        dispatch({ type: ActionType.RemovePost, payload: data });
    };

    const AddComment = (data: IComment) => {
        dispatch({ type: ActionType.AddComment, payload: data });
    };

    return (
        <PostContext.Provider value={{ commonState, SetPosts, AddPost, RemovePost, AddComment }}>
            {children}
        </PostContext.Provider>
    )
}

export const usePosts = () => {
    const context = useContext(PostContext);
    if (!context) {
        throw new Error('usePosts must be used within a PostProvider');
    }
    return context;
};
