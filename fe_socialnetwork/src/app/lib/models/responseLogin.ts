import { IUser } from "./user";

export interface ResponseLogin{
    user: IUser;
    token: string;
}