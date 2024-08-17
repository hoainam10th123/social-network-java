import { IComment } from "./comment";
import { IUser } from "./user";

export interface IPost {
    id: number;
    username: string;
    content: string;
    createdDate: string;
    user: IUser;
    totalLikes: number;
    ownerUserLikePost: boolean;//de hien thi color Icon like
    comments: IComment[];
}